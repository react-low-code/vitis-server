import Router from '@koa/router'
import type Koa from 'koa';
import ParamException from '../exception/paramException';
import DBException from '../exception/dbException';
import Model from '../database/businessUnit/model'
import successHandler from '../utils/successHandler';
import { checkComponentParam } from '../middlewares/routerParam'

const router = new Router()

async function checkBUName(ctx: Koa.Context, next: Koa.Next) {
    const { name } = ctx.request.body
    if (!name) {
        throw new ParamException('name 是必填字段')
    } else {
        await next()
    }
}

router.post('/add', 
    async (ctx, next) => {
        const { name, desc } = ctx.request.body;
        if (!name) {
            throw new ParamException('name 是必填字段')
        }

        if (!desc) {
            throw new ParamException('desc 是必填字段')
        }
        await next()
    }, 
    async (ctx) => {
        const { name, desc } = ctx.request.body;
        const result = await Model.findOne({name}).count()
        if (result > 0) {
            throw new ParamException(`${name}已存在`)
        }

        const bu = new Model({
            name,
            desc,
            components: [],
            applications: []
        })
        try {
            const newBu = await bu.add()

            successHandler(ctx, newBu)
        } catch (error: any) {
            throw new DBException(error)
        }
    }
)

router.post('/pick/component', 
    checkBUName,
    checkComponentParam,
    async (ctx) => {
        const { packageName, name, version, description } = ctx.request.body
        const result = await Model.findOne({name})
        if (!result) {
            throw new ParamException(`不存在业务单元${name}`)
        }

        if (result.components.find((item) => item.packageName === packageName)) {
            throw new ParamException(`${name}中已存在${packageName}组件`)
        }
        await result.updateOne({
            components: [{packageName, version, description}, ...result.components]
        })
        
        successHandler(ctx)
    }
)

router.post('/update/component/version', 
    checkBUName,
    checkComponentParam,
    async (ctx) => {
        const { packageName, buId, version, description } = ctx.request.body
        const result = await Model.findById(buId)
        if (!result) {
            throw new ParamException(`不存在业务单元${buId}`)
        }
        const index = result.components.findIndex(item => item.packageName === packageName)
        if (index < 0) {
            throw new ParamException(`业务单元${buId}不存在${packageName}组件`)
        }

        result.components.splice(index, 1, {
            packageName,
            version,
            description
        })

        await result.updateOne({
            components: result.components
        })

        successHandler(ctx)
    }
)

router.get('/list', async (ctx) => {
    const result = await Model.find({}, { applications: 0, schemaProjectId: 0, codeProjectId: 0, _id: 0 }).exec()
    successHandler(ctx, result)
})

router.get('/components', checkBUName, async (ctx) => {
    const { name } = ctx.request.body
    const result = await Model.findOne({name})
    if (!result) {
        throw new ParamException(`不存在业务单元${name}`)
    }

    successHandler(ctx, result.components)
})

export default router