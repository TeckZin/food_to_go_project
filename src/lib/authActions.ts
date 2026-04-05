import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    updateProfile,
} from "firebase/auth"
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export async function signUpEmail(
    email: string,
    password: string,
    displayName: string,
) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(cred.user, {
        displayName,
    })

    await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email ?? email,
        displayName,
        role: "customer",
        status: "active",
        emailVerified: cred.user.emailVerified,
        phoneNumber: "",
        deliveryAddress: "",
        campusLocation: "",
        notifications: true,
        marketingEmails: false,
        darkMode: true,
        disabled: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    await sendEmailVerification(cred.user, {
        url: `${window.location.origin}/verify-required`,
        handleCodeInApp: false,
    })

    return cred.user
}

export async function loginEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)

    await cred.user.reload()

    if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user, {
            url: `${window.location.origin}/verify-required`,
            handleCodeInApp: false,
        })
        await signOut(auth)

        const err: any = new Error("Email not verified.")
        err.code = "auth/email-not-verified"
        throw err
    }

    await updateDoc(doc(db, "users", cred.user.uid), {
        emailVerified: cred.user.emailVerified,
        updatedAt: serverTimestamp(),
    })

    return cred.user
}

export async function logout() {
    await signOut(auth)
}

export async function resendVerificationEmail() {
    const user = auth.currentUser
    if (!user) {
        throw Object.assign(new Error("Not signed in."), {
            code: "auth/not-signed-in",
        })
    }

    await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-required`,
        handleCodeInApp: false,
    })
}
