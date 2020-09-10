import { BaseDataBase } from "./BaseDatabase";
import { User, UserLoginDTO } from "../models/User";
import { NotFoundError } from "../services/errors/NotFoundError";

export class UserDatabase extends BaseDataBase {
  tableName = "MyFrames_User"

  async userSignup(user: User): Promise<void> {
    console.log("Adding new user in database...")
    try {
      await this.getConnection().insert({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        nickname: user.getNickname(),
        password: user.getPassword()
      }).into(this.tableName)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getUserByEmailOrNickname(emailOrNickname: string): Promise<User> {
    try {
      const user = await this.getConnection().raw(`
        SELECT * FROM ${this.tableName}
        WHERE email = "${emailOrNickname}" OR nickname = "${emailOrNickname}"
      `)
      return User.toUserModel(user[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
}