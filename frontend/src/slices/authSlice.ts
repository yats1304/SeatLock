import { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: (create) => ({
    setUser: create.reducer<User>((state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    }),

    clearUser: create.reducer((state) => {
      state.user = null;
      state.isAuth = false;
    }),

    setLoading: create.reducer<boolean>((state, action) => {
      state.loading = action.payload;
    }),
  }),
});

export const { setUser, clearUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
