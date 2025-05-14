"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  DialogActions,
  Stack,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { getUsers, updateUser } from "@/apis/userApi";
import { useFormik } from "formik";
import * as Yup from "yup";

interface User {
  id: string;
  name: string;
  email: string;
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number;
}

export const UserList = () => {
  const router = useRouter();
  const { token, isAuthenticated } = useAppSelector((state: RootState) => state.user)

  const [users, setUsers] = useState<User[] | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loadingDialog, setloadingDialog] = useState<boolean>(false);
  const [dataDialog, setDataDialog] = useState<User | null>();

  useEffect(() => {
    initData()
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  const initData = async () => {
    try {
      const { data } = await getUsers(token as string);
      setUsers(data);
    } catch (err: any) {
      setErrorMessage(err?.message);
    }
  }

  const editDataHandler = (user: User) => {
    setOpenDialog(true)
    setDataDialog(user)
  }

  const closeDialogHandler = () => {
    setOpenDialog(false)
    setDataDialog(null)
  }

  const submitDataHandler = async (values: any) => {
    setloadingDialog(true);
    try {
      await updateUser(token as string, dataDialog?.id as string, values);
    } catch (err: any) {
      console.error('submitDataHandler-error', err?.message);
    }
    setloadingDialog(false);
    closeDialogHandler();
    initData();
  }
  
  const editDataSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().required(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: editDataSchema,
    initialValues: {
      name: dataDialog?.name ?? '',
      email: dataDialog?.email ?? '',
    },
    onSubmit: submitDataHandler,
  });

  return (
    <>
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Total Average Weight Ratings</TableCell>
              <TableCell align="right">Number Of Rents</TableCell>
              <TableCell align="right">Recently Active</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>
                  {user.email}
                </TableCell>
                <TableCell align="right">{user.totalAverageWeightRatings}</TableCell>
                <TableCell align="right">{user.numberOfRents}</TableCell>
                <TableCell align="right">{moment(user.recentlyActive).format()}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="Edit Data" color="secondary" onClick={() => editDataHandler(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >

      {errorMessage && (
        <div style={{ marginTop: 20 }}>
          <Alert severity="error">{errorMessage}</Alert>
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={closeDialogHandler}
      >
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            spacing={2}
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TextField
              type="text"
              label="Name"
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              type="text"
              label="Email"
              onChange={formik.handleChange('email')}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogHandler}>Cancel</Button>
          <Button
            disabled={!formik.isValid}
            loading={loadingDialog}
            loadingPosition="start"
            onClick={() => formik.handleSubmit()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}