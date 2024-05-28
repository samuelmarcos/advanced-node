import { type RequestHandler, type Request, type Response, type NextFunction } from 'express'

import { getMockReq, getMockRes } from '@jest-mock/express'
import { mocked } from 'jest-mock'
import multer from 'multer'
import { ServerError } from '@/application/errors'

jest.mock('multer')

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, (error) => {
    res.status(500).json({ error: new ServerError(error).message })
  })
}

describe('MulterAdapter', () => {
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: any
  let fakeMulter: jest.Mocked<typeof multer>
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    fakeMulter = multer as jest.Mocked<typeof multer>
    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      req.file = { buffer: Buffer.from('any_buffer'), mimetype: 'any_type' }
      next()
    })

    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    mocked(fakeMulter).mockImplementation(multerSpy)

    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = adaptMulter
  })

  it('should call single upload iwth correct input', async () => {
    const req = getMockReq()

    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if upload fails', async () => {
    const error = new Error('multer_error')
    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      next(error)
    })
    const req = getMockReq()

    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error).message })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
