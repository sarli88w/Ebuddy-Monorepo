import fs from "fs";
import path from "path";
import firebaseAdmin, { ServiceAccount } from "firebase-admin";
import { initialize } from "fireorm";

export const FirebaseAdmin = firebaseAdmin;

export class FirebaseConfig {
  private static _instance: FirebaseConfig;
  public static get instance() {
    if (!FirebaseConfig._instance) {
      FirebaseConfig._instance = new FirebaseConfig();
    }
    return FirebaseConfig._instance;
  }

  private isReadyResolve: any;
  public isReady = new Promise((resolve) => {
    this.isReadyResolve = resolve;
  });

  public options: any;
  public db: any;

  constructor(overrideOptions?: any) {
    this.options = Object.assign({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      apiKey: process.env.FIREBASE_API_KEY,
    }, overrideOptions || {});

    const pathServiceAccountKey = path.join(__dirname, './serviceAccountKey.json');
    if (fs.existsSync(pathServiceAccountKey)) {
      const serviceAccountRawData = fs.readFileSync(pathServiceAccountKey, "utf8");
      const serviceAccountJsonData = JSON.parse(serviceAccountRawData);
      this.options = Object.assign(this.options, {
        projectId: serviceAccountJsonData.project_id,
        clientEmail: serviceAccountJsonData.client_email,
        privateKey: serviceAccountJsonData.private_key,
      })
    }

    const pathWebAppConfig = path.join(__dirname, './webAppConfig.json');
    if (fs.existsSync(pathWebAppConfig)) {
      const webAppConfigRawData = fs.readFileSync(pathWebAppConfig, "utf8");
      const webAppConfigJsonData = JSON.parse(webAppConfigRawData);
      this.options = Object.assign(this.options, {
        apiKey: webAppConfigJsonData.apiKey,
      })
    }

    this.initAdmin(this.options).then(() => {
      this.db = FirebaseAdmin.firestore();
      initialize(this.db);
    });

    this.isReadyResolve();
  }

  public async init() {
    console.debug("Firebase Config init");
    await this.isReady;
    console.debug("Firebase Config ready");
  }

  public async initAdmin(serviceAccountPathOrObject: string | ServiceAccount) {
    FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert(serviceAccountPathOrObject),
    });
  }
}
