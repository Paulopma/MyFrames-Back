import * as jwt from "jsonwebtoken"

export class TokenGenerator {
  private static expiresIn = process.env.JWT_EXPIRES_IN

  public generate = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    )
    return newToken
  }

  public verify(token: string) {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any
    const result = payload.id
    return result
  }
}

export interface AuthenticationData {
  id: string
}