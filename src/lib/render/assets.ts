import * as path from 'path'
import * as fs from 'fs'
import { BusinessException } from '../utils'

export default class Assets {
  public assetsDir: string
  constructor() {
    this.assetsDir = path.resolve(__dirname + '../../../../')
  }
  get(filePath: string) {
    filePath = this.assetsDir + filePath
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }
    return new BusinessException(`${filePath}不存在`, -1)
  }
}