import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";

export const store = configureStore(
  {
    reducer: {
      account: accountReducer,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
