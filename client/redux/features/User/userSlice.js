// import { createSlice } from "@reduxjs/toolkit";

// let initialState = {
//     selectedProducts: [],
//     totalProcuts: 0,
//     totalPrice: 0
// }

// // initialState = localStorage
// if (typeof window !== 'undefined') {
//     if (!localStorage.getItem('cart')) {
//         localStorage.setItem('cart', JSON.stringify(initialState))
//     } else {
//         const cart = localStorage.getItem('cart')
//         initialState = JSON.parse(cart)
//     }
// }

// // totalProcuts and totalPrice
// const computationItems = (items) => {
//     let itemsCounter = items.reduce((total, product) => total + product.quantity, 0);
//     let ProductsPrice = items.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
//     return { itemsCounter, ProductsPrice }
// }

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
//         addToCart: (state, action) => {
//             const existProduct = state.selectedProducts.find(item => item.id === action.payload.id);
//             if (!existProduct) {

//                 // quantity
//                 action.payload.quantity ? action.payload.quantity + 1 : action.payload.quantity = 1;

//                 // push to state
//                 state.selectedProducts.push(action.payload);

//                 // computation total price and count of products
//                 const { itemsCounter, ProductsPrice } = computationItems(state.selectedProducts);
//                 state.totalProcuts = itemsCounter;
//                 state.totalPrice = ProductsPrice;

//                 // save to local storge
//                 localStorage.setItem('cart', JSON.stringify(state));
//             }
//         },
//         increase: (state, action) => {
//             const productIndex = state.selectedProducts.findIndex(item => item.id === action.payload.id);

//             // quantity
//             state.selectedProducts[productIndex].quantity++;

//             // computation total price and total products
//             const { itemsCounter, ProductsPrice } = computationItems(state.selectedProducts);
//             state.totalProcuts = itemsCounter;
//             state.totalPrice = ProductsPrice;

//             // save to local storge
//             localStorage.setItem('cart', JSON.stringify(state));
//         },
//         decrease: (state, action) => {
//             const productIndex = state.selectedProducts.findIndex(item => item.id === action.payload.id);

//             // quantity
//             state.selectedProducts[productIndex].quantity > 0 && state.selectedProducts[productIndex].quantity--;

//             // computation total price and total products
//             const { itemsCounter, ProductsPrice } = computationItems(state.selectedProducts);
//             state.totalProcuts = itemsCounter;
//             state.totalPrice = ProductsPrice;

//             // save to local storge
//             localStorage.setItem('cart', JSON.stringify(state));
//         },
//         removeFromCart: (state, action) => {

//             // all the products except that one we want remove
//             const newSelectedProducts = state.selectedProducts.filter(item => item.id !== action.payload.id);
//             state.selectedProducts = newSelectedProducts;

//             // computation total price and count of products
//             const { itemsCounter, ProductsPrice } = computationItems(state.selectedProducts);
//             state.totalProcuts = itemsCounter;
//             state.totalPrice = ProductsPrice;

//             // save to local storge
//             localStorage.setItem('cart', JSON.stringify(state));
//         },
//         clear: (state, action) => {
//             let clearState = {
//                 selectedProducts: [],
//                 totalProcuts: 0,
//                 totalPrice: 0
//             }

//             state = { ...clearState };

//             // save to local storge
//             localStorage.setItem('cart', JSON.stringify(state))

//             return state
//         }
//     }
// });

// export const {
//     addToCart, increase, clear,
//     decrease, removeFromCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;

'use client';

import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  userInfo: {},
  recommendedCourses: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUserInfo: (state, action) => {
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', JSON.stringify(action.payload.token));
      }
      state.userInfo = action.payload;
    },    
    setRecommendedCourses: (state, action) => {
      state.recommendedCourses = action.payload;
    },
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.userInfo = {};
      state.recommendedCourses = [];
    },
    setFirstLoginToFalse: (state) => {
      state.userInfo = {...state.userInfo, firstLogin: false };
    }
  },
});

export const { setLoggedInUserInfo, setRecommendedCourses, logoutUser, setFirstLoginToFalse } = userSlice.actions;

export default userSlice.reducer;
