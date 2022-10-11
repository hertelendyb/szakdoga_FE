import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
  user: {
    id: number;
    name: string;
    email: string;
    profilePicture: string | null;
  };
  orgPermissions: Array<{
    id: number;
    userId: number;
    roleId: number;
    organizationId: number;
  }>;
  projectPermissions: Array<{
    id: number;
    userId: number;
    roleId: number;
    projectId: number;
  }>;
}

const initialState: UserState = {
  user: {
    id: 0,
    name: "",
    email: "",
    profilePicture: null,
  },
  orgPermissions: [],
  projectPermissions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = { ...action.payload.user };
      state.orgPermissions = action.payload.orgPermissions;
      state.projectPermissions = action.payload.projectPermissions;
    },
    clearUser: (state) => {
      state.user = initialState.user;
      state.orgPermissions = initialState.orgPermissions;
      state.projectPermissions = initialState.projectPermissions;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
