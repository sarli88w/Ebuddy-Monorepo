import { healty } from "../controller/api";

export default (router: any) => {
  router.get('/check', healty);

  return router;
}