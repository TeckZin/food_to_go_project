import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export const OrderStatus = {
    PROCESSING: "processing",
    APPROVED: "approved",
    REJECTED: "rejected",
    COMPLETED: "completed",
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export type CartItem = {
    id: string
    name: string
    qty: number
    price: number
    imageUrl?: string
}

export type UserOrder = {
    id: string
    userUid: string
    userEmail: string
    fullName: string
    phoneNumber: string
    address: string
    campusLocation: string
    notes: string
    total: number
    status: OrderStatus
    createdAt: string
    createdAtMs: number
    items: CartItem[]
}

export type CreateOrderInput = {
    userUid: string
    userEmail: string
    fullName: string
    phoneNumber: string
    address: string
    campusLocation: string
    notes?: string
    items: CartItem[]
}

function getDateInfo(value: unknown): { label: string; ms: number } {
    if (value instanceof Timestamp) {
        const date = value.toDate()
        return {
            label: date.toLocaleString(),
            ms: date.getTime(),
        }
    }

    if (
        value &&
        typeof value === "object" &&
        "seconds" in value &&
        typeof (value as { seconds: number }).seconds === "number"
    ) {
        const date = new Date((value as { seconds: number }).seconds * 1000)
        return {
            label: date.toLocaleString(),
            ms: date.getTime(),
        }
    }

    if (typeof value === "string") {
        const parsed = new Date(value)
        return {
            label: value,
            ms: Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime(),
        }
    }

    return {
        label: "",
        ms: 0,
    }
}

function normalizePrice(price: unknown): number {
    if (typeof price === "number") return price

    if (typeof price === "string") {
        const cleaned = price.replace(/\$/g, "").trim()
        const parsed = Number(cleaned)
        return Number.isNaN(parsed) ? 0 : parsed
    }

    return 0
}

function calcOrderTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0)
}

function mapOrder(docSnap: any): UserOrder {
    const data = docSnap.data()

    const items: CartItem[] = Array.isArray(data.items)
        ? data.items.map((item: any) => ({
            id: String(item.id ?? ""),
            name: String(item.name ?? ""),
            qty: Number(item.qty ?? 1),
            price: normalizePrice(item.price),
            imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
        }))
        : []

    const createdAtInfo = getDateInfo(data.createdAt)

    return {
        id: docSnap.id,
        userUid: String(data.userUid ?? ""),
        userEmail: String(data.userEmail ?? ""),
        fullName: String(data.fullName ?? ""),
        phoneNumber: String(data.phoneNumber ?? ""),
        address: String(data.address ?? ""),
        campusLocation: String(data.campusLocation ?? ""),
        notes: String(data.notes ?? ""),
        total: Number(data.total ?? 0),
        status: String(data.status ?? OrderStatus.PROCESSING) as OrderStatus,
        createdAt: createdAtInfo.label,
        createdAtMs: createdAtInfo.ms,
        items,
    }
}

export async function getUserOrders(uid: string): Promise<UserOrder[]> {
    const q = query(collection(db, "orders"), where("userUid", "==", uid))

    const snapshot = await getDocs(q)

    return snapshot.docs
        .map(mapOrder)
        .sort((a, b) => b.createdAtMs - a.createdAtMs)
}

export async function getAllOrders(): Promise<UserOrder[]> {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(mapOrder)
}

export async function getUserCart(uid: string): Promise<CartItem[]> {
    const snapshot = await getDocs(collection(db, "users", uid, "cart"))

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
            id: docSnap.id,
            name: String(data.name ?? ""),
            qty: Number(data.qty ?? 1),
            price: normalizePrice(data.price),
            imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
        }
    })
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
    const cleanedItems: CartItem[] = input.items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: Number(item.qty ?? 1),
        price: normalizePrice(item.price),
        imageUrl: item.imageUrl ?? "",
    }))

    const total = calcOrderTotal(cleanedItems)

    const docRef = await addDoc(collection(db, "orders"), {
        userUid: input.userUid,
        userEmail: input.userEmail,
        fullName: input.fullName.trim(),
        phoneNumber: input.phoneNumber.trim(),
        address: input.address.trim(),
        campusLocation: input.campusLocation.trim(),
        notes: input.notes?.trim() ?? "",
        items: cleanedItems,
        total,
        status: OrderStatus.PROCESSING,
        createdAt: serverTimestamp(),
    })

    return docRef.id
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<void> {
    await updateDoc(doc(db, "orders", orderId), {
        status,
    })
}

export async function clearUserCart(uid: string): Promise<void> {
    const snapshot = await getDocs(collection(db, "users", uid, "cart"))

    await Promise.all(
        snapshot.docs.map((cartDoc) =>
            deleteDoc(doc(db, "users", uid, "cart", cartDoc.id))
        )
    )
}
