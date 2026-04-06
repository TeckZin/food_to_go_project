import { onIdTokenChanged, type User } from "firebase/auth"
import { httpsCallable } from "firebase/functions"
import { auth, functions } from "@/lib/firebase"

export type UserRole = "customer" | "manager" | "admin" | ""

export type RoleState = {
    user: User | null
    role: UserRole
    isAdmin: boolean
    isManager: boolean
    isCustomer: boolean

    canManageItems: boolean
    canManageUsers: boolean
    canViewUsers: boolean
    canEditUsers: boolean
    canDeleteUsers: boolean
    canAssignRoles: boolean
    canResetPasswords: boolean
}

function normalizeRole(role: unknown): UserRole {
    if (role === "admin" || role === "manager" || role === "customer") {
        return role
    }
    return ""
}

export async function getUserRole(user: User | null): Promise<UserRole> {
    if (!user) return ""

    try {
        const tokenResult = await user.getIdTokenResult(true)
        return normalizeRole(tokenResult.claims.role)
    } catch (error) {
        console.error("Failed to read role from token:", error)
        return ""
    }
}

export async function refreshCurrentUserRole(): Promise<UserRole> {
    const user = auth.currentUser
    if (!user) return ""

    try {
        await user.getIdToken(true)
        const tokenResult = await user.getIdTokenResult()
        return normalizeRole(tokenResult.claims.role)
    } catch (error) {
        console.error("Failed to refresh current user role:", error)
        return ""
    }
}

export async function getCurrentUserRole(): Promise<UserRole> {
    return getUserRole(auth.currentUser)
}

export async function forceRefreshCurrentUserToken() {
    const user = auth.currentUser
    if (!user) return null

    await user.getIdToken(true)
    return user.getIdTokenResult()
}

export async function setTargetUserRole(uid: string, role: UserRole) {
    const normalizedRole = normalizeRole(role)

    if (!uid) {
        throw new Error("Missing uid.")
    }

    if (!normalizedRole) {
        throw new Error("Invalid role.")
    }

    try {
        const currentUser = auth.currentUser
        if (currentUser) {
            await currentUser.getIdToken(true)
        }

        const callable = httpsCallable<
            { uid: string; role: UserRole },
            { success: boolean; uid: string; role: string; message: string }
        >(functions, "setUserRole")

        const result = await callable({
            uid,
            role: normalizedRole,
        })

        if (currentUser) {
            await currentUser.getIdToken(true)
        }

        return result.data
    } catch (error) {
        console.error("Failed to set target user role:", error)
        throw error
    }
}

export async function getAllUserTokenRoles() {
    try {
        const currentUser = auth.currentUser
        if (currentUser) {
            await currentUser.getIdToken(true)
            const token = await currentUser.getIdTokenResult()
            console.log("Current caller role:", token.claims.role)
        }

        const callable = httpsCallable<undefined, Record<string, { role?: string }>>(
            functions,
            "getUserTokenRoles",
        )

        const result = await callable()
        return result.data ?? {}
    } catch (error) {
        console.error("Failed to load token roles:", error)
        throw error
    }
}

export function isAdminRole(role: UserRole): boolean {
    return role === "admin"
}

export function isManagerRole(role: UserRole): boolean {
    return role === "manager"
}

export function isCustomerRole(role: UserRole): boolean {
    return role === "customer"
}

export function canManageItems(role: UserRole): boolean {
    return role === "admin" || role === "manager"
}

export function canManageUsers(role: UserRole): boolean {
    return role === "admin" || role === "manager"
}

export function canViewUsers(role: UserRole): boolean {
    return role === "admin" || role === "manager"
}

export function canEditUsers(role: UserRole): boolean {
    return role === "admin"
}

export function canDeleteUsers(role: UserRole): boolean {
    return role === "admin"
}

export function canAssignRoles(role: UserRole): boolean {
    return role === "admin"
}

export function canResetPasswords(role: UserRole): boolean {
    return role === "admin"
}

export async function getRoleState(user: User | null): Promise<RoleState> {
    const role = await getUserRole(user)

    return {
        user,
        role,
        isAdmin: isAdminRole(role),
        isManager: isManagerRole(role),
        isCustomer: isCustomerRole(role),

        canManageItems: canManageItems(role),
        canManageUsers: canManageUsers(role),
        canViewUsers: canViewUsers(role),
        canEditUsers: canEditUsers(role),
        canDeleteUsers: canDeleteUsers(role),
        canAssignRoles: canAssignRoles(role),
        canResetPasswords: canResetPasswords(role),
    }
}

export function watchRoleState(callback: (state: RoleState) => void) {
    return onIdTokenChanged(auth, async (user) => {
        const state = await getRoleState(user)
        callback(state)
    })
}
