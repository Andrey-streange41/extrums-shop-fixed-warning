export interface INavBarSubItem {
  to: string;
  text: string;
  img: string;
  active: string;
  isActive: boolean;
  modalItems: IModalItems;
  purpose: IPurpose[];
  characteristics:IChar;
}

export interface IChar{
  title:string,
  charList:IPurpose[]
}
export interface IPurpose{
  name:string,
  isActive:boolean
}
export interface IModalItems {
  title: string;
  items: IModalItem[];
}

export interface IModalItem {
  category: string;
  isActive: boolean;
}

export interface ILinks {
  text: string;
  to: string;
}

export interface ILinkList {
  title: string;
  links: ILinks[];
}

export interface INavBarItem {
  to: string;
  text: string;
  img: string;
  active: string;
  isActive: boolean;
}
