import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import configReducer from './configSlice';

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    config: configReducer,
  },
});

export default store;