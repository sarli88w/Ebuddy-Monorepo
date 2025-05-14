export type ApiGetAuthProfileProps = {
  token_access: string;
  token_type?: string;
}

export const ApiGetToken = async (body?: {[key: string]: any}) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Unauthorized");
  
  return res.json();
};

export const ApiGetAuthProfile = async (props: ApiGetAuthProfileProps) => {
  const tokenType = props.token_type ?? 'Bearer';
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${tokenType} ${props.token_access}`,
    },
  });

  if (!res.ok) throw new Error("Internal server error");
  
  return res.json();
};