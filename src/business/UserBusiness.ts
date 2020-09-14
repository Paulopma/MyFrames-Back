import { UserSignupDTO, User, UserLoginDTO } from "../models/User";
import { InvalidParameterError } from "../services/errors/InvalidParameterError";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { TokenGenerator } from "../services/TokenGenerator";
import { UnauthorizedError } from "../services/errors/UnauthorizedError";
import { GenericError } from "../services/errors/GenericError";

export class UserBusiness {

  constructor(
    private userDatabase: UserDatabase,
    private hashManager: HashManager,
    private idGenerator: IdGenerator,
    private tokenGenerator: TokenGenerator
  ){}

 async userSignup(user: UserSignupDTO) {
   
   if(!user.email || !user.name || !user.nickname || !user.password) {
     throw new GenericError('All fields are required')
    }
    
    if(await this.userDatabase.verifyEmailAvailability(user.email)) {
      throw new GenericError('E-mail already registered')
    }
    
    if(await this.userDatabase.verifyNicknameAvailability(user.nickname)) {
      throw new GenericError('This nickname is already in use')
    }
    
    if(user.password.length < 6) {
      throw new InvalidParameterError('Password must have at least six characters')
    }

    function validateEmail(email: string): boolean {
      const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(user.email)) {
      throw new InvalidParameterError('Invalid e-mail format')
    }

    const id = this.idGenerator.generate()
    const encryptedPassword = await this.hashManager.hash(user.password)
    
    const newUser = new User(
      id,
      user.name,
      user.email,
      user.nickname,
      encryptedPassword
    )
    const token = this.tokenGenerator.generate({id: newUser.getId()})
    await this.userDatabase.userSignup(newUser)
    return token
  }
  
  async login(userInput: UserLoginDTO) {
    const user = await this.userDatabase.getUserByEmailOrNickname(userInput.login)
    
    const passwordPass = await this.hashManager.compare(userInput.password, user.getPassword())

    if(!passwordPass || !user) {
      throw new UnauthorizedError("Incorrect login or password")
    }

    const token = this.tokenGenerator.generate({id: user.getId()})
    return token
  }
}