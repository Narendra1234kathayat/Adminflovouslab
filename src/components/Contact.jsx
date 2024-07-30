import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

function Contact() {
    const [contact, setContact] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredContacts, setFilteredContacts] = useState([]);

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Axios.get("http://localhost:4000/api/form/fetchcontact");
                console.log(res.data);
                if (res.data) {
                    setContact(res.data);
                } else {
                    console.error("No data received from server");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter contacts based on search query
        const filtered = contact.filter((item) => {
            const fullName = `${item.first_name} ${item.last_name}`;
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredContacts(filtered);
    }, [searchQuery, contact]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <section id='admin_bg'>
            <section id='admin-content'>
                <div className='container pe-md-5 pb-3'>
                    <div className='row'>
                        <div className='col-xl-10 col-12 ms-md-auto'>

                            <div className='dashboard-link mb-5 fs-5'>
                                <ul className='d-flex dashboard pt-5 ps-0'>
                                    <li><button className='bg-none dash' onClick={handleDashboardClick}>Dashboard</button>&nbsp; / </li>
                                    &nbsp;<li className='text-color'>Contact ~ Feedback or Review</li>
                                </ul>
                            </div>

                            <div className="input-groups mb-4">
                                <input type="search" className="form-control shadow border-0 rounded-end-0 rounded-start-5" placeholder="Search by User Name" name="search" onChange={handleSearchChange} />
                                <div className="input-group-btn">
                                    <button className="btn btn-primary rounded-end-5 rounded-start-0 shadow border-0" type="submit"><i className='bx bx-search bx-tada fs-3'></i></button>
                                </div>
                            </div>

                            {filteredContacts.length === 0 && (
                                <div className="alert alert-warning fw-bold mt-4" role="alert">
                                    No User Found!
                                </div>
                            )}

                            {filteredContacts.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="table-secondary">
                                                <th scope="col">First Name</th>
                                                <th scope="col">Last Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Number</th>
                                                <th scope="col">Feedback & Review</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredContacts.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.first_name}</td>
                                                    <td>{item.last_name}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.number}</td>
                                                    <td>{item.comment}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Contact;
