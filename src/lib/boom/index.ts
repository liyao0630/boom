import * as http from 'http'
import Response from '../response'
import Request from '../request'
import { Assets, Template } from '../render'
import { BusinessException } from '../utils'

const assets = new Assets()
const template = new Template()
const response = new Response()

interface Options {
  prot: number,
  host: string,
  templatePath: string,
  assetsPath: string,
  CDN: string,
  commonTitle: string
}

interface RenderData {
  title?: string,
  css?: string[],
  js?: string[]
}

export default class Boom {
  public options: Options
  public layoutTemplate: string
  public getRouter: Map<string, any>
  public postRouter: Map<string, any>
  public chain: Function[]

  constructor(options?) {
    let defaultOptions = {
      prot: 9530,
      host: 'localhost',
      CDN: '',
      commonTitle: '-Boom'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.getRouter = new Map()
    this.postRouter = new Map()
  }

  isAssets(url: string): boolean {
    return /\/assets\//.test(url)
  }

  get(router: string, callback: Function) {
    this.getRouter.set(router, callback)
  }

  post(router: string, callback: Function) {
    this.postRouter.set(router, callback)
  }

  getPre(request) {
    // request.boom.payload
    // request.boom.query = request.
  }

  server() {
    http.createServer((req, res) => {
      try {
        let currentUrl = req.url
        let method = req.method
        let result: any = ''
        req['boom'] = {}
        if (method === 'GET') {
          if (this.getRouter.has(currentUrl)) {
            let data: RenderData = this.getRouter.get(currentUrl)(req, res)
            result = template.show('/index.html', data)
          }
        }

        if (method === "POST") {
          if (this.postRouter.has(currentUrl)) {
            result = this.postRouter.get(currentUrl)(req, res)
          }
        }

        if (this.isAssets(currentUrl)) {
          result = assets.get(currentUrl)
        }

        if (result === undefined) {
          return
        }

        response.end(req, res, result)

      } catch (error) {
        response.end(req, res, new BusinessException('Business Exception', -1, { message: error.message }))
      }

    }).listen(this.options.prot, this.options.host)
  }
}
