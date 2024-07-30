import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

function ShowGallery() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const modalRef = useRef(null); // Ref for modal element

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    useEffect(() => {
        Axios.get('http://localhost:4000/api/gallery/fetchgallary')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err); // Corrected variable name
                console.log(err);
            });
    }, []);

    const handleUpdate = (id) => {
        setSelectedItemId(id);
        setShowUpdateForm(true);
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm("Are you sure you want to delete this image?");
        if (!confirmed) return;

        setSelectedItemId(id);
        const response = await Axios.post(`http://localhost:4000/api/gallery/delete/${id}`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Image deleted successfully:', response.data);

        // Refresh the gallery data after updating
        Axios.get('http://localhost:4000/api/gallery/fetchgallary')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('image', newImage);
            formData.append('name', name);

            // Send a POST request to update the image
            const response = await Axios.post(`http://localhost:4000/api/gallery/updategallery/${selectedItemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Image updated successfully');
            console.log('Image updated successfully:', response.data);

            // Refresh the gallery data after updating
            Axios.get('http://localhost:4000/api/gallery/fetchgallary')
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    setError(err);
                    console.log(err);
                });

            // Clear form fields
            setName('');
            setNewImage(null);
            setShowUpdateForm(false);

            // Close the modal after successful update the image
            modalRef.current.click();
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    };

    return (
        <section id='admin_bg'>
            <section id='admin-content' className="container pe-md-5 pb-3">
                <div className='row'>
                    <div className='col-xl-10 col-12 ms-md-auto'>
                        <div className='dashboard-link mb-5 fs-5'>
                            <ul className='d-flex dashboard pt-5 ps-0'>
                                <li>
                                    <button className='bg-none dash' onClick={handleDashboardClick}>Dashboard</button>
                                    &nbsp; / &nbsp;
                                </li>
                                <li className='text-color'>Gallery</li>
                            </ul>
                        </div>
                        
                        <div className='row'>
                            {data.map((d, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div className="card h-100 shadow-lg">
                                        <img src={`http://localhost:4000/Multer/${d.image}`} className='card-img-top' alt={d.name} style={{ height: "220px" }} />
                                        <div className="card-body mt-2">
                                            <p className="card-title"><strong>Image Alt Name:</strong> {d.name}</p>
                                            <div className='text-center py-2'>
                                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleUpdate(d._id)} className="btn btn-warning me-2"><FontAwesomeIcon icon={faPenToSquare} /></button>
                                                <button type="button" onClick={() => handleDelete(d._id)} className="btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Image</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">Alt Name:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    value={name}
                                                    placeholder='Enter alternative text for the image'
                                                    onChange={handleNameChange}
                                                    required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">Select Image:</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="image"
                                                    accept="image/*"
                                                    onChange={(e) => setNewImage(e.target.files[0])}
                                                    required />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" ref={modalRef}>Close</button>
                                                <button type="submit" className="btn btn-primary">Update Image</button>
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
    );
}

export default ShowGallery;
