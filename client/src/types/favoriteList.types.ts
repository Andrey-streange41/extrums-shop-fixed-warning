import {IUser} from './users.types.ts'
export interface IDate {
  month: string;
  year: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface IComment {
  createdAt?:string;
  date?:IDate;
  dateId:number;
  id:number;
  message:string;
  productId:number;
  updatedAt?:string;
  userId:number;
  user?:IUser;
}


export interface ICharct{
  name:string,
  info:string
}



export interface ICharacteristics {
 id:number;
 productId:number;
 info:string;
 name:string;
}

export interface IUserInterfaceItem{
  amount:number,
  name:string,
  isActive:boolean,
  id:number,
  productId:number
}

export interface IPurpose{
  id:number;
  productId:number;
  product?:IProduct;
  subMenuId:number|null;
  name:string;
  isActive:boolean;
}

export interface IProduct {
  avatar: string,
  category: string,
  characteristics:ICharacteristics[],
  comments: IComment[],
  discount:boolean,
  full_info:string,
  id:number,
  images:string[],
  isFavor:boolean,
  price:number,
  purpose:IPurpose[],
  subCategory: string,
  favorites?:IFavorites,
  title: string,
  userComunications:IUserInterfaceItem[],
  discountPrice:number;
}


export interface IFavorites{
  id:number;
  userId:number;
  productId:number;
}