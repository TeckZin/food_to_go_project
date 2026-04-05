import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type ContactMessageStatus = "new" | "read" | "closed"

export type ContactMessagePayload = {
    senderName: string
    senderEmail: string
    subject: string
    message: string
    targetName: string
    targetEmail: string
    targetRole: string
}

export async function createContactMessage(payload: ContactMessagePayload) {
    await addDoc(collection(db, "contact_messages"), {
        ...payload,
        status: "new" as ContactMessageStatus,
        createdAt: serverTimestamp(),
    })
}
