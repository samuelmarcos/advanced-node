import { type UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UUIHandler implements UUIDGenerator {
  public uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}
