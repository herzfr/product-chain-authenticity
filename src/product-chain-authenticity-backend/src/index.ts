import { Canister, Duration, None, Opt, Principal, Result, Some, StableBTreeMap, Vec, bool, ic, int32, nat32, nat64, query, text, update } from 'azle';
import { Manufacturer, ManufacturerPayload, Order, OrderList, OrderStatus, PaymentPayload, Product, ProductHistory, ProductPayload, PurchasingOrder } from './model';
import { v4 as uuidv4 } from "uuid";
import * as hashcode from 'hashcode';
import { Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal } from 'azle/canisters/ledger';
const hashCode = hashcode.hashCode;


type Manufacturer = typeof Manufacturer.tsType;
type Product = typeof Product.tsType;
type ProductHistory = typeof ProductHistory.tsType;
type OrderList = typeof OrderList.tsType;
type Order = typeof Order.tsType;

const manufacturerStorage = StableBTreeMap<Principal, Manufacturer>(0);
const productStorage = StableBTreeMap<text, Product>(1);
// const historyStorage = StableBTreeMap<text, ProductHistory>(2);
const historyStorage = Vec(ProductHistory)
const persistedOrders = StableBTreeMap<text, OrderList>(3);
const pendingOrders = StableBTreeMap<nat64, Order>(4);


const ORDER_PERIOD = 120n; // reservation period in seconds
const icpLedgerCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"))

export default Canister({
    // =====================================================================================================================
    //                                  FETCHING  || DATA
    // =====================================================================================================================
    get_registered_manufacturers: query([], Vec(Manufacturer), async () => {
        return manufacturerStorage.values()
    }),
    get_manufacturers: query([Principal], Result(Manufacturer, text), (prcpl) => {
        const manufacture = manufacturerStorage.get(prcpl)
        if ('None' in manufacture) {
            return Result.Err(`The manufacturer is not registered.`)
        }
        return Result.Ok(manufacture.Some)
    }),
    get_product: query([Principal, nat32, nat32], Vec(Product), (prcpl, pageIndex, size) => {
        const productList = productStorage.items(pageIndex, size)
            .filter(e => e[1].manufacturer_id === prcpl)
            .map(([_, contractData]) => contractData)
        if (productList.length === 0) {
            return []
        }
        return productList
    }),
    get_product_orders: query([Principal, nat32, nat32], Vec(OrderList), (prcpl, pageIndex, size) => {
        const orderList = persistedOrders.items(pageIndex, size)
            .filter(e => e[1].orders.manufacturer_id === prcpl || e[1].orders.manufacturer_maker === prcpl)
            .map(([_, contractData]) => contractData)
        if (orderList.length === 0) {
            return []
        }
        return orderList
    }),
    get_track_product_authenticity: query([text], Vec(ProductHistory), (product_code) => {
        return historyStorage.tsType.filter(e => e.product_code === product_code)
    }),
    // =====================================================================================================================
    //                                  CREATE / UPDATE / DELETE  || DATA
    // =====================================================================================================================
    register_manufacturer: update([ManufacturerPayload], Result(Manufacturer, text), (new_manufacturer) => {
        try {
            const manufacturer = manufacturerStorage.get(new_manufacturer.manufacture_id)
            if ('None' in manufacturer) {
                const newManufacturer = {
                    ...new_manufacturer
                }
                manufacturerStorage.insert(new_manufacturer.manufacture_id, newManufacturer)
                Result.Ok(new_manufacturer)
            }

            const manufacturerSome = manufacturer.Some;
            const updManufacturer = {
                ...manufacturerSome,
                manufacture_id: manufacturerSome?.manufacture_id ?? new_manufacturer.manufacture_id,
                manufacture_name: new_manufacturer.manufacture_name,
                description: new_manufacturer.description,
                address: new_manufacturer.address
            }

            manufacturerStorage.insert(updManufacturer.manufacture_id, updManufacturer)
            return Result.Ok(new_manufacturer)

        } catch (error) {
            return Result.Err(`Failed to register the manufacturer!`)
        }
    }),
    register_product: update([ProductPayload], Result(Product, text), (new_prod) => {
        try {
            const manufacture = manufacturerStorage.get(new_prod.manufacturer_id)
            if ('None' in manufacture) {
                return Result.Err(`Manufacturer doesn't registered, please register manufacturer first.`)
            }

            const code = new_prod.product_code === None ? uuidv4() : new_prod.product_code.Some!
            const product = productStorage.get(code)
            if ('Some' in product) {
                return Result.Err(`The product already exists.`)
            }
            const replace = {
                ...new_prod,
                product_code: new_prod.product_code === None ? uuidv4() : new_prod.product_code.Some!
            }
            productStorage.insert(code, replace)
            return Result.Ok(replace)
        } catch (error) {
            return Result.Err(`Failed to register product!`)
        }
    }),
    order_product: update([PurchasingOrder], Result(Order, text), (po) => {
        try {
            const manufacture = manufacturerStorage.get(po.manufacturer_id)
            const product = productStorage.get(po.product_code)

            if ('None' in manufacture) {
                return Result.Err(`Manufacturer doesn't registered, please register manufacturer first.`)
            }

            if ('None' in product) {
                return Result.Err(`Product doesn't exist.`)
            }

            const manufactureSome = manufacture.Some;
            const productSome = product.Some;

            if (productSome.manufacturer_id === po.manufacturer_id) {
                return Result.Err(`You cannot ship products within the same manufacturer.`)
            }

            if (productSome.qty >= po.qty) {
                return Result.Err(`The product stock is insufficient.`)
            }

            const amountToPay = po.qty * productSome.price;
            const order: Order = {
                product_code: po.product_code,
                qty: po.qty,
                price: productSome.price,
                amount: amountToPay,
                manufacturer_id: po.manufacturer_id,
                paid_at_block: None,
                status: { PaymentPending: "PAYMENT_PENDING" },
                memo: generateCorrelationId(po.product_code),
                manufacturer_maker: po.manufacturer_maker
            }

            // store and return order
            pendingOrders.insert(order.memo, order);
            discardByTimeout(order.memo, ORDER_PERIOD);
            return Result.Ok(order);

        } catch (error) {
            return Result.Err(`Failed to purchase product!`)
        }
    }),
    make_payment_po: update([PaymentPayload], Result(OrderList, text), async (payment) => {
        try {
            const order_pending = pendingOrders.get(payment.memo)
            if ('None' in order_pending) {
                return Result.Err(`Please reorder before the specified deadline`)
            }
            const order_pendingSome = order_pending.Some
            const paid = await makePayment(payment.manufacturer_id, order_pendingSome.amount)

            if ('Err' in paid) {
                return Result.Err(paid.Err.PaymentFailed)
            }

            const manufacturer = manufacturerStorage.get(order_pendingSome.manufacturer_id)
            if ('None' in manufacturer) {
                return Result.Err(`Manufacturer doesn't exist! please reconfirm the origin of the authenticated product `)
            }

            const manufacturerSome = manufacturer.Some
            const order = {
                product_code: order_pendingSome.product_code,
                qty: order_pendingSome.qty,
                price: order_pendingSome.price,
                amount: order_pendingSome.amount,
                status: order_pendingSome.status,
                manufacturer_id: manufacturerSome.manufacture_id,
                paid_at_block: None,
                memo: order_pendingSome.memo,
                manufacturer_maker: payment.manufacturer_maker
            }
            const oList = {
                transaction: getRandomId(16),
                orders: order
            }

            persistedOrders.insert(oList.transaction, oList)
            pendingOrders.remove(order_pendingSome.memo)

            return Result.Ok(oList)

        } catch (error) {
            return Result.Err(`Failed make a payment`)
        }
    }),
    transfer_product: update([text, Principal, nat64, nat64, nat64], Result(OrderStatus, OrderStatus), async (transactionId, sender, amountPaid, block, memo) => {
        try {
            const paymentVerified = await verifyPaymentInternal(sender, amountPaid, block, memo);
            if (!paymentVerified) {
                return Result.Err({ PaymentFailed: `cannot complete the reserve: cannot verify the payment, memo=${memo}` });
            }

            const pendingOrderOpt = pendingOrders.remove(memo);
            if ("None" in pendingOrderOpt) {
                return Result.Err({ NotFound: `cannot complete the reserve: there is no pending order with id=${transactionId}` });
            }

            const order = pendingOrderOpt.Some;
            const updatedOrder = { ...order, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };

            const productOpt = productStorage.get(updatedOrder.product_code)
            const persistedOrderOpt = persistedOrders.get(transactionId)

            if ("None" in productOpt) {
                return Result.Err({ NotFound: `Product not found with transaction id=${transactionId}` });
            }

            if ("None" in persistedOrderOpt) {
                return Result.Err({ NotFound: `Order not found with transaction id=${transactionId}` });
            }


            const prod = productOpt.Some;
            const persistedOrder = persistedOrderOpt.Some;

            prod.qty -= updatedOrder.qty;
            prod.soldAmount += updatedOrder.qty;


            if (prod.manufacturer_id !== persistedOrder.orders.manufacturer_id) {
                return Result.Err({ Failed: `You are not the owner of this product` });
            }

            persistedOrders.insert(transactionId, { transaction: transactionId, orders: { ...persistedOrder.orders, status: { Completed: 'COMPLETED' }, paid_at_block: Some(block) } })
            productStorage.insert(prod.product_code, prod)

            const newHistory = {
                product_code: prod.product_code,
                manufacture_id: sender,
                timestamp: ic.time()
            }

            historyStorage.tsType.push(newHistory)
            return Result.Ok({ Completed: 'Transfer is completed!' })
        } catch (error) {
            return Result.Err({ Failed: 'Failed to make transfer product' })
        }

    })

})


async function makePayment(manufacture_id: Principal, amount: nat64) {
    const toAddress = hexAddressFromPrincipal(manufacture_id, 0);
    const transferFeeResponse = await ic.call(icpLedgerCanister.transfer_fee, { args: [{}] });
    const transferResult = ic.call(icpLedgerCanister.transfer, {
        args: [{
            memo: 0n,
            amount: {
                e8s: amount - transferFeeResponse.transfer_fee.e8s
            },
            fee: {
                e8s: transferFeeResponse.transfer_fee.e8s
            },
            from_subaccount: None,
            to: binaryAddressFromAddress(toAddress),
            created_at_time: None
        }]
    });
    if ("Err" in transferResult) {
        return Result.Err({ PaymentFailed: `payment failed, err=${transferResult.Err}` })
    }
    return Result.Ok({ Completed: "payment completed" });
}

async function verifyPaymentInternal(sender: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpLedgerCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(sender, 0);
        const receiverAddress = binaryAddressFromPrincipal(ic.id(), 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};

function getRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + ic.time();
    let result = '';
    const charLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}



globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};

function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingOrders.remove(memo);
        console.log(`Subscribe discarded ${order}`);
    });
};

// HASH
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

function generateCorrelationId(orderId: text): nat64 {
    const correlationId = `${orderId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};
