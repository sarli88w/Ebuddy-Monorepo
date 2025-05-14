import { fetchUserData, updateUserData } from "../controller/api";
import { getUserUpdateSchema } from "../controller/schema";
import { authMiddleware, validateRequest } from "../middleware";

export default (router: any) => {
  router.post('/fetch-user-data', authMiddleware, fetchUserData);
  router.post('/update-user-data/:userId', [validateRequest(getUserUpdateSchema), authMiddleware], updateUserData);

  return router;
}