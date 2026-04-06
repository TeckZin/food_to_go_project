import { onCall, HttpsError } from "firebase-functions/v2/https"
import * as admin from "firebase-admin"
import { getFirestore, FieldValue } from "firebase-admin/firestore"

if (!admin.apps.length) {
    admin.initializeApp()
}

const VALID_ROLES = new Set(["customer", "manager", "admin"])
const firestore = getFirestore()

export const setUserRole = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can change roles.")
    }

    const uid = String(request.data?.uid ?? "").trim()
    const role = String(request.data?.role ?? "").trim().toLowerCase()

    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid.")
    }

    if (!VALID_ROLES.has(role)) {
        throw new HttpsError("invalid-argument", "Invalid role.")
    }

    try {
        const user = await admin.auth().getUser(uid)
        const existingClaims = user.customClaims ?? {}

        await admin.auth().setCustomUserClaims(uid, {
            ...existingClaims,
            role,
        })

        await firestore.collection("users").doc(uid).set(
            {
                role,
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        )

        return {
            success: true,
            uid,
            role,
            message:
                "Role updated in both custom claims and Firestore. User must refresh token.",
        }
    } catch (error: any) {
        console.error("setUserRole error:", error)
        throw new HttpsError(
            "internal",
            error?.message ?? "Failed to update user role.",
        )
    }
})

export const getUserTokenRoles = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can view token roles.")
    }

    try {
        const snapshot = await firestore.collection("users").get()
        const result: Record<string, { role: string }> = {}

        await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                try {
                    const userRecord = await admin.auth().getUser(docSnap.id)

                    result[docSnap.id] = {
                        role:
                            typeof userRecord.customClaims?.role === "string"
                                ? userRecord.customClaims.role
                                : "",
                    }
                } catch (error) {
                    console.error(`Failed to get auth user for uid ${docSnap.id}:`, error)
                    result[docSnap.id] = { role: "" }
                }
            }),
        )

        return result
    } catch (error: any) {
        console.error("getUserTokenRoles error:", error)
        throw new HttpsError(
            "internal",
            error?.message ?? "Failed to load token roles.",
        )
    }
})

export const updateUserAccount = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can update users.")
    }

    const uid = String(request.data?.uid ?? "").trim()
    const displayName = String(request.data?.displayName ?? "").trim()
    const phoneNumberRaw = String(request.data?.phoneNumber ?? "").trim()
    const disabled = Boolean(request.data?.disabled)

    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid.")
    }

    const updatePayload: admin.auth.UpdateRequest = {
        disabled,
    }

    if (displayName) {
        updatePayload.displayName = displayName
    }

    if (phoneNumberRaw) {
        updatePayload.phoneNumber = phoneNumberRaw
    }

    try {
        await admin.auth().updateUser(uid, updatePayload)

        await firestore.collection("users").doc(uid).set(
            {
                displayName: displayName || "",
                phoneNumber: phoneNumberRaw || "",
                status: disabled ? "disabled" : "active",
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        )

        return {
            success: true,
            uid,
            message: "User account updated successfully.",
        }
    } catch (error: any) {
        console.error("updateUserAccount error:", error)
        throw new HttpsError(
            "internal",
            error?.message ?? "Failed to update user account.",
        )
    }
})

export const sendUserPasswordReset = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can reset passwords.")
    }

    const uid = String(request.data?.uid ?? "").trim()

    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid.")
    }

    try {
        const user = await admin.auth().getUser(uid)

        if (!user.email) {
            throw new HttpsError("failed-precondition", "User does not have an email.")
        }

        const resetLink = await admin.auth().generatePasswordResetLink(user.email)

        return {
            success: true,
            uid,
            email: user.email,
            resetLink,
            message: "Password reset link generated successfully.",
        }
    } catch (error: any) {
        console.error("sendUserPasswordReset error:", error)
        throw new HttpsError(
            "internal",
            error?.message ?? "Failed to generate password reset link.",
        )
    }
})

export const deleteUserAccount = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be signed in.")
    }

    if (request.auth.token.role !== "admin") {
        throw new HttpsError("permission-denied", "Only admins can delete users.")
    }

    const uid = String(request.data?.uid ?? "").trim()

    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid.")
    }

    try {
        await admin.auth().deleteUser(uid)
        await firestore.collection("users").doc(uid).delete()

        return {
            success: true,
            uid,
            message: "User deleted from Auth and Firestore.",
        }
    } catch (error: any) {
        console.error("deleteUserAccount error:", error)
        throw new HttpsError(
            "internal",
            error?.message ?? "Failed to delete user account.",
        )
    }
})
