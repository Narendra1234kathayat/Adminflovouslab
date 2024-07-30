import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

function ShowProduct() {
    const [update, setUpdate] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [originalProducts, setOriginalProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        productname: "",
        productDesc: "",
        type: "",
        productprice: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://localhost:4000/api/product/fetchproduct");
                if (response.status === 200) {
                    setOriginalProducts(response.data);
                    setFilteredProducts(response.data);
                } else {
                    console.log("Error fetching products");
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        };

        fetchData();
    }, [deleted]);

    useEffect(() => {
        const filtered = originalProducts.filter(
            (product) =>
                product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productdesc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, originalProducts]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const updateForm = (product) => {
        setSelectedProduct(product);
        setUpdate(true);
        setFormData({
            productname: product.productname,
            productDesc: product.productdesc,
            type: product.type,
            productprice: product.productprice
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const deleteProduct = async (product) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            try {
                await Axios.post(`http://localhost:4000/api/product/deleteproduct/${product._id}`);
                setDeleted(true);
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Axios.post(`http://localhost:4000/api/product/updateproduct/${selectedProduct._id}`, formData);
            setUpdate(false);
            setSelectedProduct(null);
            const response = await Axios.get("http://localhost:4000/api/product/fetchproduct");
            if (response.status === 200) {
                alert("Product updated successfully!");
                setOriginalProducts(response.data);
                setFilteredProducts(response.data);

                // Close the modal
                const modal = document.getElementById('exampleModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };


    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    };

    const getLabelColor = (type) => {
        if (type.toLowerCase() === 'veg') {
            return 'text-success';
        } else if (type.toLowerCase() === 'egg') {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
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
                                        &nbsp;<li className='text-color'>Products</li>
                                    </ul>
                                </div>

                                <div>
                                    <div className="input-groups">
                                        <input type="search" className="form-control shadow border-0 rounded-end-0 rounded-start-5" placeholder="Search by Food Name" name="search" value={searchTerm} onChange={handleSearch} />
                                        <div className="input-group-btn">
                                            <button className="btn btn-primary rounded-end-5 rounded-start-0 shadow border-0" type="submit"><i className='bx bx-search bx-tada fs-3'></i></button>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        {filteredProducts.length === 0 ? (
                                            <div className="alert alert-warning fw-bold" role="alert">
                                                No product found!
                                            </div>
                                        ) : (
                                            filteredProducts.map((product) => (
                                                <div className="col-lg-4 product" key={product._id}>
                                                    <div className="shadow-lg rounded-4 mt-3 p-4">
                                                        <div className="product">
                                                            <h5 className="mb-3"><strong>{product.productname}</strong></h5>
                                                            <p>{product.productdesc}</p>
                                                            <h5 className={getLabelColor(product.type)}><strong>{product.type}</strong></h5>
                                                            <h5><strong>₹ {product.productprice}</strong></h5>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => updateForm(product)} className="btn btn-warning"><FontAwesomeIcon icon={faPenToSquare} /></button>
                                                            <button onClick={() => deleteProduct(product)} className="btn btn-danger ms-auto"><FontAwesomeIcon icon={faTrash} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="modal-body">
                                                    <div className="mb-3">
                                                        <label htmlFor="productname" className="form-label">Product Name:</label>
                                                        <input type="text" className="form-control" id="productname" name="productname" value={formData.productname} onChange={handleChange} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="productDesc" className="form-label">Product Description:</label>
                                                        <input type="text" className="form-control" id="productDesc" name="productDesc" value={formData.productDesc} onChange={handleChange} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="type" className="form-label">Type:</label>
                                                        <select className="form-select" id="type" name="type" value={formData.type} onChange={handleChange}>
                                                            <option value="" defaultValue disabled>Select the Product Type</option>
                                                            <option value="Veg">Veg</option>
                                                            <option value="Non Veg">Non Veg</option>
                                                            <option value="Egg">Egg</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="productprice" className="form-label">Product Price:</label>
                                                        <input type="number" className="form-control" id="productprice" name="productprice" value={formData.productprice} onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                    <button type="submit" className="btn btn-primary">Update Product</button>
                                                </div>
                                            </form>
                                        </div>
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

export default ShowProduct;