import BaseException from './baseException'

export default class ExternalException extends BaseException {
    constructor(msg: string) {
        super('0003', msg)
    }
}