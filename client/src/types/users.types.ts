import { IProduct } from "./favoriteList.types";

export interface IUser{
    firstname:string|null;
    lastname:string|null;
    email:string|null;
    password:string|null;
    tel:string|null;
    avatar:string|null;
    updateAgrements:boolean;
    id?:string|null;
    favorites:IProduct[];
    banReason?:string;
    isBaned?:boolean;
    role:'ADMIN'|'USER';
}


export interface IUser2{
    email:string|null;
    password:string|null;
    id:number;
    role:'ADMIN'|'USER';
    userInfo:IUserInfo;
}


export interface IUserInfo{
    firstname:string;
    lastname:string;
    id:number;
    telphone:string;
    avatar:string;
    agrements:boolean;
    userId:number;
    user_id:number; // mistake zaglushka
}