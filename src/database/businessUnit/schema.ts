import mongoose from 'mongoose'
import { ComponentBaseInfo } from '../Components/schema'
import { createProject } from '../../servers/gitlab'
import { modelName } from './config'
import DBException from '../../exception/dbException';

interface BusinessUnitInfo {
    name: string;
    desc: string;
    schemaProjectId: string;
    codeProjectId: string;
    components: ComponentBaseInfo[];
    applications: string[]
}

interface BusinessUnit extends BusinessUnitInfo{
    add: () => Promise<BusinessUnitInfo>
}

const componentSchema = new mongoose.Schema<ComponentBaseInfo>({
    packageName: {
        unique: true,
        type: String,
        required: [true, '组件包名是必填字段']
    },
    description: {
        type: String,
        required: [true, '组件描述是必填字段']
    },
    version: {
        type: String,
        required: [true, '组件版本是必填字段']
    }
}, {
    id: false,
    _id: false
})

const schema = new mongoose.Schema<BusinessUnit>({
    name: {
        type: String,
        unique: true,
        required: [true,'name 是必填的字段']
    },
    desc: {
        type: String,
        required: [true,'desc 是必填的字段']
    },
    schemaProjectId: {
        type: String,
        required: [true,'schemaProjectId 是必填的字段']
    },
    codeProjectId: {
        type: String,
        required: [true,'codeProjectId 是必填的字段']
    },
    components: {
        type: [componentSchema],
        required: [true,'components 是必填的字段']
    },
    applications: {
        type: [String],
        required: [true,'applications 是必填的字段']
    }
})

schema.methods.add = async function() {
    const [schemaProjectId, codeProjectId] = await Promise.all([createProject(`${this.name}-schema`, `用来保存${this.name}业务单元的应用的 Schema`), createProject(`${this.name}-code`, `用来保存${this.name}业务单元的应用的源码`)])
    this.schemaProjectId = schemaProjectId;
    this.codeProjectId = codeProjectId;

    return await this.save()
}

schema.statics.addApplication = async function (name: string, applicationId: string) {
    const one = await mongoose.model<BusinessUnitInfo>(modelName).findOne({name}).exec()
    if (one) {
        one.applications.push(applicationId)
        await one.updateOne({
            applications: one.applications
        })
    } else {
        throw `业务单元${name}不存在`
    }
}

export default schema
export type { BusinessUnit, BusinessUnitInfo } 
export { componentSchema }