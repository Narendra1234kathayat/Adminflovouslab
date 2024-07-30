import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// CSS
import '../assets/css/style.css';

// img
import logo from '../assets/img/logo.png';
import Axios from 'axios';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUtensils, faCirclePlus, faSquarePlus, faPercent, faImage, faThumbTack, faComment } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [loggedin, setLoggedin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const isActiveCategory = location.pathname === '/showcategory' || location.pathname === '/addcategory';
  const isActiveProduct = location.pathname === '/showproduct' || location.pathname === '/addproduct';
  const isActiveOffer = location.pathname === '/showcoupon' || location.pathname === '/addcoupon'
  const isActiveGallery = location.pathname === '/showgallery' || location.pathname === '/addgallery';

  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const res = await Axios.get("http://localhost:4000/api/admin_auth/logout");
      if (res.data.status) {
        navigate('/login');
      } else {
        alert("error in logout");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  }

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const res = await Axios.get('http://localhost:4000/api/admin_auth/verify');
        if (res.data.status) {
          setLoggedin(true)
        } else {
          navigate('/login');
          setLoggedin(false)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    handleVerify();
  }, [navigate, loggedin]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Adjust sidebar visibility based on window width
      if (width <= 751) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    // Call handleResize on initial load
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const offcanvasDarkNavbar = document.getElementById("offcanvasDarkNavbar");
    if (offcanvasDarkNavbar) {
      if (windowWidth <= 1200) {
        offcanvasDarkNavbar.classList.remove("show");
      } else {
        offcanvasDarkNavbar.classList.add("show");
      }
    }
  }, [windowWidth]);

  return (
    <>

      {loggedin && <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="btn-group">
            <button type="button" className="btn btn-primary">Welcome Admin</button>
            <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu bg-black">
              <button type="button" className="btn btn-danger px-5 mx-3" onClick={handleLogout}>Logout</button>
            </ul>
          </div>
          <div className={`offcanvas offcanvas-start text-bg-dark border-0 ${sidebarVisible ? 'show' : ''}`} tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header mx-md-auto">
              <div className='logo'>
                <img src={logo} alt="admin-logo" className='img-fluid border-0 p-1' />
              </div>
              <button type="button" className="btn-close btn-close-white d-block d-md-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body link">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 sidebar">

                <li className="nav-item mb-2">
                  <NavLink className="nav-link px-3" aria-current="page" to="/"> <FontAwesomeIcon icon={faHouse} />  &nbsp;Dashboard</NavLink>
                </li>

                <li className="nav-item mb-2">
                  <NavLink className="nav-link px-3" to="/orders"> <FontAwesomeIcon icon={faUtensils} /> &nbsp; Orders</NavLink>
                </li>

                <li className="nav-item dropdown mb-2">
                  <a className="nav-link dropdown-toggle px-3" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faCirclePlus} className={isActiveCategory ? 'active-link' : ''} /> &nbsp;<span className={isActiveCategory ? 'active-link' : ''}>Category</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink exact="true" className="dropdown-item" activeclassname="active" to="/showcategory">View Category</NavLink></li>
                    <hr className="dropdown-divider" />
                    <li><NavLink exact="true" className="dropdown-item" activeclassname="active" to="/addcategory">Add Category</NavLink></li>
                  </ul>
                </li>

                <li className="nav-item dropdown mb-2">
                  <a className="nav-link dropdown-toggle px-3" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faSquarePlus} className={isActiveProduct ? 'active-link' : ''} /> &nbsp; <span className={isActiveProduct ? 'active-link' : ''}> Product</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" activeclassname="active" to="/showproduct">View Product</NavLink></li>
                    <hr className="dropdown-divider" />
                    <li><NavLink className="dropdown-item" activeclassname="active" to="/addproduct">Add Product</NavLink></li>
                  </ul>
                </li>

                <li className="nav-item dropdown mb-2">
                  <a className="nav-link dropdown-toggle px-3" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faPercent} className={isActiveOffer ? 'active-link' : ''} /> &nbsp; <span className={isActiveOffer ? 'active-link' : ''}>Offer</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" activeclassname="active" to="/showcoupon">View Offer</NavLink></li>
                    <hr className="dropdown-divider" />
                    <li><NavLink className="dropdown-item" activeclassname="active" to="/addcoupon">Add Offer</NavLink></li>
                  </ul>
                </li>

                <li className="nav-item dropdown mb-2">
                  <a className="nav-link dropdown-toggle px-3" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faImage} className={isActiveGallery ? 'active-link' : ''} /> &nbsp; <span className={isActiveGallery ? 'active-link' : ''}> Gallery</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" to="/showgallery">View Gallery</NavLink></li>
                    <hr className="dropdown-divider" />
                    <li><NavLink className="dropdown-item" to="/addgallery">Add Gallery</NavLink></li>
                  </ul>
                </li>

                <li className="nav-item mb-2">
                  <NavLink className="nav-link px-3" to="/reservation"> <FontAwesomeIcon icon={faThumbTack} /> &nbsp; Reservation</NavLink>
                </li>

                <li className="nav-item mb-2">
                  <NavLink className="nav-link px-3" to="/contact"> <FontAwesomeIcon icon={faComment} /> &nbsp;Feed & Review</NavLink>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </nav>}
    </>
  )
}

export default Navbar;