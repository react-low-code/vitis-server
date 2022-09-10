import mongoose from 'mongoose'

import schema, { BusinessUnit } from './schema'
import { modelName } from './config'

export default mongoose.model<BusinessUnit>(modelName, schema);