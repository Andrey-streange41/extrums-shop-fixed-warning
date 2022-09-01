import facebook from "../assets/images/facebook.png";
import youtube from "../assets/images/youtube.png";
import instagram from "../assets/images/instagram.png";
import home from "../assets/images/home2.png";
import favorite from "../assets/images/favorite.png";
import catalog from "../assets/images/catalog2.png";
import activeCategory from "../assets/images/activeCategory.png";
import activeFavorite from "../assets/images/activeFavorite.png";
import activeHome from "../assets/images/activeHome.png";
import car from "../assets/images/car.png";
import pc from "../assets/images/pc.png";
import clothing from "../assets/images/clothing.png";
import activePc from "../assets/images/activePc.png";
import admin from '../assets/images/admin.png';
import adminActive from '../assets/images/adminActive.png'
import {
  INavBarSubItem,
  IModalItems,
  ILinkList,
  INavBarItem,
} from "../types/navBar.types";



export const iconsList = [
  {
    src: facebook,
    to: "https://www.facebook.com/",
  },
  {
    src: instagram,
    to: "https://www.instagram.com/",
  },
  {
    src: youtube,
    to: "https://www.youtube.com/",
  },
];

export const linkList: ILinkList[] = [
  {
    title: "Our services",
    links: [
      { text: "Product reviews", to: "/" },
      { text: "Reviews of stores", to: "/" },
    ],
  },
  {
    title: "To users",
    links: [
      { text: "FAQ for users", to: "/" },
      { text: "About the project", to: "/" },
    ],
  },
  {
    title: "Feedback",
    links: [
      { text: "For users", to: "/" },
      { text: "For online stores", to: "/" },
    ],
  },
];

export const navbarParrentList: INavBarItem[] = [
  {
    to: "/",
    text: "home",
    img: home,
    active: activeHome,
    isActive: false,
  },{
    to:"/admin",
    text:"admin",
    img:admin,
    active:adminActive,
    isActive:false
  },
  {
    to: "/favorites",
    text: "favorites",
    img: favorite,
    active: activeFavorite,
    isActive: false,
  },
  {
    to: "/catalog",
    text: "categories",
    img: catalog,
    active: activeCategory,
    isActive: false,
  },
  
];

export const modalItems: IModalItems[] = [
  {
    title: `Electronics`,
    items: [
      { category: "Laptops", isActive: false },
      { category: "Smartphones", isActive: false },
      { category: "Tablets", isActive: false },
      { category: "E-books", isActive: false },
      { category: "Drons", isActive: false },
    ],
  },
  {
    title: "Cars",
    items: [
      { category: "BMW", isActive: false },
      { category: "Mercedes", isActive: false },
      { category: "Audi", isActive: false },
      { category: "Toyota", isActive: false },
    ],
  },
  {
    title: "Clouthes",
    items: [
      { category: "Blouse", isActive: false },
      { category: "Shirt", isActive: false },
      { category: "Pants", isActive: false },
      { category: "Breeches", isActive: false },
      { category: "Leggings", isActive: false },
      { category: "Jeans", isActive: false },
    ],
  },
];

export const subMenu: INavBarSubItem[] = [
  {
    text: "Cars",
    img: car,
    active: activeCategory,
    to: "",
    isActive: false,
    modalItems: modalItems[1],
    purpose:[
      {name:'For prestige', isActive:true},
      {name:'For shipping', isActive:false},
      {name:'For racing', isActive:true},
      {name:'For travel', isActive:false},
    ],
    characteristics:{
      title:'Color',
      charList:[
        {name:'Red',isActive:false},
        {name:'Silver',isActive:false},
        {name:'Gold',isActive:false},
        {name:'Blue',isActive:false},
      ]
    }
  },
  {
    text: "Electronics",
    img: pc,
    active: activePc,
    to: "",
    isActive: false,
    modalItems: modalItems[0],
    purpose:[
      {name:'For video', isActive:true},
      {name:'For fun', isActive:false},
      {name:'For photo', isActive:true},
      {name:'For gaming', isActive:false},
    ],
    characteristics:{
      title:'Сonnection method',
      charList:[
        {name:'Wireless',isActive:false},
        {name:'Wires',isActive:false},
        
      ]
    }
  },
  {
    text: "Clouthes",
    img: clothing,
    active: activeCategory,
    to: "",
    isActive: false,
    modalItems: modalItems[2],
    purpose:[
      {name:'For office', isActive:true},
      {name:'For home', isActive:false},
      {name:'For party', isActive:true},
      {name:'For sport', isActive:false},
    ],
    characteristics:{
      title:'Color',
      charList:[
        {name:'Red',isActive:false},
        {name:'Silver',isActive:false},
        {name:'Gold',isActive:false},
        {name:'Blue',isActive:false},
      ]
    }
  },
];

