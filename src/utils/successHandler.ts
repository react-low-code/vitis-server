import type Koa from 'koa'

export default function(ctx: Koa.Context, data: any = null) {
    ctx.status = 200
    ctx.body = {
        code: '0',
        data,
        msg: ''
    }
}