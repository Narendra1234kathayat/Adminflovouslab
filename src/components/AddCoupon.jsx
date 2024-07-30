import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCoupon() {

    const [percent, setPercent] = useState("");
    const [code, setCode] = useState("");
    const [sdate, setSdate] = useState("");
    const [edate, setEdate] = useState("");
    const [dataDisplay, setDataDisplay] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:4000/api/coupon/addcoupon', {
                percentoff: percent,
                couponcode: code,
                startingdate: sdate,
                expirydate: edate
            });
            console.log(response)
            if (response.status === 200) {
                setDataDisplay(response.data);
                alert("upload success");
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                                        &nbsp;<li className='text-color'>Add Coupon</li>
                                    </ul>
                                </div>
                                <form onSubmit={handleSubmit} className='bg-white p-5 shadow-lg rounded-3'>

                                    <div className="mb-4">
                                        <label htmlFor="percent" className="form-label">percentoff:</label>
                                        <input type="number" className="form-control" id="percent" name='percent' placeholder="Enter the percent" value={percent} onChange={(e) => setPercent(e.target.value)} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="code" className="form-label">couponcode:</label>
                                        <input type="text" className="form-control" id="code" name='code' placeholder="Enter the couponcode" value={code} onChange={(e) => setCode(e.target.value)} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="sdate" className="form-label">startingdate:</label>
                                        <input type="date" className="form-control" id="sdate" name='sdate' placeholder="Enter the Category Name" value={sdate} onChange={(e) => setSdate(e.target.value)} />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="edate" className="form-label">expirydate:</label>
                                        <input type="date" className="form-control" id="edate" name='edate' placeholder="Enter the Category Name" value={edate} onChange={(e) => setEdate(e.target.value)} />
                                    </div>

                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary px-5 py-2">Add Coupon</button>
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

export default AddCoupon;
