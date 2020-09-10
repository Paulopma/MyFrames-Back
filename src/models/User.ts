export class User {
  constructor (
    private id: string,
    private name: string,
    private email: string,
    private nickname: string,
    private password: string
  ) {}
  
  getId() {return this.id}
  getName() {return this.name}
  getEmail() {return this.email}
  getNickname() {return this.nickname}
  getPassword() {return this.password}

  static toUserModel(user: any): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.nickname,
      user.password
    )
  }
}

export interface UserSignupDTO {
  name: string
  email: string
  nickname: string
  password: string
}

export interface UserLoginDTO {
  login: string
  password: string
}