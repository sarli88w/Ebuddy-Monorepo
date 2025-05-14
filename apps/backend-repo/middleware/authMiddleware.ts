import axios from "axios";
import { FirebaseAdmin, FirebaseConfig } from "../config";

export const exchangeTokenForIdToken = async (token: string) => {
  try {
    const { data } = await axios({
      method: 'POST',
      baseURL: 'https://identitytoolkit.googleapis.com',
      url: '/v1/accounts:signInWithCustomToken',
      params: {
        key: FirebaseConfig.instance.options.apiKey,
      },
      data: {
        token: token,
        returnSecureToken: true,
      }
    });
    
    return data;
  } catch (err: any) {
    throw err;
  }
}

export const authMiddleware = async (req: any, res: any, next: any) => {
  let token = req.headers?.authorization?.split('Bearer ').pop();
  
  if (!token) {
    res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
    return;
  }
  
  try {
    const { idToken } = await exchangeTokenForIdToken(token);
    req.user = await FirebaseAdmin.auth().verifyIdToken(idToken);
    next();
  } catch (err: any) {
    res.status(401).json({ 
      status: "error",
      message: "Unauthorized",
    });
    return;
  }
}