import { type TokenValidator, type TokenGenerator } from '@/domain/contracts/gateways'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  public async generate ({ expirationInMs, key }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    const token = jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })

    return token
  }

  public async validate (params: TokenValidator.Input): Promise<TokenValidator.Output> {
    const payload = jwt.verify(params.token, this.secret) as JwtPayload
    return payload.key
  }
}
