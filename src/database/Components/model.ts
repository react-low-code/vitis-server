import mongoose from 'mongoose'
import schema, { MarketComponent } from './schema'
import { modelName } from './config'

export default mongoose.model<MarketComponent>(modelName, schema);
