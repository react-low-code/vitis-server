export default abstract class BaseException {
    code: string;
    msg: string;
    status: number;
    
    constructor(code: string, msg: string) {
        this.code = code
        this.msg = msg
        this.status = 200
    }
}