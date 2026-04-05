import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export type UserRole = "customer" | "manager" | "admin"

export type AppUser = {
    uid: string
    email: string
    displayName: string
    role: UserRole
    disabled?: boolean
}

export type UserSettings = {
    uid: string
    email: string
    displayName: string
    phoneNumber: string
    deliveryAddress: string
    campusLocation: string
    notifications: boolean
    marketingEmails: boolean
    darkMode: boolean
}

export async function getAllUsers(): Promise<AppUser[]> {
    const q = query(collection(db, "users"), orderBy("email"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
            uid: docSnap.id,
            email: String(data.email ?? ""),
            displayName: String(data.displayName ?? ""),
            role: (data.role ?? "customer") as UserRole,
            disabled: Boolean(data.disabled ?? false),
        }
    })
}

export async function getUserById(uid: string): Promise<AppUser | null> {
    const snap = await getDoc(doc(db, "users", uid))

    if (!snap.exists()) return null

    const data = snap.data()

    return {
        uid: snap.id,
        email: String(data.email ?? ""),
        displayName: String(data.displayName ?? ""),
        role: (data.role ?? "customer") as UserRole,
        disabled: Boolean(data.disabled ?? false),
    }
}

export async function getUserSettings(uid: string): Promise<UserSettings | null> {
    const snap = await getDoc(doc(db, "users", uid))

    if (!snap.exists()) return null

    const data = snap.data()

    return {
        uid: snap.id,
        email: String(data.email ?? ""),
        displayName: String(data.displayName ?? ""),
        phoneNumber: String(data.phoneNumber ?? ""),
        deliveryAddress: String(data.deliveryAddress ?? ""),
        campusLocation: String(data.campusLocation ?? ""),
        notifications: Boolean(data.notifications ?? true),
        marketingEmails: Boolean(data.marketingEmails ?? false),
        darkMode: Boolean(data.darkMode ?? true),
    }
}

export async function updateUserSettings(
    uid: string,
    payload: {
        displayName?: string
        phoneNumber?: string
        deliveryAddress?: string
        campusLocation?: string
        notifications?: boolean
        marketingEmails?: boolean
        darkMode?: boolean
    }
) {
    await updateDoc(doc(db, "users", uid), {
        ...payload,
        updatedAt: serverTimestamp(),
    })
}

export async function adminUpdateUser(
    uid: string,
    payload: {
        displayName?: string
        role?: UserRole
        disabled?: boolean
    }
) {
    await updateDoc(doc(db, "users", uid), {
        ...payload,
        updatedAt: serverTimestamp(),
    })
}

export async function deleteUserDoc(uid: string) {
    await deleteDoc(doc(db, "users", uid))
}
