import mongoose from 'mongoose'

export interface ComponentBaseInfo {
    packageName: string;
    description: string;
    version: string;
}

export interface MarketComponent extends Omit<ComponentBaseInfo, "version">{
    /** 已有的全部版本 */
    versions: string[];
    /** 最新版本 */
    latest: string;
}

export default new mongoose.Schema<MarketComponent>({
    packageName: {
        unique: true,
        type: String,
        required: [true, '组件包名是必填字段']
    },
    description: {
        type: String,
        required: [true, '组件描述是必填字段']
    },
    latest: {
        type: String,
        required: [true, '组件最新版本是必填字段']
    },
    versions: {
        type: [String],
        required: [true, '组件全部版本是必填字段']
    }
})

