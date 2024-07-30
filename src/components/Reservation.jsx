import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Reservation() {
    const [reservations, setReservations] = useState([]);
    const [reservationStatus, setReservationStatus] = useState({});
    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    }

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await Axios.get('http://localhost:4000/api/form/getreservation');
                const formattedReservations = response.data.map(reservation => ({
                    ...reservation,
                    fname: capitalizeFirstLetter(reservation.fname),
                    lname: capitalizeFirstLetter(reservation.lname)
                }));
                setReservations(formattedReservations);
                const initialStatus = {};
                formattedReservations.forEach(reservation => {
                    initialStatus[reservation._id] = '';
                });
                setReservationStatus(initialStatus);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservations();
    }, []);

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleReservation = async (id) => {
        try {
            if (!reservationStatus[id]) {
                alert("Please select a reservation status.");
                return;
            }

            const shouldUpdate = window.confirm("Are you sure you want to send the reservation status?");

            if (shouldUpdate) {
                await Axios.post('http://localhost:4000/api/form/updatereservation', { id, reserve: reservationStatus[id] });
                window.location.reload();

                // Data is clear after submitting
                setReservationStatus(prevStatus => ({
                    ...prevStatus,
                    [id]: ''
                }));
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const handleStatusChange = (id, value) => {
        setReservationStatus(prevStatus => ({
            ...prevStatus,
            [id]: value
        }));
    };

    const formatTime = (time) => {
        // Parse the time string
        const [hours, minutes] = time.split(':');
        // Convert hours to 12-hour format
        let formattedHours = parseInt(hours, 10) % 12;
        formattedHours = formattedHours === 0 ? 12 : formattedHours;
        // Determine AM/PM
        const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        // Return the formatted time string
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const getReservationStatusElement = (status, text) => {
        if (status === "accepted") {
            return <span style={{ color: "green", fontWeight: "700" }}>{text.charAt(0).toUpperCase()}{text.slice(1)}</span>;
        } else if (status === "rejected") {
            return <span style={{ color: "red", fontWeight: "700" }}>{text.charAt(0).toUpperCase()}{text.slice(1)}</span>;
        } else {
            return text;
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        const fullName = reservation.fname.toLowerCase() + ' ' + reservation.lname.toLowerCase();
        return fullName.includes(search.trim().toLowerCase());
    });

    return (
        <section id='admin_bg'>
            <section id='admin-content'>
                <div className='container pe-md-5 pb-3'>
                    <div className='row'>
                        <div className='col-xl-10 col-12 ms-md-auto'>

                            <div className='dashboard-link mb-5 fs-5'>
                                <ul className='d-flex dashboard pt-5 ps-0'>
                                    <li><button className='bg-none dash' onClick={handleDashboardClick}>Dashboard</button>&nbsp; / </li>
                                    &nbsp;<li className='text-color'>Customer Reservation</li>
                                </ul>
                            </div>

                            <div className="input-groups mb-4">
                                <input type="search" className="form-control shadow border-0 rounded-end-0 rounded-start-5" placeholder="Search by Customer Name" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <div className="input-group-btn">
                                    <button className="btn btn-primary rounded-end-5 rounded-start-0 shadow border-0" type="submit"><i className='bx bx-search bx-tada fs-3'></i></button>
                                </div>
                            </div>

                            {filteredReservations.length === 0 && <div className="alert alert-warning fw-bold" role="alert">No customer found!</div>}

                            {filteredReservations.map((reservation, index) => (
                                <div className="card mb-3 border-0 shadow" key={index}>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-primary">{getReservationStatusElement(reservation.reservation, reservation.fname)} {getReservationStatusElement(reservation.reservation, reservation.lname)}</h5>
                                        <p className="card-text"><strong>Date:</strong> {reservation.userDate}</p>
                                        <p className="card-text"><strong>Time:</strong> {formatTime(reservation.time)}</p>
                                        <p className="card-text"><strong>Email:</strong> {reservation.email}</p>
                                        <p className="card-text"><strong>Contact Number:</strong> {reservation.number}</p>

                                        {(reservation.reservation === "" ||
                                            reservation.reservation === "pending") ? (<div></div>) : (
                                            <p className="card-text fw-bold">Status: {getReservationStatusElement(reservation.reservation, reservation.reservation)}</p>)}

                                        {(reservation.reservation === "" ||
                                            reservation.reservation === "pending") && (
                                                <>
                                                    <select className="form-select mb-3" value={reservationStatus[reservation._id]} onChange={(e) => handleStatusChange(reservation._id, e.target.value)}>
                                                        <option value="" defaultValue disabled>Select Reservation Status</option>
                                                        <option value="accepted">Accept</option>
                                                        <option value="rejected">Reject</option>
                                                    </select>

                                                    <div className='text-center'>
                                                        <button type="submit" onClick={() => handleReservation(reservation._id)} className="btn btn-primary px-5">Submit</button>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Reservation;