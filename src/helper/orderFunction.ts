import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type UserOrder = {
    id: string
    date: string
    total: string
    status: string
}

export type CartItem = {
    id: string
    name: string
    qty: number
    price: string
}

export async function getUserOrders(uid: string): Promise<UserOrder[]> {
    const q = query(collection(db, "users", uid, "orders"), orderBy("date", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
            id: docSnap.id,
            date: String(data.date ?? ""),
            total: String(data.total ?? "$0.00"),
            status: String(data.status ?? "Pending"),
        }
    })
}

export async function getUserCart(uid: string): Promise<CartItem[]> {
    const snapshot = await getDocs(collection(db, "users", uid, "cart"))

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
            id: docSnap.id,
            name: String(data.name ?? ""),
            qty: Number(data.qty ?? 1),
            price: String(data.price ?? "$0.00"),
        }
    })
}
