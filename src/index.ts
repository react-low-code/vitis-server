import './database/index'
import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import router from './router'

const app = new Koa()

app
    .use(async(context, next) => {
        context.set({
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE'
        })
        await next()
    })
    .use(koaStatic(process.cwd() + '/static')) 
    .use(bodyParser())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3001, () => {
    console.log('正在监听 3001')
})