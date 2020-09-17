import { BaseDataBase } from "./BaseDatabase";
import { User, UserLoginDTO } from "../models/User";
import { NotFoundError } from "../services/errors/NotFoundError";

export class UserDatabase extends BaseDataBase {
  tableUser = "MyFrames_User"

  async userSignup(user: User): Promise<void> {
    console.log("Adding new user in database...")
    try {
      await this.getConnection().insert({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        nickname: user.getNickname(),
        password: user.getPassword()
      }).into(this.tableUser)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getUserByEmailOrNickname(emailOrNickname: string): Promise<User> {
    try {
      const user = await this.getConnection().raw(`
        SELECT * FROM ${this.tableUser}
        WHERE email = "${emailOrNickname}" OR nickname = "${emailOrNickname}"
      `)
      return User.toUserModel(user[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async verifyEmailAvailability(email: string): Promise<boolean> {
    try {
      const result = await this.getConnection().raw(`
        SELECT IF
        (email = "${email}", true, false) as result
        FROM MyFrames_User
      `)
      return result[0][0].result
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async verifyNicknameAvailability(nickname: string): Promise<boolean> {
    try {
      const result = await this.getConnection().raw(`
        SELECT IF
        (nickname = "${nickname}", true, false) as result
        FROM MyFrames_User
      `)
      return result[0][0].result
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.getConnection().raw(`
        SELECT * FROM ${this.tableUser}
        WHERE id = "${id}"
      `)
      return User.toUserModel(user[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
}