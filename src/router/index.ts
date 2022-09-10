import Router from '@koa/router'
import user from './user'
import login from '../middlewares/login'
import components from './components'

const router = new Router()

export default router
                .post('/login', login)
                .use('/user', user.routes(), user.allowedMethods())
                .use('/components', components.routes(), user.allowedMethods())
