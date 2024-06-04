import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout';
import { useSelector } from "react-redux";
import { useGetAdminOrdersQuery } from '../../redux/api/orderApi';

const AllOrders = () => {
  const { user } = useSelector((state) => state.userReducer);
  const { data, isLoading } = useGetAdminOrdersQuery(user._id);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data) setOrders(data.allOrders);
    console.log(data);
  }, [data]);

  const TableRows = ({ data }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <tr className="cursor-pointer">
          <td
            className={`px-5 py-5  bg-white text-sm`}
          >
            <svg
              className={`w-6 h-6 z-40 ${open ? "rotate-180" : "rotate-0"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => setOpen(!open)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </td>
          <td
            className={`px-5 py-5  bg-white text-sm`}
          >
            {data?.orderId}
          </td>
          <td
            className={`px-5 py-5  bg-white text-sm`}
          >
            {data?.paymentID}
          </td>
          <td
            className={`px-5 py-5  bg-white text-sm`}
          >
            {data?.adminRevenue}
          </td>
          
        </tr>
        <tr>
          <td colSpan={4} className="px-5 py-5  bg-white text-sm">
            <h1 className={`text-xl ${open ? "block" : "hidden"} text-center`}>Farmer's Split</h1>
          </td>
        </tr>
        <tr
          className={`w-full overflow-hidden transition-[max-height] delay-1000 duration-1000 ease-in-out ${open ? "max-h-20" : "max-h-0"}`}
        >
          <td colSpan={4}>
            <table
              className={`px-10 w-fit ${open ? "block" : "hidden"} mx-auto`}
            >
              <thead className="bg-green-100 text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-lg">
                <th className="py-3 px-4 text-left">Farmer's ID</th>
                <th className="py-3 px-4 text-left">Item Name</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Total</th>
              </thead>
              <tbody>
                {data?.orderDetails?.map((farmerData, key) => (
                  <tr key={key}>
                    <td className="py-3 border border-green-200 px-4">{farmerData?.farmUser}</td>
                    <td className="py-3 border border-green-200 px-4">{farmerData?.name}</td>
                    <td className="py-3 border border-green-200 px-4 text-center">{farmerData?.quantity}</td>
                    <td className="py-3 border border-green-200 px-4 text-center">
                      {farmerData?.quantity * farmerData?.price * 0.75}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </>
    );
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-md w-full">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead >
                <tr>
                  <th className='px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'></th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID.</th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID.</th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-green-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Revenue (25% split)</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((data, index) => (
                  <TableRows key={index} data={data} />
                ))}
                <tr>
                  <td colSpan={4} className="border-t"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
