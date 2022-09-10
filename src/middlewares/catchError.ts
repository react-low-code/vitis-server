import BaseException from "../exception/baseException"
import type Koa from 'koa'

export default async function(ctx: Koa.Context, next: Koa.Next) {
    try {
        await next()
    } catch (error) {
        if (error instanceof BaseException) {
            ctx.app.emit('error', error, ctx)
        } else {
            ctx.status = 500,
            ctx.body = {
                code: '-1',
                msg: '服务器内部错误:' + error
            }
        }
    }
}