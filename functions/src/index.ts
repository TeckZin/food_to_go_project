import { onCall, HttpsError } from "firebase-functions/v2/https"
import * as admin from "firebase-admin"

admin.initializeApp()

const VALID_ROLES = new Set(["customer", "manager", "admin"])

export const setUserRole = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can change roles.")
    }

    const uid = String(request.data?.uid ?? "").trim()
    const role = String(request.data?.role ?? "").toLowerCase()

    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid.")
    }

    if (!VALID_ROLES.has(role)) {
        throw new HttpsError("invalid-argument", "Invalid role.")
    }

    await admin.auth().setCustomUserClaims(uid, { role })

    return {
        success: true,
        uid,
        role,
        message: "Role updated. The target user must refresh token or sign in again.",
    }
})
