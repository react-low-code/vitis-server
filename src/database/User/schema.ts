import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ExternalException from '../../exception/externalException'
import { modelName } from './config'
import ParamException from '../../exception/paramException';
import DBException from '../../exception/dbException'
import { saltRounds, secret } from '../../config'

interface UserInfo {
    /** 账号 */
    account: string;
    /** 密码 */
    password: string;
    /** 是否有编辑/新增应用的权限 */
    editable: boolean; 
    /** 是否有发布应用的权限 */
    releasable: boolean;
}
export interface User extends UserInfo{
    /** 添加新的账号*/
    add: () => Promise<any>
}

 const userSchema =  new mongoose.Schema<User>({
    account: {
        unique: true,
        type: String,
        required: [true, '用户账号是必填字段']
    },
    password: {
        type: String,
        required: [true, '用户密码是必填字段']
    },
    editable: Boolean,
    releasable: Boolean,
}, {
    id: false,
});

userSchema.methods.add = async function() {
    const one = await mongoose.model<UserInfo>(modelName).findOne({account: this.account}).exec()
    if (one) {
        throw new ParamException(`${this.account}已存在`)
    } 

    let hash: string = ''
    try {
        hash = await bcrypt.hash(this.password, saltRounds); 
    } catch (error: any) {
        throw new ExternalException(error)   
    }

    try {
        this.password = hash;
        return await this.save()
    } catch (error: any) {
        throw new DBException(error)
    }
}

userSchema.statics.login = async function (info: Pick<UserInfo, 'account' | 'password'>) {
    const one = await mongoose.model<UserInfo>(modelName).findOne({account: info.account}).exec()
    if (one) {
        try {
            const matched =  await bcrypt.compare(info.password, one.password)
            if (matched) {
                return jwt.sign({ _id: one._id, account: one.account }, secret, {
                    expiresIn: '1d',
                })
            } else {
                throw new ParamException(`${info.account}的密码错误`)
            }
        } catch (error: any) {
            throw new ExternalException(error)
        }
    } else {
        throw new ParamException(`${info.account}不存在`)
    }
}

export default userSchema