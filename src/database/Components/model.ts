import mongoose from 'mongoose'
import componentSchema, { MarketComponent } from './schema'
import { modelName } from './config'

const model = mongoose.model<MarketComponent>(modelName, componentSchema);

export default model