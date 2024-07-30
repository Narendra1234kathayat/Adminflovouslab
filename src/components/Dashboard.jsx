import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Axios from "axios";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBellConcierge,
  faUtensils,
  faList,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

const COLORS = [
  "#00C49F",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF007F",
  "#00C333",
  "#FF8C00",
  "#7FFF00",
  "#FF1493",
  "#8A2BE2",
  "#00FF7F",
  "#ADFF2F",
  "#20B2AA",
  "#FF6347",
  "#2E8B57",
  "#FFD700",
  "#DC143C",
  "#1E90FF",
  "#8B008B",
];

function Dashboard() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategories] = useState([]);
  const [user, setUsers] = useState([]);
  const [orignalproducts, setOriginalProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommendedOrders] = useState([]);
  const [topproducts, setTopProducts] = useState([]);

  const [type, setType] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const res = await Axios.get(
          "http://localhost:4000/api/admin_auth/verify"
        );
        if (res.data.status) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    handleVerify();
  }, [navigate]);

  useEffect(() => {
    Axios.get("http://localhost:4000/api/category/fetchcategory")
      .then((response) => {
        let vegCounter = 0;
        let nonVegCounter = 0;
        let eggCounter = 0;
        setCategories(response.data);

        response.data.forEach((item) => {
          if (item.type.toLowerCase() === "veg") {
            vegCounter++;
          } else if (item.type.toLowerCase() === "non veg") {
            nonVegCounter++;
          } else if (item.type.toLowerCase() === "egg") {
            eggCounter++;
          }
        });

        const newData = [
          { name: "Veg", value: vegCounter },
          { name: "Non-Veg", value: nonVegCounter },
          { name: "Egg", value: eggCounter },
        ];
        console.log("newdata", newData);

        setData(newData);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:4000/api/product/fetchproduct"
        );
        setOriginalProducts(response.data);
        console.log("product", response.data);

        if (response.data) {
          let vegcount = 0;
          let novegcount = 0;
          let eggcount = 0;
          const uniqueProducts = [];
          response.data.map((product) => {
            if (product.type.toLowerCase() === "veg") {
              vegcount++;
            }
            if (product.type.toLowerCase() === "non veg") {
              novegcount++;
            }
            if (product.type.toLowerCase() === "egg") {
              eggcount++;
            }
          });
          const typecount = [
            { name: "Veg", value: vegcount },
            { name: "Non-Veg", value: novegcount },
            { name: "Egg", value: eggcount },
          ];
          setType(typecount);
          console.log("typecount", typecount);

          // Iterate through each product
          response.data.forEach((product) => {
            // Check if product category already exists in uniqueProducts
            const existingIndex = uniqueProducts.findIndex(
              (p) => p.productcategory === product.productcategory
            );

            // If category doesn't exist, add it to uniqueProducts
            if (existingIndex === -1) {
              // console.log(product)
              uniqueProducts.push({ ...product, quantity: 1 });
            } else {
              // If category already exists, update quantity
              uniqueProducts[existingIndex].quantity += 1;
            }
          });

          // Create a new array with only productcategory and quantity
          const newArray = uniqueProducts.map((product) => ({
            productcategory: product.productcategory,
            quantity: product.quantity,
          }));

          setProducts(uniqueProducts);
          // console.log("Unique Products:", uniqueProducts);
          // console.log("New Array:", newArray);
        } else {
          console.log("Some error occurred");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await Axios.post(
          "http://localhost:4000/api/auth/getusers"
        );
        console.log("users", response.data);
        if (response.data) {
          // Process date to extract day and month
          const processedUsers = response.data.map((user) => ({
            ...user,
            day: new Date(user.date).getDate(), // Extract day
            month: new Date(user.date).getMonth() + 1, // Extract month (month starts from 0)
            monthYear: new Date(user.date).toLocaleString("default", {
              month: "long",
              year: "numeric",
            }), // Get month and year name
          }));
          setUsers(processedUsers);
        } else {
          console.log("Some error occurred");
        }
      } catch (error) {
        console.log(error);
      }
    };
    // fetchorder
    Axios.defaults.withCredentials = true;
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/api/orders/fetchallorders`
        );
        console.log("order", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchRecommended = async () => {
      try {
        const response = await Axios.post(
          "http://localhost:4000/api/product/fetchproducts/recommended"
        );
        console.log("recommended", response.data);
        setRecommendedOrders(response.data); // Assuming you have a function to set recommended orders
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    const topproducts = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:4000/api/product/topproduct"
        );
        console.log("topproducts", response.data);
        setTopProducts(response.data);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    topproducts();

    fetchRecommended();

    fetchOrders();

    fetchData();

    fetchProducts();
  }, []);
  // Assuming 'orders' is the array of orders fetched from the API
  // Calculate total price overall
  const totalPriceOverall = orders.reduce(
    (total, order) => total + order.totalprice,
    0
  );
  const totalproductprice = products.reduce(
    (totalPriceOverall, product) => totalPriceOverall + product.productprice,
    0
  );

  return (
    <>
      <section id="admins_bg">
        <section id="admin-content">
          <div className="container pe-md-5 pb-3">
            <div className="row">
              <div className="col-xl-10 col-12 ms-md-auto">
                {/* <div className='dashboard-link mb-4 fs-5'>
                  <ul className='d-flex dashboard pt-5 ps-0'>
                    <p className="text-dark">Dashboard ~ Visuals & Textual Analytics</p>
                  </ul>
                </div> */}
                <div className="row">
                  <div className="col-md-12 mt-5">
                    {/* Textual Data */}
                    <div className="row">
                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Categories</h5>
                            <h1 className="mb-0">
                              <FontAwesomeIcon
                                icon={faList}
                                className="fs-2"
                                style={{ color: "brown" }}
                              />{" "}
                              {category.length}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Menu Items</h5>
                            <h1 className="mb-0">
                              <FontAwesomeIcon
                                icon={faUtensils}
                                className="fs-2"
                                style={{ color: "brown" }}
                              />{" "}
                              {orignalproducts.length}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Menu Price</h5>
                            <h1 className="mb-0">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="fs-2"
                                style={{ color: "brown" }}
                              />{" "}
                              {totalproductprice}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <h1 className="mb-0">
                              <FontAwesomeIcon
                                icon={faUsers}
                                className="fs-2"
                                style={{ color: "brown" }}
                              />{" "}
                              {user.length}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Orders</h5>
                            <h1 className="mb-0">
                              <FontAwesomeIcon
                                icon={faBellConcierge}
                                className="fs-1"
                                style={{ color: "brown" }}
                              />{" "}
                              {orders.length}
                            </h1>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 pb-3">
                        <div className="card border-0 shadow rounded-4 text-center t_bg-color h-100">
                          <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <h1 className="mb-0">
                              <i
                                className="bx bx-rupee bx-tada"
                                style={{ color: "brown" }}
                              ></i>{" "}
                              {totalPriceOverall.toFixed(2)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row py-3">
                    <div className="col-12 text-center">
                      <h1 className="fw-semibold text-black-50">
                        Pie Chart{" "}
                        <i className="bx bxs-pie-chart-alt-2 bx-tada fs-2"></i>
                      </h1>
                    </div>
                    <div className="col-md-6 my-4">
                      <div className="pie-chart-container py-4 h-100">
                        <h5 className="mb-4 text-center">
                          Percentage Breakdown of{" "}
                          <span className="fw-bold text-primary">
                            Menu Items
                          </span>
                        </h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={type}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {type.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="col-md-6 my-4">
                      <div className="pie-chart-container py-4 h-100">
                        <h5 className="mb-4 text-center">
                          Percentage Breakdown of{" "}
                          <span className="fw-bold text-primary">
                            Menu Categories
                          </span>
                        </h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container mb-5">
                  <div className="row justify-content-center">
                    <div className="col-md-12">
                      <div className="card border-0 pie-chart-container">
                        <div className="card-body">
                          <h3 className="text-center">
                            Categories Distribution
                          </h3>
                          <p className="text-center">
                            Total Categories:{" "}
                            <span className="text-primary fw-bold">
                              {products.length}
                            </span>
                          </p>
                          <div style={{ height: "400px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={products}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={120}
                                  fill="#8884d8"
                                  dataKey="quantity"
                                  label={({ productcategory, percent }) =>
                                    `${productcategory} ${(
                                      percent * 100
                                    ).toFixed(0)}%`
                                  }
                                >
                                  {products.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container mb-5">
                  <div className="col-12 text-center pb-4">
                    <h1 className="fw-semibold text-black-50">
                      Bar Chart{" "}
                      <i className="bx bxs-bar-chart-alt-2 bx-tada fs-2"></i>
                    </h1>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-md-12">
                      <div className="card border-0 pie-chart-container pb-5">
                        <div className="card-body">
                          <div
                            className="col-md-12"
                            style={{ height: "400px" }}
                          >
                            <h3 className="text-center">
                              Number of Menu Items Under Each Category
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={products}>
                                <Bar dataKey="quantity" fill="orange" />
                                <Tooltip />
                                <XAxis dataKey="productcategory" />
                                <YAxis />
                                <Legend />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container mb-5">
                  <div className="row justify-content-center">
                    <div className="col-md-12">
                      <div className="card border-0 pie-chart-container pb-5">
                        <div className="card-body">
                          <div className="col-12" style={{ height: "400px" }}>
                            <h3 className="text-center mb-4">
                              Top 5 Most Selling Products and Their Total
                              Quantities
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={topproducts}>
                                <Bar dataKey="totalQuantity" fill="red" />
                                <Tooltip />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Legend />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <h3 className="text-center mb-4">
                    Top Recommended Category & Food Item
                  </h3>
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr className="table-secondary border-opacity-25">
                          <th scope="col">Category Name</th>
                          <th scope="col">Item Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommended.map((recomend, index) => (
                          <tr key={index}>
                            <td>{recomend.productcategory}</td>
                            <td>{recomend.productname}</td>
                            <td>{recomend.productdesc}</td>
                            <td>{recomend.productprice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default Dashboard;
