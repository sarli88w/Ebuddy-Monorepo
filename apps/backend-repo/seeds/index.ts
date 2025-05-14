import fs from "fs";
import path from "path";
import firebaseAdmin from "firebase-admin";
import { initialize } from "fireorm";
import { seedUsers } from "./seedUsers";

let config = {
  // your project_id
  projectId: 'ebuddy-test', 
  // your client_email
  clientEmail: 'ebuddy-test@gserviceaccount.com', 
  // your private_key
  privateKey: '=== PRIVATE KEY ===', 
};

const pathServiceAccountKey = path.join(__dirname, '../config/serviceAccountKey.json');
if (fs.existsSync(pathServiceAccountKey)) {
  const serviceAccountRawData = fs.readFileSync(pathServiceAccountKey, "utf8");
  const serviceAccountJsonData = JSON.parse(serviceAccountRawData);
  config = {
    ...config,
    projectId: serviceAccountJsonData.project_id,
    clientEmail: serviceAccountJsonData.client_email,
    privateKey: serviceAccountJsonData.private_key,
  }
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(config) });
}
  
const firestore = firebaseAdmin.firestore();
initialize(firestore);

(async () => {
  seedUsers(firebaseAdmin);
})();