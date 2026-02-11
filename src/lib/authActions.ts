import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import { auth } from "./firebase"

export function signUpEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

export function loginEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
    return signOut(auth)
}

