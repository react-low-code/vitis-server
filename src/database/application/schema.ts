import mongoose from 'mongoose'
import { BusinessUnitInfo } from '../businessUnit/schema'
import businessUnitModel from '../businessUnit/model'
import { createCommit } from '../../servers/gitlab'

interface History {
    user: string;
    parentCommitId?: string;
    time: string;
    commitId: string;
    projectId: string;
    commitMsg: string;
    filePath: string;
    branch: string;
}

interface ApplicationInfo {
    name: string;
    desc: string;
    released: boolean;
    schemaVersionHistories: History[];
    releasedSchemaCommitId: string | null;
    releasedTime: string | null;
    codeProjectId: string;
    codeCommitId: string | null;
}

interface Application extends ApplicationInfo {
    add: (bu: BusinessUnitInfo, appSchema: any, account: string) => Promise<void>
}

const historySchema = new mongoose.Schema<History>({
    user: String,
    parentCommitId: String,
    time: String,
    commitId: {
        unique: true,
        type: String,
        required: [true, 'commitId 是必填字段']
    },
    projectId: {
        type: String,
        required: [true, 'projectId 是必填字段']
    },
    commitMsg: {
        type: String,
        required: [true, 'commitMsg 是']
    },
    filePath: {
        type: String,
        required: [true, 'filePath 是必填字段']
    },
    branch: {
        type: String,
        required: [true, 'branch 是必填字段']
    }
}, {
    _id: false,
    id: false
})

const schema = new mongoose.Schema<Application>({
    name: {
        type: String,
        require: [true, 'name 是必填字段']
    },
    desc: {
        type: String,
        require: [true, 'desc 是必填字段']
    },
    released: Boolean,
    schemaVersionHistories: [historySchema],
    releasedSchemaCommitId: String,
    releasedTime: String,
    codeProjectId: {
        type: String,
        required: [true, 'codeProjectId 是必填字段']
    },
    codeCommitId: String
})

schema.methods.add = async function(bu: BusinessUnitInfo, appSchema: any, account: string) {
    const commit_message = `业务单元${bu.name}新增应用${this.name}`;
    const file_path = `src/${this.name}/schema.json`;
    const branch = 'develop'
    const {id, created_at } = await createCommit(bu.schemaProjectId, {
        branch,
        commit_message,
        actions: [{
            action: 'create',
            file_path: file_path,
            content: typeof appSchema === 'string' ? appSchema : JSON.stringify(appSchema)
        }]
    })
    
    this.schemaVersionHistories = [{
        user: account,
        time: created_at,
        commitId: id,
        projectId: bu.schemaProjectId,
        commitMsg: commit_message,
        filePath: file_path,
        branch,
    }]

    const app: any = await this.save();
    await (businessUnitModel as any).addApplication(bu.name, app._id)
}

export default schema
export type { Application }