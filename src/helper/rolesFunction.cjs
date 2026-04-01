const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const Role = Object.freeze({
    CUSTOMER: "customer",
    ADMIN: "admin",
    MANAGER: "manager",
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function setRole(uid, role) {
    if (!Object.values(Role).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }

    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Set role "${role}" for user ${uid}`);
}

const uid = process.argv[2];
const role = process.argv[3];

if (!uid || !role) {
    console.log("Usage: node setRole.js <uid> <role>");
    console.log("Example: node setRole.js abc123 admin");
    process.exit(1);
}

setRole(uid, role)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
