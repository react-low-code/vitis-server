import mongoose from 'mongoose'
import userSchema from './schema'

const User = mongoose.model('user', userSchema);