import { ValidationBuilder, RequiredString, RequiredBuffer, Required, MaxFileSize, AllowedMimeTypes } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_name' }).required().build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  it('should return a RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: buffer }).required().build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return a Required', () => {
    const validators = ValidationBuilder.of({ value: { any: 'any' } }).required().build()

    expect(validators).toEqual([new Required({ any: 'any' })])
  })

  it('should return a RequiredBuffer and Required', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer } }).required().build()

    expect(validators).toEqual([new Required({ buffer }), new RequiredBuffer(buffer)])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer } }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()

    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  it('should return correct image validators', () => {
    const validators = ValidationBuilder.of({ value: { mimeType: 'image/png' } }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer, mimeType: 'image/png' } }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png'), new MaxFileSize(6, buffer)])
  })
})
