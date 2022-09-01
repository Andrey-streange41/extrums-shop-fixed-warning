import { configureStore } from '@reduxjs/toolkit';
import modalFilterSlice from './slices/modalFilterSlice.ts';
import navBarSlice  from './slices/navBarSlice.ts';
import productsListSlice from './slices/productsListSlice.ts';
import searchSlice from './slices/searchSlice.ts';
import sortSlice from './slices/sortSlice.ts';
import toolsPanelSlice from './slices/toolsPanelSlice.ts';
import userSlice from './slices/userSlice.ts';


export const store = configureStore({
    reducer: {
        navBar: navBarSlice,
        productsList: productsListSlice,
        toolsPanel: toolsPanelSlice,
        modalFilter: modalFilterSlice,
        sort: sortSlice,
        search: searchSlice,
        user:userSlice,
       
    },
  })
  

  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;  