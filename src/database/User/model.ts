import mongoose from 'mongoose'
import schema, { User } from './schema'
import { modelName } from './config'

export default mongoose.model<User>(modelName, schema);