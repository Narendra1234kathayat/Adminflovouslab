// import bootstarp
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import '../src/assets/css/style.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import Components
import CompoRefresh from './components/CompoRefresh.jsx';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard.jsx';
import Order from './components/Order.jsx';
import AddCategory from './components/AddCategory.jsx';
import Login from './Auth/Login.jsx';
import AddProduct from './components/AddProduct.jsx';
import AddGallery from './components/AddGallery.jsx';
import ShowGallery from './components/ShowGallery.jsx';
import ShowCategories from './components/ShowCategories.jsx';
import Reservation from './components/Reservation.jsx';
import Contact from './components/Contact.jsx';
import ShowProduct from './components/ShowProduct.jsx';
import AddCoupon from './components/AddCoupon.jsx';
import ShowCoupon from './components/ShowCoupon.jsx';
import ScrollToTop from "react-scroll-to-top";

function App() {

  return (
    <>
      <BrowserRouter>
        <CompoRefresh />
        <Navbar />
        <ScrollToTop smooth />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Dashboard />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/addcategory' element={<AddCategory />} />
          <Route path='/showproduct' element={<ShowProduct />} />
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/addgallery' element={<AddGallery />} />
          <Route path='/showgallery' element={<ShowGallery />} />
          <Route path='/showcategory' element={<ShowCategories />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/addcoupon' element={<AddCoupon />} />
          <Route path='/showcoupon' element={<ShowCoupon />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;