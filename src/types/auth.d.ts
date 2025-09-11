declare interface LoginInterface {
  enrollment: string
  password: string
}

declare interface AuthInterface {
  res: boolean
  token: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at: string
  }
}
