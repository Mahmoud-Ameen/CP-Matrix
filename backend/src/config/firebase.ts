import admin from "firebase-admin";
import serviceAccount from "../secrets/firebaseServiceAccountKey.json" assert { type: "json" };

// Initialize the Firebase Admin SDK using the service account credentials
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
