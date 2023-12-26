type HttpResponse = {
  statusCode: number
  data: any
}

class FacebookController {
  public async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

describe('FacebookLoginController', () => {
  it('shoud return 400 if token is empty', async () => {
    const sut = new FacebookController()

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})
