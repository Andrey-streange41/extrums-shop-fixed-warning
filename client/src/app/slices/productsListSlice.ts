import {
  createSlice,
  createAsyncThunk,
  SerializedError,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  IComment,
  IProduct,
  IUserInterfaceItem,
} from "../../types/favoriteList.types";
import { AxiosError } from "axios";
import {
  addComment,
  getProducts,
  addToFavorites,
  updateComunicationByProductId,
  removeFromFavorites,
  getFavoriteList,
  removeComment,
  updateProductInfo,
  removeProductInfo,
  addProductInfo,
  addChar,
  removeProductById,
} from "../../http/productApi.ts";
import { IPrice } from "./modalFilterSlice";

export interface IProductsList {
  favoriteList: IProduct[];
  favorFilterList: IProduct[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  currentRequestId: string | undefined;
  error: SerializedError | null;
  testList?: any[];
  comments?: IComment[];
}

const initialState: IProductsList = {
  favoriteList: [],
  favorFilterList: [],
  loading: "idle",
  currentRequestId: undefined,
  error: null,
  testList: [],
  comments: [],
};

export interface IRemoveProductInfo {
  id: number;
  characterKey?: string;
  imageId?: string;
}

export const removeProductInfoThunk = createAsyncThunk<
  IProduct[],
  IRemoveProductInfo,
  {rejectValue:string}
>(
  "remove/productInfo",
  async (params: IRemoveProductInfo, { rejectWithValue }) => {
    try {
      const responce = await removeProductInfo(params);
      return responce;
    } catch (error) {
      console.error(error.message);
     return  rejectWithValue(error);
    
    }
  }
);

export const removeProductThunk = createAsyncThunk<IProduct[],number,{rejectValue:string}>(
  "delete/product",
  async (id: number, { rejectWithValue }) => {
    try {
      const responce = await removeProductById(id);
      return responce;
    } catch (error) {
      console.log(error.message);
     return rejectWithValue(error);
    }
  }
);
export interface ICreateChar {
  key: string;
  value: string;
  id: number;
}

export const addCharacteristicThunk = createAsyncThunk<IProduct[], ICreateChar,{rejectValue:string}>(
  "add/characteristic",
  async (params: ICreateChar, { rejectWithValue }) => {
    try {
      const responce = await addChar(params);
      return responce;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export interface IUpdateProductInfo {
  description?: string;
  id: number;
  charactersValue?: string;
  charactersKey?: string;
  title?: string;
  price?: number;
  discountPrice?: number;
  newImage?: File;
}
export const updateProductInfoThunk = createAsyncThunk<
  IProduct[],
  IUpdateProductInfo
  ,{rejectValue:string}
>(
  "update/productInfo",
  async (params: IUpdateProductInfo, { rejectWithValue }) => {
    try {
      const responce = await updateProductInfo(params);
      return responce;
    } catch (error) {
      console.error(error.message);
       return rejectWithValue(error);
     
    }
  }
);

export const addProductInfoThunk = createAsyncThunk<IProduct[], FormData,{rejectValue:string}>(
  "add/productInfo",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const products = await addProductInfo(formData);
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
interface IQuery {
  category?: string;
  keyword?: string;
  sub_category?: string;
  price?: IPrice;
  purposes?: string[];
}
export const getProductsThunk = createAsyncThunk<
  IProduct[] | AxiosError,
  IQuery
  ,{rejectValue:string}
>("get/product", async (query: IQuery, { rejectWithValue }) => {
  try {
    const products = await getProducts(query);
    if (products.code === "ERR_NETWORK") {
      throw new AxiosError("Server error.");
    }
    return products;
  } catch (error) {
   return rejectWithValue(error);
  }
});
interface ICommunication {
  name: string;
  id: number;
}
export const updateProductsThunk = createAsyncThunk<IProduct[], ICommunication,{rejectValue:string}>(
  "update/product",
  async function (data, { rejectWithValue }) {
    try {
      const products = await updateComunicationByProductId(data);
      return products;
    } catch (error) {
      console.log(error.message);
     return rejectWithValue(error);
      
    }
  }
);
interface IFavoriteAdding {
  userId: number;
  productId: number;
}
export const addToFavoritesThunk = createAsyncThunk<
  IProduct[],
  IFavoriteAdding
  ,{rejectValue:string}
>("add/favorites", async function (data, { rejectWithValue }) {
  try {
    const products = await addToFavorites(data);
    return products;
  } catch (error) {
    console.log(error.message);
    return rejectWithValue(error);
    
  }
});
export const removeFromFavoriteListThunk = createAsyncThunk<
  IProduct[],
  IFavoriteAdding
  ,{rejectValue:string}
>("remove/favorites", async function (data, { rejectWithValue }) {
  try {
    const responce = await removeFromFavorites(data);
    return responce;
  } catch (error) {
    console.log(error.message);
   return rejectWithValue(error);
   
  }
});
export const getFavorListThunk = createAsyncThunk<IProduct[], number,{rejectValue:string}>(
  "remove/favorites",
  async function (userId, { rejectWithValue }) {
    try {
      const responce = await getFavoriteList(userId);
      return responce;
    } catch (error) {
      console.log(error.message);
      return  rejectWithValue(error);
     
    }
  }
);
interface IAddComment {
  comment: IComment;
  productId: number;
  userId: number;
}
export const addCommentToProductThunk = createAsyncThunk<
  IProduct[],
  IAddComment
  ,{rejectValue:string}
>("add/comment", async function (data, { rejectWithValue }) {
  try {
    const responce = await addComment(data);

    return responce;
  } catch (error) {
    console.log(error.message);
    return rejectWithValue(error);
  }
});
export const removeCommentThunk = createAsyncThunk<IProduct[], number,{rejectValue:string}>(
  "remove/comment",
  async (id, { rejectWithValue }) => {
    try {
      const responce = await removeComment(id);
      return responce;
    } catch (error) {
      console.log(error.message);
      return  rejectWithValue(error);
      
    }
  }
);

const productsListSlice = createSlice({
  name: "productsList",
  initialState,
  reducers: {
    setProductsList: (state, action: PayloadAction<IProduct[]>) => {
      if (action.payload) state.testList = [...action.payload];
    },
    setFavoriteList: (state, action: PayloadAction<IProduct[]>) => {
      if (action.payload) state.favoriteList = [...action.payload];
    },
    setFavorFilterList: (state, action: PayloadAction<IProduct[]>) => {
      if (action.payload) state.favorFilterList = action.payload;
    },
  },
  extraReducers: {
    [String(getProductsThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(getProductsThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        if (!action.payload) throw new AxiosError("Server error.");
        state.loading = "idle";
        state.testList = [...action.payload];
        state.favoriteList = state.testList.filter(
          (el) =>
            el.userComunications.find(
              (el: IUserInterfaceItem) => el.name === "favorites"
            ).isActive === true
        );
        state.currentRequestId = undefined;
      }
    },
    [String(getProductsThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(updateProductsThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(updateProductsThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        if (action.payload) {
          const element = state.testList?.find(
            (el: IProduct) => el.id === action.payload.id
          );
          element.userComunications = action.payload?.userComunications;
          const fav = state.favoriteList?.find(
            (el: IProduct) => el.id === element.id
          );
          if (fav) fav.userComunications = element?.userComunications;
        }
        state.currentRequestId = undefined;
      }
    },
    [String(updateProductsThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(addToFavoritesThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(addToFavoritesThunk.fulfilled)]: (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        if (action.payload) state.favoriteList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(addToFavoritesThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(removeFromFavoriteListThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(removeFromFavoriteListThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
    

        state.favoriteList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(removeFromFavoriteListThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        console.log("removing error!");
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(getFavorListThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(getFavorListThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.favoriteList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(getFavorListThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(addCommentToProductThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(addCommentToProductThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.testList = [...action.payload];
        state.loading = "idle";
        state.currentRequestId = undefined;
      }
    },
    [String(addCommentToProductThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(removeCommentThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(removeCommentThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(removeCommentThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(updateProductInfoThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(updateProductInfoThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(updateProductInfoThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(removeProductInfoThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(removeProductInfoThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(removeProductInfoThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(addProductInfoThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(addProductInfoThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(addProductInfoThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(addCharacteristicThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(addCharacteristicThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(addCharacteristicThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },

    [String(removeProductThunk.pending)]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [String(removeProductThunk.fulfilled)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.loading = "idle";
        state.testList = [...action.payload];
        state.currentRequestId = undefined;
      }
    },
    [String(removeProductThunk.rejected)]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && requestId === state.currentRequestId) {
        state.error = action.payload;
        state.loading = "failed";
        state.currentRequestId = undefined;
      }
    },
  },
});

export const { setProductsList, setFavoriteList, setFavorFilterList } =
  productsListSlice.actions;

export default productsListSlice.reducer;
