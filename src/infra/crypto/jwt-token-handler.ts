import { type TokenValidator, type TokenGenerator } from '@/domain/contracts/crypto'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  public async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })

    return token
  }

  public async validateToken (params: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(params.token, this.secret) as JwtPayload
    return payload.key
  }
}
