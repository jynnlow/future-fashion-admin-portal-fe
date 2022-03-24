interface User {
    id: number
    username: string
    password: string
    dob: string
    role: string
    chest: number
    waist: number
    hip: number
}

interface Users {
    users: User[]
}

interface ListUsersRes{
    status: string,
    message: string,
    details: Users
}

interface LoginReq {
    username: string
    password: string
}

export {
    User,
    ListUsersRes,
    LoginReq
}