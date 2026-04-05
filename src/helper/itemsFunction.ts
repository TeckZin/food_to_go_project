import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore"
import {
    getDownloadURL,
    ref as storageRef,
    uploadBytes,
} from "firebase/storage"
import { db, storage } from "@/lib/firebase"

export const ItemTag = {
    BEST_SELLING: "best_selling",
    POPULAR: "popular",
    NEW: "new",
    HOT: "hot",
} as const

export const ItemCategory = {
    BURGERS: "burgers",
    SANDWICHES: "sandwiches",
    SIDES: "sides",
    DRINKS: "drinks",
    PIZZA: "pizza",
    DESSERT: "dessert",
} as const

export type ItemTag = (typeof ItemTag)[keyof typeof ItemTag]
export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory]

export type StoreItem = {
    id: string
    name: string
    category: ItemCategory
    description: string
    price: number
    image_url: string
    calories: number
    qty: number
    old_price?: number
    tag?: ItemTag
}

export type CreateStoreItemInput = {
    name: string
    category: ItemCategory
    description: string
    price: number
    calories: number
    qty: number
    old_price?: number
    tag?: ItemTag
    imageFile?: File | null
}

export type UpdateStoreItemInput = {
    name: string
    category: ItemCategory
    description: string
    price: number
    calories: number
    qty: number
    old_price?: number
    tag?: ItemTag
    imageFile?: File | null
}

function getImagePath(category: string, id: string) {
    return `food-images/${category}/${id}.jpg`
}

async function resolveImageUrl(category: string, id: string) {
    try {
        const path = getImagePath(category, id)
        return await getDownloadURL(storageRef(storage, path))
    } catch {
        return "https://placehold.co/500x500/png?text=Food+Item"
    }
}

async function uploadItemImage(category: string, itemId: string, file: File) {
    const path = getImagePath(category, itemId)
    const imageRef = storageRef(storage, path)
    await uploadBytes(imageRef, file)
}

export async function getItems(): Promise<StoreItem[]> {
    const snapshot = await getDocs(collection(db, "items"))

    return await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data()
            const category = String(data.category ?? ItemCategory.BURGERS)

            return {
                id: docSnap.id,
                name: data.name ?? "",
                category: category as ItemCategory,
                description: data.description ?? "",
                price: Number(data.price ?? 0),
                image_url: await resolveImageUrl(category, docSnap.id),
                calories: Number(data.calories ?? 0),
                qty: Number(data.qty ?? 0),
                old_price: data.old_price != null ? Number(data.old_price) : undefined,
                tag: data.tag ?? undefined,
            } as StoreItem
        })
    )
}

export async function createItem(input: CreateStoreItemInput) {
    const docRef = await addDoc(collection(db, "items"), {
        name: input.name,
        category: input.category,
        description: input.description,
        price: Number(input.price),
        calories: Number(input.calories),
        qty: Number(input.qty),
        old_price: input.old_price != null ? Number(input.old_price) : null,
        tag: input.tag ?? null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    })

    if (input.imageFile) {
        await uploadItemImage(input.category, docRef.id, input.imageFile)
    }

    await updateDoc(doc(db, "items", docRef.id), {
        updated_at: serverTimestamp(),
    })

    return docRef
}

export async function updateItem(itemId: string, input: UpdateStoreItemInput) {
    await updateDoc(doc(db, "items", itemId), {
        name: input.name,
        category: input.category,
        description: input.description,
        price: Number(input.price),
        calories: Number(input.calories),
        qty: Number(input.qty),
        old_price: input.old_price != null ? Number(input.old_price) : null,
        tag: input.tag ?? null,
        updated_at: serverTimestamp(),
    })

    if (input.imageFile) {
        await uploadItemImage(input.category, itemId, input.imageFile)
    }
}

export async function deleteItem(itemId: string) {
    await deleteDoc(doc(db, "items", itemId))
}
