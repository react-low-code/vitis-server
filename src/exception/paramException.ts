import BaseException from './baseException'

export default class ParamException extends BaseException {
    constructor(msg: string) {
        super('0001', msg)
    }
}