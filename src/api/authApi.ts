import type { User } from "../types/auth";
import emptyApi from "./emptyApi";
import { authStarted, authSuccess, authFailed } from '../store/authSlice';

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

          const user: User = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
          };

          dispatch(authSuccess({ user, token: data.accessToken }));
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
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;