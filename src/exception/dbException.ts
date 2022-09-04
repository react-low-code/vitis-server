import BaseException from './baseException'

export default class DBException extends BaseException {
    constructor(msg: string) {
        super('0002', msg)
    }
}