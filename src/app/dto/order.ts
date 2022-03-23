import { Product } from "./product"

interface ListOrdersRes{
    status: string,
    message: string,
    details: Orders
}

interface Orders{
    orders: Order[]
}

interface Order {
    id: number
    userID: number
    total: number
    status: string
    snapshots: Cart[]
    createdAt: Date
}

interface Cart {
    id: string
    item: string
    price: number
    sizing: string
    quantity: number
    product: Product
}

interface UserInfo {
    id: number
    username: string
    password: string
    dob: string
    role: string
    chest: number
    waist: number
    hip: number
}

interface UserInfoRes {
    status: string,
    message: string,
    details: UserInfo
}

export {
    ListOrdersRes,
    Order,
    Cart,
    UserInfoRes,
    UserInfo
}
