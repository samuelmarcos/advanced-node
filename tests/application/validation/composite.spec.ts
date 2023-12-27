import { type MockProxy, mock } from 'jest-mock-extended'
import { ValidationComposite, type Validator } from '@/application/validation'

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)

    validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)

    validators = [validator1, validator2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('should return undefined if all validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('validation_error1'))
    validator2.validate.mockReturnValue(new Error('validation_error2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('validation_error1'))
  })

  it('should return the error', () => {
    validator2.validate.mockReturnValueOnce(new Error('validation_error2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('validation_error2'))
  })
})
