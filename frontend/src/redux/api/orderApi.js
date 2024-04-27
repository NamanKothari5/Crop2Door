import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const orderAPI = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_APP_SERVER}/api/order/`,
    }),
    endpoints: (builder) => ({
        newProduct: builder.mutation({
            query: ({ id, orderItems }) => {
                return {
                    url: `new/?id=${id}`,
                    method: "POST",
                    body: orderItems,
                }
            },
        })
    })
});

export const { useNewProductMutation } = orderAPI