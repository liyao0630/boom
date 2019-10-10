import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import { BusinessException } from '../utils'

export default class Template {
  public templateDir: string
  public layoutTemplate: string
  constructor() {
    this.templateDir = path.resolve(__dirname, '../../view/template/')
    this.layoutTemplate = fs.readFileSync(path.resolve(__dirname, '../../view/template/layout.html'), 'utf-8')
  }

  show(filePath: string, data: object, layout: boolean = true) {
    filePath = this.templateDir + filePath
    if (!fs.existsSync(filePath)) {
      return new BusinessException(`${filePath}不存在`, -1)
    }
    let body = fs.readFileSync(filePath).toString()
    data = Object.assign({}, { title: '', seo: '', css: '', js: '', CDN: '' }, data, { body })
    if (layout) {
      let templateContent = this.layoutTemplate.replace('{{{body}}}', body)
      return ejs.render(templateContent, data)
    } else {
      return this.render(body, data)
    }
  }

  render(template: string, data: object, options?) {
    return ejs.render(template, data, options)
  }
}