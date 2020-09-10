import { UserSignupDTO, User, UserLoginDTO } from "../models/User";
import { InvalidParameterError } from "../services/errors/InvalidParameterError";
import { IdGenerator } from "../services/idGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/hashManager";
import { TokenGenerator } from "../services/tokenGenerator";
import { UnauthorizedError } from "../services/errors/UnauthorizedError";

export class UserBusiness {
 async userSignup(user: UserSignupDTO) {
   console.log("Validating user atributes...")
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
    const encryptedPassword = await new HashManager().hash(user.password)
    
    const newUser = new User(
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
  
  async login(userInput: UserLoginDTO) {
    const user = await new UserDatabase().getUserByEmailOrNickname(userInput.login)
    
    const passwordPass = await new HashManager().compare(userInput.password, user.getPassword())
    console.log(passwordPass)
    console.log(userInput.password)
    console.log(user.getPassword())
    console.log(user)

    if(!passwordPass || !user) {
      throw new UnauthorizedError("Incorrect login or password")
    }

    const token = TokenGenerator.generate({id: user.getId()})
    return token
  }
}