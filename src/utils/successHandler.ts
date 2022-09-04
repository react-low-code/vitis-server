import type Koa from 'koa'

export default function(ctx: Koa.Context, data?: any) {
    ctx.status = 200
    ctx.body = {
        code: '0',
        data
    }
}