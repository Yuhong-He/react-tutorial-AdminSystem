import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../views/Login";
import Admin from "../views/Admin";
import Home from "../components/layout/Home";
import GoodsList from "../views/GoodsList";
import GoodInfo from "../views/GoodInfo";

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />}>
                        <Route index element={<Home />} />
                        <Route path="/admin/3" element={<GoodsList />} />
                        <Route path="/admin/4" element={<GoodInfo />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;

