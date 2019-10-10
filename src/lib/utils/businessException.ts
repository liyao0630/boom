export default class BusinessException {
  public msg: string
  public errorCode: number
  public data: any
  constructor(msg: string, code: number, data: any = {}) {
    this.msg = msg
    this.errorCode = code || -1
    this.data = data
  }
}
