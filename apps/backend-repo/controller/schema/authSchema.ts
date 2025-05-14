import * as yup from "yup";
import { InferType } from "yup";

export const getTokenSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(6).required(),
});

export type getTokenType = InferType<typeof getTokenSchema>;
