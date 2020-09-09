import { UserSignupDTO, User } from "../models/User";
import { InvalidParameterError } from "../services/errors/InvalidParameterError";
import { IdGenerator } from "../services/idGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/hashManager";
import { TokenGenerator } from "../services/tokenGenerator";

export class UserBusiness extends User {
 async userSignup(user: UserSignupDTO) {
    function validateEmail(email: string): boolean {
      const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      return re.test(String(email).toLowerCase());
    }

    if(user.password.length < 6) {
      throw new InvalidParameterError('Password must have at least six characters')
    }
    if(!validateEmail(user.email)) {
      throw new InvalidParameterError('Invalid e-mail format')
    }

    const id = IdGenerator.generate()
    const encryptedPassword = await HashManager.hash(user.email)
    
    const newUser = new User (
      id,
      user.name,
      user.email,
      user.nickname,
      encryptedPassword
    )
      
    const token = TokenGenerator.generate({id: newUser.getId()})

    await new UserDatabase().userSignup(newUser)

    return token
  }
}