import BaseException from './baseException'

export default class AuthException extends BaseException {
    constructor(msg: string) {
        super('0004', msg)
    }
}