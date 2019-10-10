import Boom from './lib/boom'

const boom = new Boom()
boom.get('/', (req, res) => {
  // res.end(JSON.stringify(req.boom.cookie))
  return {title: '12'}
})

boom.post('/list', (req, res) => {
  // res.end(JSON.stringify(req.boom.cookie))
  return {}
})

boom.server()