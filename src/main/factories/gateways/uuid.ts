import { UUIHandler, UniqueId } from '@/infra/gateways'

export const makeUUIDHandler = (): UUIHandler => {
  return new UUIHandler()
}

export const makeUniqueId = (): UniqueId => {
  return new UniqueId(new Date())
}
