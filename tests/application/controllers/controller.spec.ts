import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { ValidationComposite } from '@/application/validation'
import { type HttpResponse } from '../helpers'

import { mocked } from 'jest-mock'

jest.mock('@/application/validation/composite')

class ControllerStup extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  public async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStup

  beforeEach(() => {
    sut = new ControllerStup()
  })

  it('shoud return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([])

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('shoud return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('shoud return 500 if perform throws a unknown error object', async () => {
    jest.spyOn(sut, 'perform').mockRejectedValueOnce('perform_error')

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(undefined)
    })
  })

  it('shoud return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
