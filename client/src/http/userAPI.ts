import { $authHost, $host } from "./index.ts";
import jwt_decode from "jwt-decode";
import { object } from "yup";

interface IRegistration {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}

export const registration = async (userData: IRegistration): Promise<string> => {
  const {data} = await $host.post('api/user/registration',{...userData});
    localStorage.setItem('token',data);
   return jwt_decode(data);
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await $host.post("api/user/login", { email, password });
   
    
    if (data instanceof Object) {
      throw new Error("error!");
    }

    localStorage.setItem("token", data);
    return jwt_decode(data);
  } catch (error) {
    return error.message;
  }
};

export const isAuth = async () => {
  const {data} = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data);
  return jwt_decode(data);
};

export const updateUserById = async (userData) => {
  try {
    const { data } = await $host.put("api/user/update", userData);
   
    
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const getUserById = async (id:number) => {
  try {
    const { data } = await $host.get(`api/user/${id}`);
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};


export const logout = async () => {
  try {
    await $host.post(`api/user/logout`);
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};


export const getAllUsers =async()=>{
  try {
    const {data} = await $host.get('api/user');
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}


export const kikUser = async (id:number) => {
  try {
     const {data} = await $host.post(`api/user/kick/${id}`);
     return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};


export const unlockUser = async (id:number) => {
  try {
    const {data} = await $host.delete(`api/user/unlock/${id}`);
    return data;
 } catch (error) {
   console.log(error.message);
   return error.message;
 }
}


export const changeUserRole = async(role:'ADMIN'|'USER',id:number)=>{
  try {
    const {data} = await $host.put(`api/user/changeRole`,{role,id});
    return data;
 } catch (error) {
   console.log(error.message);
   return error.message;
 }
}