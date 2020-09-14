import {Response, Request} from "express"
import { UserSignupDTO, UserLoginDTO } from "../models/User"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../data/UserDatabase"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenGenerator } from "../services/TokenGenerator"

export class UserController {
  private static userBusiness = new UserBusiness(
    new UserDatabase(), 
    new HashManager(), 
    new IdGenerator(), 
    new TokenGenerator()
  )
  
  async userSignup(req: Request, res: Response) {
    try {
      console.log('Sending token...')
      const {name, email, nickname, password} = req.body
      const user: UserSignupDTO = {
        name,
        email,
        nickname,
        password
      }

      const token = await UserController.userBusiness.userSignup(user)

      res.status(200).send(token)
    } catch (error) {
      res.status(400).send({error: error.message})
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      const userInput: UserLoginDTO = {
        login: req.body.login,
        password: req.body.password
      }
    const token = await UserController.userBusiness.login(userInput)
    res.status(200).send({message: 'User successfuly logedin', token})
    } catch (error) {
      res.status(400).send({error: error.message})
    }
  }
}