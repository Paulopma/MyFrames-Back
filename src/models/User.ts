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

}

export interface UserSignupDTO {
  name: string,
  email: string,
  nickname: string,
  password: string
}