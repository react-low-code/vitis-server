import axios from "axios"
import ENV_CONFIG from '../../env.config.json'

const instance = axios.create({
    baseURL: ENV_CONFIG.GITLAB_URL,
    headers: {
        "PRIVATE-TOKEN": ENV_CONFIG.GITLAB_TOKEN,
        "Content-Type": 'application/json'
    }
})

export async function createProject(name: string, description: string) {
    const result = await instance.request({
        method: 'POST',
        url: '/api/v4/projects',
        data: {
            name,
            description,
            default_branch: 'develop',
            initialize_with_readme: true,
            visibility: 'public',
        }
    })
    const projectId = result.data.id
    await createCommit(projectId, {
        branch: 'develop',
        commit_message: '初始化',
        actions: [
            {
                "action": "create",
                "file_path": "readme.md",
                "content": description
            }
        ]
    })
    await createBranch(projectId, 'master', 'develop')
    return projectId
}

interface CreateCommitParam {
    branch: string, 
    commit_message: string, 
    actions: Action[],
    start_branch?: string,
    start_sha?: string,
    [attr: string]: any
}

interface Action {
    action: 'create' | 'delete' | 'move' | 'update' | 'chmod',
    file_path: string,
    previous_path?: string,
    content?: string,
    encoding?: string,
    last_commit_id?: string,
    execute_filemode?: boolean
}

export async function createCommit(projectId: string, params: CreateCommitParam) {
    const result = await instance.request({
        method: 'POST',
        url: `/api/v4/projects/${projectId}/repository/commits`,
        data: params
    })

    return result.data
}

export async function createBranch(projectId: string, branch: string, ref: string) {
    const result = await instance.request({
        method: 'POST',
        url: `/api/v4/projects/${projectId}/repository/branches`,
        params: {
            branch,
            ref
        }
    })

    return result.data
}

export async function getFileContent(projectId: string, ref: string, file_path: string) {
    const result = await instance.request({
        method: 'GET',
        url: `/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(file_path)}/raw`,
        params: {
            ref
        }
    })

    return result.data
}