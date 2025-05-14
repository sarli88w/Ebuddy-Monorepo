import "reflect-metadata";
import { FirebaseConfig } from "../config";
import { ApiClient } from "./apiClient";
import { Routes } from "../routes";

/**
 * Manual configuration firebase
 * ===============================
 * new FirebaseConfig({
 *  projectId: 'ebuddy-test',
 *  clientEmail: 'ebuddy-test@gserviceaccount.com',
 *  privateKey: '=== PRIVATE KEY ===',
 *  apiKey: 'ebuddy-api-key',
 * }).init();
 * 
 * Instance configuration firebase
 * ===============================
 * FirebaseConfig.instance.init();
 */
FirebaseConfig.instance.init();

(new ApiClient({ routes: Routes })).init();
