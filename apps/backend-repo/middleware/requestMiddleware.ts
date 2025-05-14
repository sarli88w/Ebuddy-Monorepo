import { Schema } from "yup";

export const validateRequest = (schema: Schema) => async (req: any, res: any, next: any) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({
      status: 'error',
      message: err.errors,
    });
  }
};