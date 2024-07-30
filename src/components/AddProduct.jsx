import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

function AddProduct() {

    // Backend code 

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");

    const [data, setData] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:4000/api/category/fetchcategory")
            .then((response) => {
                setData(response.data);
                console.log(data)
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!productName || !productPrice || !productDesc || !type || !category) {
            alert("Kindly fill out all the fields.");
            return;
        }

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("productPrice", productPrice);
        formData.append("productDesc", productDesc);
        formData.append("category", category);
        formData.append("type", type);


        try {
            const response = await Axios.post(
                'http://localhost:4000/api/product/addproduct',
                {
                    productName: productName,
                    productPrice: productPrice,
                    productDesc: productDesc,
                    category: category,
                    type: type
                }
            );

            if (response.data) {
                // Assuming response.data is the saved gallery data
                alert("product successfully");
                setProductName('');
                setProductPrice('');
                setProductDesc('');
                setType('');
                setCategory('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Navigate to Dashboard

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    }

    return (
        <>
            <section id='admin_bg'>
                <section id='admin-content'>
                    <div className='container pe-md-5 pb-3'>
                        <div className='row'>
                            <div className='col-xl-10 ms-md-auto'>
                                <div className='dashboard-link mb-5 fs-5'>
                                    <ul className='d-flex dashboard pt-5 ps-0'>
                                        <li><button className='bg-none dash' onClick={handleDashboardClick}>Dashboard</button>&nbsp; / </li>
                                        &nbsp;<li className='text-color'>Add Product</li>
                                    </ul>
                                </div>
                                <form onSubmit={handleSubmit} className='bg-white p-5 shadow-lg rounded-3'>
                                    <div className="mb-4">
                                        <label htmlFor="product_name" className="form-label">Product Name:</label>
                                        <input type="text" className="form-control" id="product_name" name='product_name' placeholder="Enter the Product Name" value={productName}
                                            onChange={(e) => setProductName(e.target.value)} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="price" className="form-label">Product Price:</label>
                                        <input type="text" className="form-control" id="price" name='price' placeholder="Enter the Product Price" value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="desc" className="form-label">Product Description:</label>
                                        <textarea className="form-control" placeholder='Enter a Description for the Product' id="desc" name='desc' rows="3" value={productDesc}
                                            onChange={(e) => setProductDesc(e.target.value)}></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="categoryType" className="form-label">Product Type:</label>
                                        <select className="form-select" id="productType" name='productType' aria-label="Default select example" value={type} onChange={(e) => setType(e.target.value)}>
                                            <option value="" defaultValue disabled>Select the Product Type</option>
                                            <option value="Veg">Veg</option>
                                            <option value="Non Veg">Non Veg</option>
                                            <option value="Egg">Egg</option>
                                        </select>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="categoryType" className="form-label">Category Type:</label>
                                        <select className="form-select" id="categoryType" name='categoryType' aria-label="Default select example" value={category}
                                            onChange={(e) => setCategory(e.target.value)}>
                                            <option value="" defaultValue disabled>Select the Category Type</option>
                                            {data.map((categoryData) => (
                                                <option key={categoryData._id} value={categoryData.name}>
                                                    {categoryData.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary px-5 py-2">Add Product</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export default AddProduct;