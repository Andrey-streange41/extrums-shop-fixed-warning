import {createSlice,PayloadAction} from '@reduxjs/toolkit';


const initialState ={
    sortName:'Select',
    sortItemsForComment:[
        { name: "date", isActive: false },
        { name: "time", isActive: false },
        { name: "name", isActive: false },
      ],
    sortItemsForProducts:[
        { name: "likes", isActive: false },
        { name: "dislikes", isActive: false },
        { name: "views", isActive: false },
        { name: "price", isActive: false },
        { name: "favorites", isActive: false },
    ],
}

const sortSlice = createSlice({
    name:'sort',
    initialState,
    reducers:{
        setActiveItem:(state,action:PayloadAction<any>)=>{
            for (let i = 0; i < state.sortItemsForComment.length; i++) {
                const element = state.sortItemsForComment[i];
                if(element.name===action.payload.name)
                {
                    element.isActive = !element.isActive;
                    continue;
                }
                element.isActive = false;
            }
            state.sortName = action.payload.name;
        },
    }
})

export const {setActiveItem}=sortSlice.actions;
export default sortSlice.reducer;