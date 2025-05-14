import { FirebaseConfig } from "../config";

const db = FirebaseConfig.instance.db;

export const healty = async (req: any, res: any) => {
  try {
    await db.listCollections();
    
    res.status(200).send({ status: 'success' });
  } catch (error) {
    res.status(500).send({ status: 'error' });
  }
}