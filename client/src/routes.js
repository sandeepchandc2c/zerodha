import {BrowserRouter ,Routes, Route } from "react-router-dom";
import CreateOrders from './Component/CreateOrders';
import Login from "./Component/Login"
const Routers = ()=>{
    return (
        <BrowserRouter>
            <Routes > 
                <Route path="/"  element={<Login/>} />
                <Route path="/position/:id"  element={<CreateOrders/>} />
            </Routes>
        </BrowserRouter>
      );
    };
    
export default Routers;