import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export type CartItem = {
    id: string
    name: string
    qty: number
    price: number
    imageUrl?: string
    category?: string
}

export async function getUserCart(uid: string): Promise<CartItem[]> {
    const snapshot = await getDocs(collection(db, "users", uid, "cart"))

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
            id: docSnap.id,
            name: String(data.name ?? ""),
            qty: Number(data.qty ?? 1),
            price: Number(data.price ?? 0),
            imageUrl: String(data.imageUrl ?? ""),
            category: String(data.category ?? ""),
        }
    })
}

export async function addItemToCart(
    uid: string,
    item: {
        id: string
        name: string
        price: number
        imageUrl?: string
        category?: string
        qty?: number
    },
) {
    const cartRef = doc(db, "users", uid, "cart", item.id)

    await setDoc(
        cartRef,
        {
            name: item.name,
            price: item.price,
            qty: item.qty ?? 1,
            imageUrl: item.imageUrl ?? "",
            category: item.category ?? "",
        },
        { merge: true },
    )
}

export async function updateCartItemQty(uid: string, itemId: string, qty: number) {
    const cartRef = doc(db, "users", uid, "cart", itemId)

    if (qty <= 0) {
        await deleteDoc(cartRef)
        return
    }

    await updateDoc(cartRef, { qty })
}

export async function removeCartItem(uid: string, itemId: string) {
    await deleteDoc(doc(db, "users", uid, "cart", itemId))
}

export async function clearUserCart(uid: string) {
    const snapshot = await getDocs(collection(db, "users", uid, "cart"))

    await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)))
}

export function getCartTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}
