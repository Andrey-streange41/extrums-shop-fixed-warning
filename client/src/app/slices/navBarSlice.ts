import { createSlice } from "@reduxjs/toolkit";
import { INavBarItem } from '../../types/navBar.types.ts';
import {
  subMenu,
  navbarParrentList,
} from "../../localDB/index.ts";

export interface NavBarState {
  items: INavBarItem[];
  subMenu: INavBarItem[];
  
}

const initialState: NavBarState = {
  items: navbarParrentList,
  subMenu: subMenu,
  
};

const navBarSlice = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    checkBoxActive:(state, action) => {
     const item = state.subMenu.find(el=>el.text === action.payload);
     item.isActive= !item.isActive;
    },
    setActive: (state, action) => {
      for (let i = 0; i < state.items.length; i++) {
        const element = state.items[i];
        element.isActive = false;
      }
        state.items[action.payload].isActive = true;
    },
    selectSubItem: (state, action) => {
      for (let i = 0; i < state.subMenu.length; i++) {
        if (i === action.payload) continue;
        const element = state.subMenu[i];
        element.isActive = false;
      }
     
     state.subMenu[action.payload].isActive = true;
    },
    selectModalItem: (state, action) => {
      for (let i = 0; i < state.subMenu.length; i++) {
        if (!state.subMenu[i].isActive) continue;
        for (let j = 0; j < state.subMenu[i].modalItems.items.length; j++) {
          if (j === action.payload) {
            continue;
          }
          const element = state.subMenu[i].modalItems.items[j];
          element.isActive = false;
        }
          if (state.subMenu[i].modalItems.items[action.payload].isActive)
            state.subMenu[i].modalItems.items[action.payload].isActive = false;
          else {
            state.subMenu[i].modalItems.items[action.payload].isActive = true;}
      }
    },
    goToSubMenu:(state,action)=>{
      for (let i = 0; i < state.subMenu.length; i++) {
        const element = state.subMenu[i];
        for(let j = 0; j < element.modalItems.items.length;j++){
            element.modalItems.items[j].isActive = false;
        }
      }
    },
    goToMainMenu:(state,action)=>{
      for (let i = 0; i < state.subMenu.length; i++){
        const element = state.subMenu[i];
        element.isActive=false;
      }
    },
    offAllSubCategory: (state, action) => {
      for (let i = 0; i < state.subMenu.length; i++) {
        const element = state.subMenu[i];
        element.isActive = false;
      }
    },
  },
});

export const { selectSubItem, setActive, selectModalItem,goToSubMenu,goToMainMenu,offAllSubCategory,checkBoxActive } =
  navBarSlice.actions;

export default navBarSlice.reducer;
