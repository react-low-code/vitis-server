import Router from '@koa/router'
import { fetchSchema } from '../servers/prompt';
import ParamException from '../exception/paramException';
import ExternalException from '../exception/externalException';
import successHandler from '../utils/successHandler'

const router = new Router()

router.post('/generate/schema', async (context) => {
  try {
    const {prompt} = context.request.body!
    if (!prompt) {
      throw new ParamException(`不存在关键字`)
    }
    
    const schema = await fetchSchema(prompt as string)
    successHandler(context, JSON.parse(schema || '[]'))
  } catch (error: any) {
    throw new ExternalException(error);
  }
})

export default router
