import type Koa from 'koa';
import ParamException from '../exception/paramException';

export async function checkComponentParam(ctx: Koa.Context, next: Koa.Next) {
    const { packageName, version, description } = ctx.request.body
    if (!packageName) {
        throw new ParamException('packageName 是必填字段')
    } else if (!version) {
        throw new ParamException('version 是必填字段')
    } else if (!description) {
        throw new ParamException('description 是必填字段')
    } else {
        await next()
    }
}