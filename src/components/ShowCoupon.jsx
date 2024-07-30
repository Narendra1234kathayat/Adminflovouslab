import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ShowCoupon() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(
                    "http://localhost:4000/api/coupon/fetchcoupon"
                );
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    console.log("Error fetching coupons");
                }
            } catch (error) {
                console.log("Error:", error.message);
                setError(error.message);
            }
        };
        fetchData();
    }, []);

    const handledelete = async (id) => {

        const confirmed = window.confirm("Are you sure you want to delete this coupon?");
        if (!confirmed) return;

        try {
            console.log(id);
            const response = await Axios.post(
                `http://localhost:4000/api/coupon/deletecoupon`,
                { id }
            );
            console.log(response.data.success);
            if (response.data.success) {
                try {
                    const response = await Axios.get(
                        "http://localhost:4000/api/coupon/fetchcoupon"
                    );
                    if (response.status === 200) {
                        setData(response.data);
                    } else {
                        console.log("Error fetching coupons");
                    }
                } catch (error) {
                    console.log("Error:", error.message);
                    setError(error.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
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
                                        &nbsp;<li className='text-color'>Coupon</li>
                                    </ul>
                                </div>
                                <div className="row">
                                    {error ? (
                                        <div className="col-lg-4 ">
                                            <p> <div className="fw-bold text-danger"> no coupon found</div></p>
                                        </div>
                                    ) : data.length > 0 ? (
                                        data.map((coupon, index) => (
                                            <div className="col-lg-4 mb-4" key={index}>
                                                <div className="shadow-lg rounded-4 p-4">
                                                    <p><strong>{index + 1}. Coupon:</strong> {coupon.percentoff}%</p>
                                                    <p><strong>Coupon code:</strong> {coupon.couponcode}</p>
                                                    <p><strong>Coupon starting:</strong> {`${formatDate(coupon.startingdate)}`}</p>
                                                    <p><strong>Coupon expiry:</strong> {`${formatDate(coupon.expirydate)}`}</p>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handledelete(coupon._id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-lg-4">
                                            <p>No coupons available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

        </>
    );
}

export default ShowCoupon;