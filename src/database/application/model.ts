import mongoose from 'mongoose'

import schema, { Application } from './schema'
import { modelName } from './config'

export default mongoose.model<Application>(modelName, schema);