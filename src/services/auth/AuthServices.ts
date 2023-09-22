import { signIn, signOut } from "next-auth/react";

export const login = async (email: string, password: string, onSuccess: (url: string) => void, onError: (error: string) => void) => {
  const res: any = await signIn('credentials', {
    redirect: false,
    email: email,
    password: password,
    callbackUrl: `${window.location.origin}/dashboard`,
  });

  if (res?.error) {
    onError(res.error);
  } else {
    onSuccess(res.url);
  }
}

export const logout = async () => {
  await signOut({
    callbackUrl: `${window.location.origin}/login`,
  });
}