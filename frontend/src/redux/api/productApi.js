import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from 'axios';



export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_APP_SERVER}/api/product/`,
    }),
    endpoints: (builder) => ({
        newProduct: builder.mutation({
            query: ({id,products}) => {
                console.log(id,products);
                return {
                    url: `new/?id=${id}`,
                    method: "POST",
                    body: products,
                }
            },
        }),
    })
});

export const { useNewProductMutation } = productAPI