import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../context/data/myContext";
import Layout from "../../../components/layout/Layout";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { store } from "../../../redux/store";
import { useAllFarmerProductsQuery, useDeleteProductMutation } from "../../../redux/api/productApi";
import { toast } from 'react-toastify';
import { productDetails } from '../../../assets/productDetails'
import { useGetFarmerOrderQuery } from "../../../redux/api/orderApi";
function DashboardTab() {
  const context = useContext(myContext);
  const user = store.getState().userReducer.user;
  const { data, isLoading } = useAllFarmerProductsQuery(user._id);
  const [orders, setOrders] = useState([]);
  const ordersQuery = useGetFarmerOrderQuery(user.farm);
  useEffect(() => {
    if (ordersQuery.data)
      setOrders(ordersQuery.data.orders);

  }, [ordersQuery.status]);
  const { mode, product, order } = context;
  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();
  function openModal() {
    setIsOpen(true);
  }
  const deleteHandler = async (id) => {
    const res = await deleteProduct({ productId: id, userId: user._id });
    if ("data" in res) {
      toast.success("Product Deleted successfully");
    }
  }
  const add = () => {
    navigate("/addproduct");
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="tab container mx-auto ">
          <Tabs defaultIndex={0} className=" ">
            <TabList className="md:flex md:space-x-8 bg-  grid grid-cols-2 text-center gap-4   md:justify-center mb-10 ">
              <Tab>
                <button
                  type="button"
                  className="mt-7 font-medium border-b-2 hover:shadow-green-700 border-green-500 text-green-500 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center bg-[#605d5d12] "
                >
                  <div className="flex gap-2 items-center">
                    <MdOutlineProductionQuantityLimits />
                    Products
                  </div>{" "}
                </button>
              </Tab>
              <Tab>
                <button
                  type="button"
                  className="mt-7 font-medium border-b-2 border-green-500 bg-[#605d5d12] text-green-500  hover:shadow-green-700  rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]    px-5 py-1.5 text-center "
                >
                  <div className="flex gap-2 items-center">
                    <AiFillShopping /> Order
                  </div>
                </button>
              </Tab>
              {/* <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 border-green-500 bg-[#605d5d12] text-green-500 rounded-lg text-xl  hover:shadow-green-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]   px-5 py-1.5 text-center "
                >
                  <div className="flex gap-2 items-center">
                    <FaUser /> Users
                  </div>
                </button>
              </Tab> */}
            </TabList>
            {/* product  */}
            <TabPanel>
              <div className="  px-4 md:px-0 mb-16">
                <h1
                  className=" text-center mb-5 text-3xl font-semibold underline"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Product Details
                </h1>
                <div className=" flex justify-end">
                  <button
                    onClick={add}
                    type="button"
                    className="focus:outline-none text-white bg-green-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] border hover:bg-green-700 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    {" "}
                    <div className="flex gap-2 items-center">
                      Add Product <FaCartPlus size={20} />
                    </div>
                  </button>
                </div>
                <div className="relative overflow-x-auto ">
                  <table className="w-full text-sm text-left text-green-500 dark:text-green-400  ">
                    <thead
                      className="text-xs border border-green-600 text-black uppercase bg-green-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]"
                      style={{
                        backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Photo
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Delete | Edit
                        </th>
                      </tr>
                    </thead>
                    {!isLoading && data.products.map((item, index) => {
                      const {
                        name,
                        price,
                        category,
                        stock,
                      } = item;
                      return (
                        <tbody className="">
                          <tr
                            className="bg-green-50 border-b  dark:border-green-700"
                            style={{
                              backgroundColor:
                                mode === "dark" ? "rgb(46 49 55)" : "",
                              color: mode === "dark" ? "white" : "",
                            }}
                          >
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {index + 1}.
                            </td>
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-black whitespace-nowrap"
                            >
                              <img className="w-16 h-16" src={productDetails[name].imageUrl} alt="img" />
                            </th>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {name}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              ₹{productDetails[name].price}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {productDetails[name].category}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {stock}
                            </td>
                            <td className="px-6 py-4">
                              <div className=" flex gap-2">
                                <div
                                  className=" flex gap-2 cursor-pointer text-black "
                                  style={{
                                    color: mode === "dark" ? "white" : "",
                                  }}
                                >
                                  <div onClick={() => deleteHandler(item._id)}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                      />
                                    </svg>
                                  </div>

                                  <Link to={`/updateproduct/${item._id}`}>
                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                        />
                                      </svg>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="relative overflow-x-auto mb-16">
                <h1
                  className=" text-center mb-5 text-3xl font-semibold underline"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Order Details
                </h1>
                {orders.length > 0 ?
                  (
                    <table className="w-full text-sm text-left text-green-500 dark:text-green-400">
                      <thead
                        className="text-xs text-black uppercase bg-green-200 "
                        style={{
                          backgroundColor:
                            mode === "dark" ? "rgb(46 49 55)" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                      >
                        <tr>
                        <th scope="col" className="px-6 py-3">
                            Products
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Order ID.
                          </th>
                          {/* <th scope="col" className="px-6 py-3">
                            Platform Fee
                          </th> */}
                          <th scope="col" className="px-6 py-3">
                            Earnings
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => {
                          console.log(order);
                          let earnings=0;
                          order.orderItems.map((item)=>{
                            const {quantity,price}=item;
                            const itemEarning=(0.75)*(price*quantity);
                            earnings+=itemEarning;
                            return item;
                          });
                          return (
                            <tr
                              className="bg-green-50 border-b  dark:border-green-700"
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "rgb(46 49 55)" : "",
                                color: mode === "dark" ? "white" : "",
                              }}
                            >
                              <td
                                className="px-6 py-4 text-black "
                                style={{
                                  color: mode === "dark" ? "white" : "",
                                }}
                              >
                                {order.orderItems.map(item => {
                                  return (
                                    <div className="flex items-center">
                                      <img class="ml-3 w-10 h-10 rounded-full"
                                        src={productDetails[item.name].imageUrl}
                                        alt="" />
                                      <p class="text-gray-900 whitespace-no-wrap ml-3">
                                        {item.name} ({item.quantity} kg)
                                      </p>
                                    </div>
                                  )
                                })}
                              </td>
                              <td
                                className="px-6 py-4 text-black "
                                style={{
                                  color: mode === "dark" ? "white" : "",
                                }}
                              >
                                {order.orderId}
                              </td>
                              <td
                                className="px-6 py-4 text-black "
                                style={{
                                  color: mode === "dark" ? "white" : "",
                                }}
                              >
                                ₹{earnings}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  ) :
                  (
                    <>
                    </>
                  )
                }
              </div>
            </TabPanel>

            <TabPanel>
              {/* <User addressInfo={addressInfo} setAddressInfo={setAddressInfo} setLoading={setLoading} /> */}
              <div className="relative overflow-x-auto mb-10">
                <h1
                  className=" text-center mb-5 text-3xl font-semibold underline"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  User Details
                </h1>
                <table className="w-full text-sm text-left text-green-500 dark:text-green-400">
                  <thead
                    className="text-xs text-black uppercase bg-green-200 "
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        S.No
                      </th>

                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Uid
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default DashboardTab;
