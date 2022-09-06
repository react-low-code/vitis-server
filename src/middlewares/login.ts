import type Koa from 'koa'
import mongoose from 'mongoose'
import { modelName } from '../database/User/config'
import successHandler from '../utils/successHandler'

export default async function(ctx: Koa.Context, next: Koa.Next) {
    const { account, password } = ctx.request.body
    const token = await (mongoose.model(modelName) as any).login({account, password})
    await next()
    successHandler(ctx,{
        token,
        account
    })
}