import Router from '@koa/router'
import type Koa from 'koa';
import ParamException from '../exception/paramException';
import DBException from '../exception/dbException';
import Model from '../database/businessUnit/model'
import successHandler from '../utils/successHandler';
import { checkComponentParam, checkBUName } from '../middlewares/routerParam'

const router = new Router()

router.post('/add', 
    checkBUName,
    async (ctx, next) => {
        const { desc } = ctx.request.body;

        if (!desc) {
            throw new ParamException('desc 是必填字段')
        }
        await next()
    }, 
    async (ctx) => {
        const { BUName, desc } = ctx.request.body;
        const result = await Model.findOne({name: BUName}).count()
        if (result > 0) {
            throw new ParamException(`${BUName}已存在`)
        }

        const bu = new Model({
            name: BUName,
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
        const { packageName, BUName, version, description, title, componentName, iconUrl } = ctx.request.body
        const result = await Model.findOne({name: BUName})
        if (!result) {
            throw new ParamException(`不存在业务单元${BUName}`)
        }

        if (result.components.find((item) => item.packageName === packageName)) {
            throw new ParamException(`${BUName}中已存在${packageName}组件`)
        }
        await result.updateOne({
            components: [{packageName, version, description, title, componentName, iconUrl}, ...result.components]
        })
        
        successHandler(ctx)
    }
)

router.post('/update/component/version', 
    checkBUName,
    checkComponentParam,
    async (ctx) => {
        const { packageName, BUName, version, description, title, iconUrl, componentName} = ctx.request.body
        const result = await Model.findOne({name: BUName})
        if (!result) {
            throw new ParamException(`不存在业务单元${BUName}`)
        }
        const index = result.components.findIndex(item => item.packageName === packageName)
        if (index < 0) {
            throw new ParamException(`业务单元${BUName}不存在${packageName}组件`)
        }

        result.components.splice(index, 1, {
            packageName,
            version,
            description,
            title,
            iconUrl,
            componentName
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
    const { BUName } = ctx.request.body
    const result = await Model.findOne({name: BUName})
    if (!result) {
        throw new ParamException(`不存在业务单元${BUName}`)
    }

    successHandler(ctx, result.components)
})

export default router