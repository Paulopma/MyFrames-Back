import { BaseDataBase } from "./BaseDatabase";
import { UserSignupDTO, User } from "../models/User";

export class UserDatabase extends BaseDataBase {
  tableName = "MyFrames_User"

  async userSignup(user: User): Promise<void> {
    await this.getConnection().insert({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      nickname: user.getNickname(),
      password: user.getPassword()
    }).into(this.tableName)
  }
}