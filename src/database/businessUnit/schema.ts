import mongoose from 'mongoose'
import { ComponentBaseInfo } from '../Components/schema'
import { createProject } from '../../servers/gitlab'

interface BusinessUnitInfo {
    name: string;
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
        required: [true,'name 是必填的字段']
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
    const [schemaProjectId, codeProjectId] = await Promise.all([createProject(`${this.name}-schema`), createProject(`${this.name}-code`)])
    this.schemaProjectId = schemaProjectId;
    this.codeProjectId = codeProjectId

    return await this.save()
}

export default schema
export type { BusinessUnit } 
export { componentSchema }