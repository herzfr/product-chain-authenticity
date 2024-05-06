import { Opt, Principal, Record, Variant, Vec, nat64, text } from "azle";

export const PurchasingOrder = Record({
    product_code: text,
    qty: nat64,
    manufacturer_id: Principal,
    manufacturer_maker: Principal,
    memo: nat64
})

export const PaymentPayload = Record({
    manufacturer_maker: Principal,
    product_code: text,
    amount: nat64,
    manufacturer_id: Principal,
    memo: nat64
})

export const OrderStatus = Variant({
    PaymentPending: text,
    Completed: text,
    PaymentFailed: text,
    Failed: text,
    NotFound: text,
})

export const Order = Record({
    product_code: text,
    qty: nat64,
    price: nat64,
    amount: nat64,
    status: OrderStatus,
    manufacturer_id: Principal,
    manufacturer_maker: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
})

export const OrderList = Record({
    transaction: text,
    orders: Order
})

export const Manufacturer = Record({
    manufacture_id: Principal,
    manufacture_name: text,
    description: text,
    address: text,
})

export const ManufacturerPayload = Record({
    manufacture_id: Principal,
    manufacture_name: text,
    description:  text,
    address:  text,
})

export const Product = Record({
    product_code: text,
    title: text,
    description: text,
    price: nat64,
    qty: nat64,
    quantity_type: text,
    manufacturer_id: Principal,
    attachmentURL: text,
    soldAmount: nat64,
})

export const ProductPayload = Record({
    product_code: Opt(text),
    title: text,
    description: text,
    price: nat64,
    qty: nat64,
    quantity_type: text,
    manufacturer_id: Principal,
    manufacturer_maker: Principal,
    attachmentURL: text,
    soldAmount: nat64,
})

export const ProductHistory = Record({
    product_code: text,
    manufacture_id: Principal,
    timestamp: nat64,
})


