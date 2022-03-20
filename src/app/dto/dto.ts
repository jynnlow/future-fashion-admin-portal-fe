interface ListProductsRes{
    status: string
    message: string
    details: Products
}

interface Products {
    products: Product[]
}

interface Product {
    id: number
    item: string
    price: number
    stock: number
    pictures: string[]
    xs: Sizing
    s: Sizing
    m: Sizing,
    l: Sizing,
    xl: Sizing
}

interface Sizing {
    chest: number
    hip: number
    waist: number
}

interface LoginReq {
    username: string
    password: string
}

export {
    ListProductsRes,
    Product,
    Sizing,
    LoginReq
}