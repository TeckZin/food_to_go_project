const admin = require("firebase-admin");
const serviceAccount = require("../secrets/serviceAccountKey.json");

const Role = Object.freeze({
    CUSTOMER: "customer",
    ADMIN: "admin",
    MANAGER: "manager",
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function setRole(uid, role) {
    const normalizedRole = String(role).toLowerCase();

    if (!Object.values(Role).includes(normalizedRole)) {
        throw new Error(`Invalid role: ${role}`);
    }

    await admin.auth().setCustomUserClaims(uid, { role: normalizedRole });
    console.log(`Set role "${normalizedRole}" for user ${uid}`);
}

async function getRole(uid) {
    const userRecord = await admin.auth().getUser(uid);
    const role = userRecord.customClaims?.role ?? "No role set";

    console.log(`Role for user ${uid}: ${role}`);
    console.log("Custom claims:", userRecord.customClaims ?? {});
}

async function getUserInfo(uid) {
    const userRecord = await admin.auth().getUser(uid);

    console.log("User info:");
    console.log({
        uid: userRecord.uid,
        email: userRecord.email ?? null,
        displayName: userRecord.displayName ?? null,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        customClaims: userRecord.customClaims ?? {},
    });
}

async function getCustomToken(uid) {
    const customToken = await admin.auth().createCustomToken(uid);

    console.log(`Custom token for user ${uid}:`);
    console.log(customToken);
    console.log("");
    console.log("Note: This is a Firebase custom token, not the user's ID token.");
    console.log("To get an ID token, sign in on the client and call getIdToken().");
}

function printUsage() {
    console.log("Usage:");
    console.log("  node rolesFunction.cjs set-role <uid> <role>");
    console.log("  node rolesFunction.cjs get-role <uid>");
    console.log("  node rolesFunction.cjs get-user <uid>");
    console.log("  node rolesFunction.cjs get-token <uid>");
    console.log("");
    console.log("Examples:");
    console.log("  node rolesFunction.cjs set-role abc123 admin");
    console.log("  node rolesFunction.cjs get-role abc123");
    console.log("  node rolesFunction.cjs get-user abc123");
    console.log("  node rolesFunction.cjs get-token abc123");
}

async function main() {
    const command = process.argv[2];
    const uid = process.argv[3];
    const role = process.argv[4];

    if (!command || !uid) {
        printUsage();
        process.exit(1);
    }

    switch (command) {
        case "set-role":
            if (!role) {
                console.error("Missing role.");
                printUsage();
                process.exit(1);
            }
            await setRole(uid, role);
            break;

        case "get-role":
            await getRole(uid);
            break;

        case "get-user":
            await getUserInfo(uid);
            break;

        case "get-token":
            await getCustomToken(uid);
            break;

        default:
            console.error(`Unknown command: ${command}`);
            printUsage();
            process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error:", err.message);
        process.exit(1);
    });
