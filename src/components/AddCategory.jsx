import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

function AddCategory() {

    // Backend code

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !type || !image) {
            alert("Kindly fill out all the fields.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('image', image);

        Axios
            .post("http://localhost:4000/api/category/addcategory", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                if (res.data) {
                    alert("Category added successfully");
                    setName('');
                    setType('');
                    setImage(null);
                    document.getElementById('uploadIimg').value = null;
                } else {
                    console.log("Some error occurred");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Navigate to dashboard

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
                                        &nbsp;<li className='text-color'>Add Category</li>
                                    </ul>
                                </div>
                                <form onSubmit={handleSubmit} className='bg-white p-5 shadow-lg rounded-3'>
                                    <div className="mb-4">
                                        <label htmlFor="category" className="form-label">Category Name:</label>
                                        <input type="text" className="form-control" id="category" name='category' placeholder="Enter the Category Name" value={name} onChange={handleNameChange} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="categoryType" className="form-label">Category Type:</label>
                                        <select className="form-select" id="categoryType" name='categoryType' aria-label="Default select example" value={type} onChange={handleTypeChange}>
                                            <option value="" defaultValue disabled>Select the Category Type</option>
                                            <option value="Veg">Veg</option>
                                            <option value="Non Veg">Non Veg</option>
                                            <option value="Egg">Egg</option>
                                        </select>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="uploadIimg" className="form-label">Upload Image:</label>
                                        <input type="file" className="form-control" id="uploadIimg" name="uploadIimg"  accept="image/*" onChange={handleImageChange} />
                                    </div>

                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary px-5 py-2">Add Category</button>
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

export default AddCategory;