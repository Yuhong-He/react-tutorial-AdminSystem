import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import axios from "axios";
import {API} from "./config";
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import Router from "./router"
axios.defaults.baseURL = API;
axios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
})
axios.interceptors.response.use((config) => {
    NProgress.done()
    return config;
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
