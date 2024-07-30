import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ShowCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:4000/api/category/fetchcategory")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filteredCategories = data.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredCategories);
  }, [searchTerm, data]);

  const handleDelete = async (category) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${category.name}?`);
    if (confirmation) {
      try {
        await Axios.post("http://localhost:4000/api/category/delete", category);
        const updatedData = data.filter((cat) => cat.name !== category.name);
        setData(updatedData);
        setFilteredData(updatedData);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();
  const handleDashboardClick = () => {
    navigate('/');
  };


  return (
    <>

      <section id="admin_bg">
        <section id="admin-content">
          <div className='container pe-md-5 pb-3'>
            <div className='row'>
              <div className='col-xl-10 col-12 ms-md-auto'>
                <div className='dashboard-link mb-5 fs-5'>
                  <ul className='d-flex dashboard pt-5 ps-0'>
                    <li><button className='bg-none dash' onClick={handleDashboardClick}>Dashboard</button>&nbsp; / </li>
                    &nbsp;<li className='text-color'>Categories</li>
                  </ul>
                </div>

                <div className="row">

                  <div className="input-groups">
                    <input type="search" className="form-control shadow border-0 rounded-end-0 rounded-start-5" placeholder="Search by Customer Name" name="search" value={searchTerm} onChange={handleSearch} />
                    <div className="input-group-btn">
                      <button className="btn btn-primary rounded-end-5 rounded-start-0 shadow border-0" type="submit"><i className='bx bx-search bx-tada fs-3'></i></button>
                    </div>
                  </div>

                  {filteredData.length === 0 && (
                    <div className="alert alert-warning fw-bold mt-4" role="alert">
                      No category found!
                    </div>
                  )}

                  <div className="row ms-0">
                    {filteredData.map((category, index) => (
                      <div className="col-md-4 category col-sm-6 col-12 mt-3" key={index}>
                        <div className="card shadow border-0 h-100">
                          <img
                            src={`http://localhost:4000/Multer/${category.image}`}
                            alt={`category-${index}`}
                            className="card-img-top img-fluid mx-auto"
                            style={{ maxHeight: "200px", width: "200px" }}
                          />
                          <div className="card-body">
                            <h4 className="card-title fw-bold text-center">{category.name}</h4>
                            <div className="text-end">
                              <button className="btn btn-danger" onClick={() => handleDelete(category)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

    </>
  );
}

export default ShowCategories;