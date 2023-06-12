import Router from '@koa/router'
import ParamException from '../exception/paramException';
import DBException from '../exception/dbException';
import Model from '../database/application/model'
import BUModel from '../database/businessUnit/model';
import successHandler from '../utils/successHandler';
import { checkBUName } from '../middlewares/routerParam';
import type Koa from 'koa';
import { Auth } from '../types'
import { getFileContent, createCommit } from '../servers/gitlab'

const router = new Router()

async function checkParams (ctx: Koa.Context & Auth, next: Koa.Next) {
    const { schema, name, desc } = ctx.request.body;

    if (!name) {
        throw new ParamException(`name 是必填字段`)
    }  else if (!desc) {
        throw new ParamException(`desc 是必填字段`)
    } else if (!schema) {
        throw new ParamException(`schema 是必填字段`)
    } else {
        await next()
    }
}

async function checkAppId(ctx: Koa.Context & Auth, next: Koa.Next) {
    if (!ctx.request.body.id && !ctx.query.id) {
        throw new ParamException('id 是必填字段')
    } else {
        await next()
    }
}

router.post('/add', 
    checkBUName,
    checkParams,
    async (ctx: Koa.Context & Auth) => {
        const { schema, BUName, name, desc } = ctx.request.body
        const BU = await BUModel.findOne({name: BUName})
        if (BU) {
            const app = new Model({
                name,
                desc,
                released: false,
                releasedSchemaCommitId: null,
                releasedTime: null,
                codeProjectId: BU.codeProjectId,
                codeCommitId: null
            })
            
            try {
                await app.add(BU, schema, ctx.account || '未知')
                successHandler(ctx)
            } catch (error: any) {
                throw new DBException(error)
            }
        } else {
            throw new ParamException(`不存在业务单元${BUName}`)
        }
    }
)

router.post('/update', checkAppId, async (ctx, next) => {
    const { filePath, projectId, schema, id, parentCommitId } = ctx.request.body
    if (!schema) {
        throw new ParamException('schema 是必填字段')
    } else if (!filePath){
        throw new ParamException('filePath 是必填字段')
    } else if (!projectId) {
        throw new ParamException('projectId 是必填字段')
    }
    const app = await Model.findById(id)
    const commit_message = `${app?.name} 更新 schema`
    const branch = 'develop'
    const {id: commitId, created_at } = await createCommit(projectId, {
        commit_message,
        branch,
        actions: [{
            action: 'update',
            file_path: filePath,
            content: typeof schema === 'string' ? schema: JSON.stringify(schema)
        }]
    })
    app?.schemaVersionHistories.push({
        user: ctx.account || '未知',
        time: created_at,
        commitId: commitId,
        commitMsg: commit_message,
        filePath,
        branch,
        parentCommitId
    })
    await app?.updateOne({
        schemaVersionHistories: app.schemaVersionHistories
    })

    successHandler(ctx)
})

router.get('/histories', checkAppId, async (ctx) => {
    const { id } = ctx.query;
    try {
        const result = await Model.findById(id)
        successHandler(ctx, result?.schemaVersionHistories || [])
    } catch (error) {
        throw new ParamException(`id 为 ${id} 的应用不存在`)
    }
})

router.get('/release', (ctx, next) => {

})

router.get('/schema', async (ctx) => {
    const { commitId, filePath, projectId } = ctx.query as any
    if (!commitId) {
        throw new ParamException('commitId 是必填字段')
    } else if (!filePath){
        throw new ParamException('filePath 是必填字段')
    } else if (!projectId) {
        throw new ParamException('projectId 是必填字段')
    }
    const content = await getFileContent(projectId, commitId, filePath)
    try {
        successHandler(ctx, JSON.parse(content))
    } catch (error) {
        successHandler(ctx,content)
    }
})

router.get('/list', checkBUName, async (ctx, next) => {
    const { BUName } = ctx.query
    const BU = await BUModel.findOne({name: BUName})
    if (BU) {
        const list =  await Model.find({
            _id: {$in: BU.applications}
        })

        successHandler(ctx, {
            total: list.length,
            data: list,
        })
    } else {
        throw new ParamException(`不存在业务单元${BUName}`)
    }
})

export default router

