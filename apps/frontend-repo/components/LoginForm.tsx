"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { AppDispatch, RootState } from "@/store/store";
import { loginUser } from "@/store/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const validationSchema = Yup.object({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/users');
    }
  }, [isAuthenticated])

  const submitHandler = async (values: any) => {
    dispatch(loginUser(values));
  }

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={submitHandler}
      >
        {(formikProps) => (
          <Form>
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formikProps.values.username}
              onChange={formikProps.handleChange('username')}
              error={formikProps.touched.username && Boolean(formikProps.errors.username)}
              helperText={formikProps.touched.username && formikProps.errors.username}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formikProps.values.password}
              onChange={formikProps.handleChange('password')}
              error={formikProps.touched.password && Boolean(formikProps.errors.password)}
              helperText={formikProps.touched.password && formikProps.errors.password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!(formikProps.isValid && formikProps.dirty)}
              loading={loading}
              loadingPosition="start"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      {error && (
        <div style={{ marginTop: 20 }}>
          <Alert severity="error">{error}</Alert>
        </div>
      )}
    </>
  )
}
