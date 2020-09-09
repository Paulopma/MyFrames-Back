import { BaseDataBase } from "./BaseDatabase";
import { User } from "../models/User";

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
}