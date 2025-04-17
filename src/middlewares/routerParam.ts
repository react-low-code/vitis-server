import type Koa from 'koa';
import ParamException from '../exception/paramException';

export async function checkComponentParam(ctx: Koa.Context, next: Koa.Next) {
    const { packageName, version, description, title, componentName, iconUrl } = ctx.request.body!
    if (!packageName) {
        throw new ParamException('packageName 是必填字段')
    } else if (!version) {
        throw new ParamException('version 是必填字段')
    } else if (!description) {
        throw new ParamException('description 是必填字段')
    } else if (!title) {
        throw new ParamException('title 是必填字段')
    } else if (!componentName) {
        throw new ParamException('componentName 是必填字段')
    } else if (!iconUrl) {
        throw new ParamException('iconUrl 是必填字段')
    } else {
        await next()
    }
}

export async function checkBUName(ctx: Koa.Context, next: Koa.Next) {
    if (!ctx.request.body!.BUName && !ctx.query.BUName) {
        throw new ParamException('BUName 是必填字段')
    } else {
        await next()
    }
}