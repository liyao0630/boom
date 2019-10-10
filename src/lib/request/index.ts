import * as querystring from 'querystring'

export default class Request {

  public cookieParse(request) {
    if (!request.headers.cookie) {
      return
    }
    request.boom.cookie = {}
    decodeURIComponent(request.headers.cookie).split('; ').forEach(val => {
      let item = val.split('=')
      request.boom.cookie[item[0]] = item[1]
    })
  }

  public bodyParse(req) {
    /*
    let body: string
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', async () => {
      request.boom.payload = querystring.parse(body)
      callback && callback(request, response)
    })
    */
    return new Promise((resolve, reject) => {
      try {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          resolve(querystring.parse(body))
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
