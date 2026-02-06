import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editScreenDialog: null,
  editInnerNodeDialog: null,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    editScreenGroupNode: (state, action) => {
      if (!action.payload) {
        state.editScreenDialog = null;
      } else {
        state.editScreenDialog = {
          id: action.payload.id,
          data: action.payload.data,
        };
      }
    },

    editInnerNode: (state, action) => {
      if (!action.payload) {
        state.editInnerNodeDialog = null;
      } else {
        state.editInnerNodeDialog = {
          id: action.payload.id,
          data: action.payload.data,
        };
      }
    },
  },
});

export const { editScreenGroupNode, editInnerNode } = editorSlice.actions;

export default editorSlice.reducer;
