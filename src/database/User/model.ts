import mongoose from 'mongoose'
import userSchema, { User } from './schema'
import { modelName } from './config'

const User = mongoose.model<User>(modelName, userSchema);

export default User