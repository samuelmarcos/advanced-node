import { type Router } from 'express'

export default (router: Router): void => {
  router.post('/login/facebook', (req, res) => {
    console.log('cheguei na rota')
    res.send({ data: 'any_Data' })
  })
}
