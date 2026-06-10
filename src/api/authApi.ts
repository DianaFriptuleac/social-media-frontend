import type { User } from "../types/auth";
import emptyApi from "./emptyApi";
import { authStarted, authSuccess, authFailed } from '../store/authSlice';
import { resetMessageState } from "../store/messageSlice";

// Risposta login (cosa ricevo dal backend quando faccio il login)
interface LoginResponce {
  accessToken: string;
  id: string;
  name: string;
  surname: string;
  email: string;
  avatar?: string;  /// opzionale
  role: "ADMIN" | "USER" | string;
}
// Risposta register (cosa invio al backend per registrare)
interface RegisterBody {
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar?: string;
}
interface LoginBody {
  email: string;
  password: string;
  rememberMe: boolean;
}


export const authApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    //Post /auth/login
    login: build.mutation<LoginResponce, LoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      // side-effect per aggiornare authSlice
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(authStarted());
        try {
          const { data } = await queryFulfilled;

          // pulizia sessione precedente
          dispatch(resetMessageState());
          dispatch(emptyApi.util.resetApiState());

          const user: User = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
          };

          dispatch(authSuccess({ user, token: data.accessToken, rememberMe: arg.rememberMe }));
        } catch (err: any) {
          const msg =
            err?.error?.data?.message ||
            err?.message ||
            'Login error';
          dispatch(authFailed(msg));
        }
      },
    }),

    // POST /auth/register
    register: build.mutation<User, RegisterBody>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      // qui di solito NON salvo niente nello slice
      // l'utente poi farà login normalmente
    }),
    // Forgot password
    forgotPassword: build.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot_password",
        method: "POST",
        body,
      }),
    }),

    //Reset Password
    resetPassword: build.mutation<void, { token: string; newPassword: string }>({
      query: (body) => ({
        url: "/auth/reset_password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;