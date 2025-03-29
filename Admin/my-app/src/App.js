import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home';
import Signin from './component/Signin';
import Navbar from './component/Navbar';
import Manage_Product from './component/Manage_Product/Manage_Product';
import Category from './component/Manage_Product/Category';
import SubCategory from './component/Manage_Product/SubCategory';
import Product from './component/Manage_Product/Product';
import Users from './component/Users';
import Order from './component/Order';






function App() {
  return (
    <>

      <Routes>

        <Route path='/' element={<Signin />}></Route>
        <Route path='/Home' element={<Home />}></Route>
        <Route path='/Navbar' element={<Navbar />}></Route>
        <Route path='Manage_Product' element={<Manage_Product />}></Route>
        <Route path='/Category' element={<Category />} ></Route>
        <Route path='/SubCategory' element={<SubCategory />}></Route>
        <Route path='/Products' element={<Product />}></Route>
        <Route path='Users' element={<Users />}></Route>
        <Route  path='/Order' element={<Order/> }></Route>


      </Routes>




    </>

  );
}

export default App