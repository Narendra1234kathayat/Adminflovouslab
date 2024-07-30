import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

function AddGallery() {

    const [altName, setAltName] = useState('');
    const [imgName, setImgName] = useState(null);

    // Navigate to dashboard

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    }

    // Backend Code

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!altName || !imgName) {
            alert("Kindly fill out all the fields.");
            return;
        }

        const formData = new FormData();
        formData.append('name', altName);
        formData.append('image', imgName);

        try {
            const response = await Axios.post(
                'http://localhost:4000/api/gallery/addgallery',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data) {
                alert("Image Saved Successfully!");
                setAltName('');
                setImgName(null);
                document.getElementById('uploadIimg').value = null;
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                                        &nbsp;<li className='text-color'>Add Gallery Image </li>
                                    </ul>
                                </div>
                                <form onSubmit={handleSubmit} className='bg-white p-5 shadow-lg rounded-3'>

                                    <div className="mb-4">
                                        <label htmlFor="uploadIimg" className="form-label">Select Image:</label>
                                        <input type="file" className="form-control" id="uploadIimg" name="uploadIimg" placeholder="Category Name" onChange={(e) => setImgName(e.target.files[0])} />
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="category" className="form-label">Image Alt Text: (Text is displayed in case the Image cannot be loaded)</label>
                                        <input type="text" className="form-control" id="category" name='category' value={altName} onChange={(e) => setAltName(e.target.value)} placeholder="Enter Alternative Text for the Image" />
                                    </div>

                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary px-5 py-2">Add Image</button>
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

export default AddGallery;