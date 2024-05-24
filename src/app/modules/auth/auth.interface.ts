export interface IUserRegister {
  name: string
  username: string
  email: string
  password: string
}

export interface IUserLogin {
  username: string
  password: string
}

export interface IChangePassword {
  oldPassword: string
  newPassword: string
}
