import { token, profile } from "../controller/api";
import { getTokenSchema } from "../controller/schema";
import { authMiddleware, validateRequest } from "../middleware";

export default (router: any) => {
  router.post('/token', validateRequest(getTokenSchema), token);
  router.post('/profile', authMiddleware, profile);

  return router;
}