import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import { useSelector } from "react-redux";
import { useGetUserOrderQuery } from "../../redux/api/orderApi";
import { productDetails } from "../../assets/productDetails";
import { useNavigate } from "react-router-dom";
import { Modal } from "flowbite-react";
import Map from "../../pages/Map/Map";
function Order() {
  const { user } = useSelector((state) => state.userReducer);
  const { data, isLoading } = useGetUserOrderQuery(user._id);
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState('');
  const [showFullPath, setShowFullPath] = useState(false);
  useEffect(() => {
    if (data) setOrders(data.orders);
  }, [data]);
  return (
    <Layout>
      <div class="bg-white p-8 rounded-md w-full">
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Products
                  </th>
                  <th class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID.
                  </th>
                  <th class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order Creation Date
                  </th>
                  <th class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Grand Total
                  </th>
                  <th class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Track Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr>
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <div class="flex items-center">
                          {order.orderItems.map((item) => {
                            return (
                              <>
                                <img
                                  class="ml-3 w-10 h-10 rounded-full"
                                  src={productDetails[item.name].imageUrl}
                                  alt=""
                                />
                                <p class="text-gray-900 whitespace-no-wrap ml-3">
                                  {item.name} ({item.quantity} kg)
                                </p>
                              </>
                            );
                          })}
                        </div>
                      </td>
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap">
                          {order._id}
                        </p>
                      </td>
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap">
                          {order.date}
                        </p>
                      </td>
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap">
                          {order.totalPrice}
                        </p>
                      </td>

                      <td>
                        <button
                          className="cursor-pointer"
                          onClick={() => setOpenModal(order._id)}
                        >
                          <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span class="relative">Track Order</span>
                          </span>
                        </button>
                        <Modal
                          dismissible
                          show={openModal===order._id}
                          onClose={() => {setOpenModal(''),setShowFullPath(false)}}
                          size="xs"
                        >
                          <Modal.Body>
                            <Map orderID={order._id} showFullPath={showFullPath} />
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="m-2 cursor-pointer" onClick={() => setShowFullPath(false)}
                            >
                              <span className={`relative inline-block px-3 py-1 font-semibold text-white leading-tight`}>
                                <span
                                  aria-hidden
                                  className={`absolute inset-0 ${showFullPath?'bg-blue-600':'bg-blue-200'} rounded-full`}
                                ></span>
                                <span class="relative">Path</span>
                              </span>
                            </button>
                            <button
                              className="m-2 cursor-pointer"
                              onClick={() => setShowFullPath(true)}
                            >
                              <span className={`relative inline-block px-3 py-1 font-semibold text-white leading-tight`}>
                                <span
                                  aria-hidden
                                  class={`absolute inset-0 ${!showFullPath?'bg-green-600':'bg-green-200'} rounded-full`}
                                ></span>
                                <span class="relative">Visualise</span>
                              </span>
                            </button>
                            <button
                              className="m-2 cursor-pointer"
                              onClick={() => {setOpenModal(''),setShowFullPath(false)}}
                            >
                              <span class="relative inline-block px-3 py-1 font-semibold text-white leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-red-600 rounded-full"
                                ></span>
                                <span class="relative">Close</span>
                              </span>
                            </button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Order;