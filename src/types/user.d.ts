declare interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  active: boolean
  created_at: string
  updated_at: string
}

declare interface UpdateUserForm {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
}
