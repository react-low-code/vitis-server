import Router from '@koa/router'
import user from './user'

const router = new Router()

export default router.use('/user', user.routes(), user.allowedMethods())
