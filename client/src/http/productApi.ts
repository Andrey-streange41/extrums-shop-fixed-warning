import { $authHost, $host } from "./index.ts";
import { IUpdateProductInfo } from "../app/slices/productsListSlice.ts";
import { IProduct } from "../types/favoriteList.types";
import { IRemoveProductInfo } from "../app/slices/productsListSlice";

export const addProduct = async (product) => {
  try {
    await $authHost.post("/api/products", product);
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const removeProductById = async (id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/products/${id}`);
    return data;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};
export const addChar = async (params) => {
  try {
    const { data } = await $authHost.post("/api/products/addChar", params);
    return data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const addProductInfo = async (formData: FormData) => {
  try {
    const { data } = await $authHost.put("/api/products/addInfo", formData);
    return data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const getProducts = async (query) => {
  try {
    const { data } = await $host.get(`/api/products`, {
      params: {
        category: query?.category,
        keyword: query?.keyword,
        sub_category: query?.sub_category,
        price: query?.price,
        purposes: query?.purposes,
      },
    });
    return data.rows ? data.rows : data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const updateComunicationByProductId = async (data) => {
  try {
    const responce = await $authHost.put("api/products", data);
    return responce.data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const addToFavorites = async (product) => {
  try {
    const responce = await $authHost.post("api/products/favorites", product);
    return responce.data;
  } catch (error) {
    return error;
  }
};

export const removeFromFavorites = async (data) => {
  try {
    const responce = await $authHost.delete(`api/products/favorites`, {
      data: {
        data: data,
      },
    });
    return responce.data;
  } catch (error) {
    alert("This option need authorization !");
    console.log(error.message);
    return error;
  }
};

export const getFavoriteList = async (userId: number) => {
  try {
    const responce = await $host.get(`api/products/favorites/take${userId}`);
    return responce.data;
  } catch (error) {
    console.log(error.message + " FAVOR LIST GET ERROR!");
    return error;
  }
};

export const addComment = async (data) => {
  try {
    const responce = await $host.post("api/products/comments", data);
    return responce.data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const getComments = async (id: number) => {
  try {
    const responce = await $host.get(`api/products/comments/${id}`);
    return responce.data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const removeComment = async (id: number) => {
  try {
    const { data } = await $authHost.delete("api/products/comments/" + id);
    return data;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const updateProductInfo = async (
  params: IUpdateProductInfo
): Promise<IProduct[]> => {
  try {
    const { data } = await $host.put("api/products/updateInfo", params);

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const removeProductInfo = async (
  params: IRemoveProductInfo
): Promise<IProduct[]> => {
  try {
    const { data } = await $host.delete("api/products/removeInfo", {
      data: params,
    });
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
