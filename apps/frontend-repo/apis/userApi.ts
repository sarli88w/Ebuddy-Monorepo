export const getUsers = async (token: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/fetch-user-data`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    if (!res.ok) throw new Error("Unauthorized");
    
    return res.json();
  } catch (err: any) {
    throw err;
  }
};

export const updateUser = async (token: string, userId: string, userData: { name: string; email: string }) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-user-data/${userId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) throw new Error("Internal server error");
    
    return res.json();
  } catch (err: any) {
    throw err;
  }
};
