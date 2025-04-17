import Router from '@koa/router'
import ComponentModel from '../database/Components/model'
import validate from 'validate-npm-package-name'
import semver from 'semver'
import ParamException from '../exception/paramException'
import successHandler from '../utils/successHandler'
import DBException from '../exception/dbException'
import { checkComponentParam } from '../middlewares/routerParam'

const router = new Router()

router.post('/upload', 
    checkComponentParam,
    async (context, next) => {
        const { packageName } = context.request.body!
        if (!packageName || !validate(packageName as string)) {
            throw new ParamException(`${packageName}不是合法 npm 包名`)
        }

        await next()
    },
    async (context) => {
        const { packageName, version, description, title, iconUrl, componentName } = context.request.body!
        const result = await ComponentModel.findOne({packageName}).exec()
        if (result) {
            if (semver.lte(version as string, result.latest)) {
                throw new ParamException(`${version}不大于最新的版本号${result.latest}`)
            }
            try {
                await result.updateOne({
                    latest: version,
                    versions: [...result.versions, version],
                    description,
                    title,
                    iconUrl,
                    componentName
                })
                successHandler(context)
            } catch (error: any) {
                new DBException(error)
            }
        } else {
            const newComponent = new ComponentModel({
                versions: [version],
                latest: version,
                description,
                packageName,
                title,
                iconUrl,
                componentName
            })
            try {
                await newComponent.save()
                successHandler(context)
            } catch (error: any) {
                throw new DBException(error)
                
            }
        }
    }
)

router.get('/list', async (context) => {
    try {
        const list = await ComponentModel.find({}, {_id: 0, versions: 0}).exec()
        successHandler(context, {
            total: list.length,
            data: list
        })
    } catch (error: any) {
        throw new DBException(error)
    }
})

router.get('/detail', async (context) => {
    const packageName = context.query.packageName
    if (packageName) {
        try {
            const result = await ComponentModel.findOne({packageName}, {_id: 0}).exec()
            successHandler(context, result)
        } catch (error: any) {
            throw new DBException(error)
        }
    } else {
        throw new ParamException('packageName 是必填字段')
    }

})

router.get('/versions', async (context) => {
    const packageName = context.query.packageName
    if (packageName) {
        let result
        try {
            result = await ComponentModel.findOne({packageName}, {_id: 0}).exec()
        } catch (error: any) {
            throw new DBException(error)
        }
        if (result) {
            successHandler(context, result?.versions)
        } else {
            throw new ParamException('不存在组件' + packageName)
        }
    } else {
        throw new ParamException('packageName 是必填字段')
    }
})

export default router