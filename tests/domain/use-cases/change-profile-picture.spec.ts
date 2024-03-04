import { type MockProxy, mock } from 'jest-mock-extended'
import { type DeleteFile, type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { setupChangeProfilePicure, type ChangeProfilePicture } from '@/domain/use-cases/change-profile-picture'
import { type SaveUserPicture, type LoadUserProfile } from '@/domain/contracts/repos'
import { mocked } from 'jest-mock'
import { UserProfile } from '@/domain/entities'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    userProfileRepo = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
    userProfileRepo.load.mockResolvedValue({ name: 'Samuel Marcos' })
  })

  beforeEach(() => {
    sut = setupChangeProfilePicure(fileStorage, crypto, userProfileRepo)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ file, id: 'any_id' })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalledWith({ file, key: 'any_unique_id' })
  })

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepo.load.mockResolvedValueOnce(undefined)
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    UserProfile.prototype.id = 'any_id'
    UserProfile.prototype.pictureUrl = 'any_url'
    UserProfile.prototype.initials = 'any_initials'
    UserProfile.prototype.setPicture = jest.fn()

    const result = await sut({ id: 'any_id', file })

    expect(result).toMatchObject({ pictureUrl: 'any_url', initials: 'any_initials' })
  })

  it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: 'any_id', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call DeleteFile when file does not exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: 'any_id', file: undefined })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should rethrow if SaveUserPicture throws', async () => {
    const error = new Error('save_error')
    userProfileRepo.savePicture.mockRejectedValueOnce(error)
    const promise = sut({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(error)
  })
})
