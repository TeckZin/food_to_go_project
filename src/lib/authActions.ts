import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { auth } from "./firebase"

export async function signUpEmail(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)

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

    return cred.user
}

export async function logout() {
    await signOut(auth)
}

export async function resendVerificationEmail() {
    const user = auth.currentUser
    if (!user) throw Object.assign(new Error("Not signed in."), { code: "auth/not-signed-in" })

    await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-required`,
        handleCodeInApp: false,
    })
}

