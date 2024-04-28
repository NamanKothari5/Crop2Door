import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import { useSelector } from "react-redux";
import { useGetUserOrderQuery } from "../../redux/api/orderApi";
import { productDetails } from "../../assets/productDetails";
import { useNavigate } from "react-router-dom";

function Order() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const { data, isLoading } = useGetUserOrderQuery(user._id);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (data)
      setOrders(data.orders);
  }, [data])
  return (
    <Layout>
      <div class="bg-white p-8 rounded-md w-full">
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Products
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID.
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order Creation Date
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Grand Total
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                          {order.orderItems.map(item => {
                            return (
                              <>
                                <img class="ml-3 w-10 h-10 rounded-full"
                                  src={productDetails[item.name].imageUrl}
                                  alt="" />
                                <p class="text-gray-900 whitespace-no-wrap ml-3">
                                  {item.name} ({item.quantity} kg)
                                </p>
                              </>
                            )
                          })}

                        </div>
                      </td>
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap">{order._id}</p>
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
                      <td class="px-5 py-5 border-b border-green-200 bg-white text-sm">
                        <a href={`/order/${order._id}`} className="cursor-pointer">
                          <span
                            class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span aria-hidden
                              class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span class="relative">Track Order</span>
                          </span>
                        </a>
                      </td>
                      <button data-modal-target="extralarge-modal" data-modal-toggle="extralarge-modal" class="block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        Extra large modal
                      </button>

                      <div id="hs-full-screen-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
                        <div class="hs-overlay-open:mt-0 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-10 opacity-0 transition-all max-w-full max-h-full h-full">
                          <div class="flex flex-col bg-white pointer-events-auto max-w-full max-h-full h-full dark:bg-neutral-800">
                            <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                              <h3 class="font-bold text-gray-800 dark:text-white">
                                Modal title
                              </h3>
                              <button type="button" class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700" data-hs-overlay="#hs-full-screen-modal">
                                <span class="sr-only">Close</span>
                                <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M18 6 6 18"></path>
                                  <path d="m6 6 12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <div class="p-4 overflow-y-auto">
                              <p class="mt-1 text-gray-800 dark:text-neutral-400">
                                This is a wider card with supporting text below as a natural lead-in to additional content.
                              </p>
                            </div>
                            <div class="flex justify-end items-center gap-x-2 py-3 px-4 mt-auto border-t dark:border-neutral-700">
                              <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" data-hs-overlay="#hs-full-screen-modal">
                                Close
                              </button>
                              <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                Save changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </tr>
                  )
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
