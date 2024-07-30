import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Order() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [noUserFound, setNoUserFound] = useState(false);

    useEffect(() => {
        Axios.defaults.withCredentials = true;
        const fetchOrders = async () => {
            try {
                const response = await Axios.get(
                    `http://localhost:4000/api/orders/fetchallorders`
                );
                // console.log(response);
                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const filter = orders.filter((data) =>
            data.userName.toLowerCase().includes(search.toLowerCase()) ||
            data.orderproducts.some(product => product.productname.toLowerCase().includes(search.toLowerCase()))
        );

        setFilteredOrders(filter);
        setNoUserFound(filter.length === 0);

    }, [search, orders]);

    const handleSearch = (val) => {
        setSearch(val);
    };

    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/');
    };

    const exportToExcel = () => {
        const dataToExport = filteredOrders.map(order => {
            return {
                "Table Number": order.tableNumber,
                "Food Item": order.orderproducts.map(product => product.productname).join(", "),
                "Price (per item)": order.orderproducts.map(product => product.productprice).join(", "),
                "Quantity": order.orderproducts.map(product => product.quantity).join(", "),
                "Total Price": order.totalprice,
                "Customer Name": order.userName
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, "orders.xlsx");
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
                                        &nbsp;<li className='text-color'>Orders</li>
                                    </ul>
                                </div>

                                <div className="mb-4 d-md-flex">
                                    <div className="col-md-10">
                                        <div className="input-groups">
                                            <input type="search" className="form-control shadow border-0 rounded-end-0 rounded-start-5" placeholder="Search by Customer Name" name="search" value={search} onChange={(e) => handleSearch(e.target.value)} />
                                            <div className="input-group-btn">
                                                <button className="btn btn-primary rounded-end-5 rounded-start-0 shadow border-0" type="submit"><i className='bx bx-search bx-tada fs-3'></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 d-flex justify-content-md-end mt-md-0 mt-2">
                                        <button type="button" className="btn btn-success px-4" onClick={exportToExcel}>Export Data</button>
                                    </div>
                                </div>

                                {noUserFound ? (
                                    <div className="alert alert-warning fw-bold" role="alert">
                                        No customer found
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered mt-4">
                                            <thead>
                                                <tr className="table-secondary border-opacity-25">
                                                    <th scope="col">Table Number</th>
                                                    <th scope="col">Food Item</th>
                                                    <th scope="col">Price (per item)</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Total Price</th>
                                                    <th scope="col">Customer Name</th>
                                                    <th scope="col">Date & Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order, orderIndex) => (
                                                    <tr key={orderIndex}>

                                                        <td className="fw-bold text-center fs-3">{order.tableNumber}</td>

                                                        <td>
                                                            {order.orderproducts.map((product, productIndex) => (
                                                                <div key={productIndex}>{productIndex + 1}. {product.productname}</div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            {order.orderproducts.map((product, index) => (
                                                                <div key={index}>{product.productprice}</div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            {order.orderproducts.map((product, index) => (
                                                                <div key={index}>{product.quantity}</div>
                                                            ))}
                                                        </td>
                                                        <td><strong>{order.totalprice}</strong></td>
                                                        <td>{order.userName}</td>
                                                        <td>{new Date(order.date).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: '2-digit',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true
                                                        })}</td>

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
        </>
    );
}

export default Order;