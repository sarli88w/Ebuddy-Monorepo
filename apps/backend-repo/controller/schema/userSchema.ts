import * as yup from "yup";
import { InferType } from "yup";

export const getUserUpdateSchema = yup.object({
  name: yup.string(),
  email: yup.string().email(),
});

export type getUserUpdateType = InferType<typeof getUserUpdateSchema>;
