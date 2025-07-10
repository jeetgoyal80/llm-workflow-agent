// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// 🧩 Combine reducers
const rootReducer = combineReducers({
  user: userReducer
});

// 🗂️ Config persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // only user slice will persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ⚙️ Create store with persisted reducer and serializable checks
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// 🔁 Persistor to be used in main.jsx
export const persistor = persistStore(store);
