import Router from '@koa/router'
const router = new Router()

router.get('/get',(context) => {
        context.body = [
                {
                        name: 'heyu',
                        id: 4
                }
        ]
})

export default router
