import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const orderAPI = createApi({
    reducerPath: "orderApi",
    tagTypes: ["order"],
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_APP_SERVER}/api/order/`,
    }),
    endpoints: (builder) => ({
        newOrder: builder.mutation({
            query: ({ id, orderItems, paymentID }) => {
                return {
                    url: `new/?id=${id}`,
                    method: "POST",
                    body: { orderItems, paymentID },
                }
            },
            invalidatesTags: ["order"]
        }),
        getUserOrder: builder.query({
            query: (id) => `my?id=${id}`,
            providesTags: ["order"]
        }),
        getFarmerOrder: builder.query({
            query: (id) => `allOrders/${id}`,
            providesTags: ["order"]
        }),
        getAdminOrders: builder.query({
            query: (id) => `adminOrders/?id=${id}`
        }),
        getPath: builder.query({
            query: (id) => `${id}`
        })
    })
});

export const { useNewOrderMutation, useGetFarmerOrderQuery, useGetAdminOrdersQuery, useGetUserOrderQuery, useGetPathQuery } = orderAPI