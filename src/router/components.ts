import Router from '@koa/router'
import ComponentModel from '../database/Components/model'
import validate from 'validate-npm-package-name'
import semver from 'semver'
import ParamException from '../exception/paramException'
import successHandler from '../utils/successHandler'
import DBException from '../exception/dbException'

const router = new Router()

router.post('/upload', 
    async (context, next) => {
        const { packageName, version, description } = context.request.body
        if (!packageName) {
            throw new ParamException('packageName 是必填字段')
        } else if (!version) {
            throw new ParamException('version 是必填字段')
        } else if (!description) {
            throw new ParamException('description 是必填字段')
        } else {
            if (!validate(packageName)) {
                throw new ParamException(`${packageName}不是合法 npm 包名`)
            }

            await next()
        }
    },
    async (context) => {
        const { packageName, version, description } = context.request.body
        const result = await ComponentModel.findOne({packageName}).exec()
        if (result) {
            if (semver.lte(version, result.latest)) {
                throw new ParamException(`${version}不大于最新的版本号${result.latest}`)
            }
            try {
                await result.updateOne({
                    latest: version,
                    versions: [...result.versions, version],
                    description
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
                packageName
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

export default router