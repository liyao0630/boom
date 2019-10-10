import { BusinessException } from '../utils'

export default class Response {
  public defaultContent: string
  constructor() {
    this.defaultContent = "application/json"
  }

  public getContentType(requset): string {
    let contentType: string = ''
    /* let extname: string = path.extname(requset.url)
    console.log(extname, requset.url)
    if (extname) {
      contentType = content_types[extname]
    } */

    let accept: string = requset.headers.accept
    if (accept) {
      contentType = accept.split(',')[0]
    }
    return contentType || this.defaultContent
  }


  public end(requset, response, result) {
    let content_type: string = this.defaultContent
    if (result && !(result instanceof BusinessException)) {
      content_type = this.getContentType(requset)
      if (content_type.includes('json')) {
        result = JSON.parse(result)
      }
    } else {
      result = JSON.stringify(result)
    }

    response.writeHead(200, {
      'charset': 'utf-8',
      'Content-Type': content_type
    })
    response.end(result)
  }
}

