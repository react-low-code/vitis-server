import mongoose from 'mongoose'
import { modelName } from './config'
import ParamException from '../../exception/paramException';
import DBException from '../../exception/dbException'

export interface User {
    /** 账号 */
    account: String;
    /** 密码 */
    password: Number;
    /** 是否有编辑/新增应用的权限 */
    editable: Boolean; 
    /** 是否有发布应用的权限 */
    releasable: Boolean;
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
    const one = await mongoose.model(modelName).findOne({account: this.account}).exec()
    if (one) {
        throw new ParamException(`${this.account}已存在`)
    } 
    try {
        return await this.save()
    } catch (error: any) {
        throw new DBException(error)
    }
}

export default userSchema