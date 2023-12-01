import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { FacebookAthenticationService } from '@/data/services'
import { mock, type MockProxy } from 'jest-mock-extended'
import { type FacebookAuthentication } from '@/domain/features'

type SutTypes = {
  sut: FacebookAuthentication
  loadFacebookUserSpy: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAthenticationService(loadFacebookUserSpy)

  return { sut, loadFacebookUserSpy }
}

describe('Facebook Athentication Service', () => {
  it('shoud call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserSpy } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserSpy } = makeSut()
    const authResult = await sut.perform({ token: 'any_token' })
    loadFacebookUserSpy.loadUser.mockResolvedValueOnce(undefined)
    expect(authResult).toEqual(new AuthenticationError())
  })
})
