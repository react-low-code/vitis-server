import type Koa from 'koa';
import jwt from 'jsonwebtoken';
import { noAuths } from '../config'
import AuthException from '../exception/authException'
import { secret } from '../config'
import { Auth } from '../types'

export default async function auth(ctx: Koa.Context & Auth, next: Koa.Next) {
    if (noAuths.includes(ctx.path)) {
        await next()
    } else {
        const token = ctx.request.headers["authorization"]
        if (!token) {
            throw new AuthException('请登录')
        }
        const tokenItem: any = jwt.verify(token, secret)
        if (new Date().getTime() / 1000 > tokenItem.exp) {
            throw new AuthException('登录过期')
        }
        ctx.account = tokenItem.account
        await next()
    }
}