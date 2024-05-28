import { getMockReq, getMockRes } from '@jest-mock/express'
import { type RequestHandler } from 'express'
import { mocked } from 'jest-mock'
import multer from 'multer'

jest.mock('multer')

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, () => {})
}

describe('MulterAdapter', () => {
  let uploadSpy: jest.Mock
  let multerSpy: any
  let singleSpy: jest.Mock

  beforeAll(() => {
    const fakeMulter = multer as jest.Mocked<typeof multer>
    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      req.file = { buffer: Buffer.from('any_buffer'), mimetype: 'any_type' }
      next()
    })

    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    mocked(fakeMulter).mockImplementation(multerSpy)
  })

  it('should call single upload iwth correct input', async () => {
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const sut = adaptMulter

    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})
