import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPrice {
  min: number;
  max: number;
}

export interface ISelectedItems {
  isActive: boolean;
  name: string;
}
export type IModalFilter = {
  isOpenCategoryMenu: boolean;
  isOpenPriceMenu: boolean;
  isOpenAddMenu_1: boolean;
  isOpenAddMenu_2: boolean;
  selectedItems: ISelectedItems[];
  price: IPrice;
};

const initialState: IModalFilter = {
  isOpenCategoryMenu: true,
  isOpenPriceMenu: true,
  isOpenAddMenu_1: true,
  isOpenAddMenu_2: true,
  selectedItems: [],
  price: { min: 0, max: 0 },
};

export const modalFilterSlice = createSlice({
  name: "modalFilter",
  initialState,
  reducers: {
    switchCategoryMenu: (state) => {
      state.isOpenCategoryMenu = !state.isOpenCategoryMenu;
    },
    switchPriceMenu: (state) => {
      state.isOpenPriceMenu = !state.isOpenPriceMenu;
    },
    switchAddMenu1: (state) => {
      state.isOpenAddMenu_1 = !state.isOpenAddMenu_1;
    },
    switchAddMenu2: (state) => {
      state.isOpenAddMenu_2 = !state.isOpenAddMenu_2;
    },
    setSelectedItems: (state, action: PayloadAction<any>) => {
      if(action.payload)
          state.selectedItems = [...state.selectedItems, action.payload];
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      state.selectedItems = state.selectedItems.filter(
        (el: ISelectedItems) => el.name !== action.payload
      );
    },
    setPrice: (state, action: PayloadAction<IPrice>) => {
      state.price = action.payload;
    },
  },
});

export const {
  switchCategoryMenu,
  switchPriceMenu,
  switchAddMenu1,
  switchAddMenu2,
  setSelectedItems,
  removeSelectedItem,
  setPrice,
} = modalFilterSlice.actions;

export default modalFilterSlice.reducer;
