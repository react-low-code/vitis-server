import Router from '@koa/router'
import user from './user'
import login from '../middlewares/login'
import components from './components'
import businessUnit from './businessUnit'

const router = new Router()

export default router
                .post('/login', login)
                .use('/user', user.routes(), user.allowedMethods())
                .use('/marketComponent', components.routes(), user.allowedMethods())
                .use('/businessUnit', businessUnit.routes(), businessUnit.allowedMethods())
