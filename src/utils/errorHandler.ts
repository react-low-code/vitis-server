import type BaseException from '../exception/baseException'
import type Koa from 'koa'

export default function errorHandler(error: BaseException, ctx: Koa.Context) {
    ctx.status = error.status || 500
    ctx.body = {
        code: error.code,
        msg: error.msg,
        data: null
    }
}