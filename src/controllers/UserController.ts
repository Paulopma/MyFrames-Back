import {Response, Request} from "express"
import { UserSignupDTO } from "../models/User"
import { UserBusiness } from "../business/UserBusiness"

export class UserController {
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
      console.log(user)

      const token = await new UserBusiness().userSignup(user)

      res.status(200).send(token)
    } catch (error) {
      res.status(400).send({error: error.message})
    }
  }
}