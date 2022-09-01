import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import { IUser, IUser2 } from "../../types/users.types";
import {
  updateUserById,
  getUserById,
  logout,
  getAllUsers,
} from "../../http/userAPI.ts";
import { kikUser, unlockUser, changeUserRole } from "../../http/userAPI.ts";
import { IComment } from "../../types/favoriteList.types";

interface IUserState {
  userData: IUser;
  isAuth: boolean;
  rememberMe: boolean;
  loading: "idle" | "pending" | "succeeded" | "failed";
  currentRequestId: string | undefined;
  error: SerializedError | null;
  users: IUser2[];
  isBaned: boolean;
  banReason: string | null;
  comments: IComment[] | [];
}

const initialState: IUserState = {
  userData: {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    tel: null,
    avatar: null,
    updateAgrements: false,
    id: null,
    favorites: [],
    role: "USER",
  },
  users: [],
  isAuth: false,
  rememberMe: false,
  loading: "idle",
  currentRequestId: undefined,
  error: null,
  isBaned: false,
  banReason: null,
  comments: [],
};

export const getUsersThunk = createAsyncThunk<
  IUser2[],
  undefined,
  { rejectValue: string }
>("getAll/users", async function (_, { rejectWithValue }) {
  try {
    const users = await getAllUsers();
    return users;
  } catch (err) {
    console.log(err.message);
    return rejectWithValue(err.message);
  }
});

 interface IUserData{
   firstname:string;
   agrements:boolean
   lastname:string;
   tel:string;
   email:string;
   password:string;
   avatar:File;
   id:string;
  }
export const updateUser = createAsyncThunk<string,IUserData>(
  "users/update",
  async function (userData, { rejectWithValue }) {
    try {
      const data = await updateUserById(userData);
      return data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "users/logout",
  async function (_, { rejectWithValue }) {
    try {
      await logout();
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const getUserByIdChunck = createAsyncThunk<IUser2, string,{rejectValue:string}>(
  "user/getByid",
  async function (id: string, { rejectWithValue }) {
    try {
      const user = await getUserById(id);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const kickUserThunk = createAsyncThunk<IUser2, number,{rejectValue:string}>(
  "kik/user",
  async function (id: number, { rejectWithValue }) {
    try {
      const user = await kikUser(id);
      return user;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const unlockUserThunk = createAsyncThunk<IUser2, number,{rejectValue:string}>(
  "unlock/user",
  async function (id: number, { rejectWithValue }) {
    try {
      const user = await unlockUser(id);
      return user;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

interface IRoleChange {
  id: number;
  role: "ADMIN" | "USER";
}

export const changeUserRoleThunk = createAsyncThunk<IUser2, IRoleChange,{rejectValue:string}>(
  "changeRole/user",
  async function ({ role, id }, { rejectWithValue }) {
    try {
      const user = await changeUserRole(role, id);
      return user;
    } catch (error) {
      console.error(error.message);
     return  rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state: IUserState, action) => {
      state.userData = { ...action.payload };
    },
    setAuth: (state: IUserState, action) => {
      state.isAuth = action.payload;
    },
    setRemember: (state: IUserState, action: any) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: {
    [String(updateUser.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(updateUser.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.userData = { ...state.userData, ...action.payload };
        state.currentRequestId = undefined;
      }
    },
    [String(updateUser.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(getUserByIdChunck.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(getUserByIdChunck.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.userData = {
          ...state.userData,
          id: action.payload.user.id,
          email: action.payload.user.email,
          tel: action.payload.userInfo.telphone,
          firstname: action.payload.userInfo.firstname,
          lastname: action.payload.userInfo.lastname,
          password: "",
          avatar: `http://localhost:5000/` + action.payload.userInfo.avatar,
          role: action.payload.user.role,
        };
        state.comments = [...action.payload.user.comments];
        state.currentRequestId = undefined;
      }
    },
    [String(getUserByIdChunck.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(logoutThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(logoutThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.isAuth = false;
        state.currentRequestId = undefined;
      }
    },
    [String(logoutThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(getUsersThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(getUsersThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.currentRequestId = undefined;

        if (action.payload) {
          state.users = [...action.payload];
        }
      }
    },
    [String(getUsersThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(kickUserThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(kickUserThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        state.users = [...action.payload];
      }
    },
    [String(kickUserThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(unlockUserThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(unlockUserThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        state.users = [...action.payload];
      }
    },
    [String(unlockUserThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    [String(changeUserRoleThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(changeUserRoleThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        state.users = [...action.payload];
      }
    },
    [String(changeUserRoleThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const { setUserData, setAuth, setRemember } = userSlice.actions;
export default userSlice.reducer;
