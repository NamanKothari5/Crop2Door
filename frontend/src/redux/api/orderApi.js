import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const orderAPI = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_APP_SERVER}/api/order/`,
    }),
    endpoints: (builder) => ({
        newOrder: builder.mutation({
            query: ({ id, orderItems,paymentID }) => {
                return {
                    url: `new/?id=${id}`,
                    method: "POST",
                    body: {orderItems,paymentID},
                }
            },
        })
    })
});

export const { useNewOrderMutation } = orderAPI