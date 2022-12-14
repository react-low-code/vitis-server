import './database/index'
import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import router from './router'
import catchError from './middlewares/catchError'
import errorHandler from './utils/errorHandler'
import auth from './middlewares/auth'

const app = new Koa()

app
    .use(catchError)
    .use(async(context, next) => {
        
        context.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, authorization'
        })
        await next()
    })
    .use(koaStatic(process.cwd() + '/static')) 
    .use(bodyParser())
    .use(compress())
    // .use(auth)
    .use(router.routes())
    .use(router.allowedMethods())
    .on('error', errorHandler)

app.listen(3001, () => {
    console.log('正在监听 3001')
})