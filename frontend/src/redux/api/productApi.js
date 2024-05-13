import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from 'axios';

export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_APP_SERVER}/api/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        newProduct: builder.mutation({
            query: ({ id, products }) => {
                return {
                    url: `new/?id=${id}`,
                    method: "POST",
                    body: products,

                }
            },
            invalidatesTags: ["product"]
        }),
        allFarmerProducts: builder.query({
            query: (id) => `allfarmerproducts?id=${id}`,
            providesTags: ["product"]
        }),
        allProducts: builder.mutation({
            query: ({ userCoordinates, userId }) => ({
                url: `/all?id=${userId}`,
                method:'POST',
                body: { userCoordinates }
            })
        }),
        updateProduct: builder.mutation({
            query: ({ product, userId }) => {
                return {
                    url: `${product._id}?id=${userId}`,
                    method: 'PUT',
                    body: product
                }
            },
            invalidatesTags: ["product"]
        }),
        deleteProduct: builder.mutation({
            query: ({ productId, userId }) => {
                return {
                    url: `${productId}?id=${userId}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ["product"]
        })

    })
});
export const getProduct = async (id) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_SERVER}/api/product/${id}`)
        return data;
    } catch (error) {
        return error;
    }
}
export const { useAllProductsMutation, useNewProductMutation, useAllFarmerProductsQuery, useUpdateProductMutation, useDeleteProductMutation } = productAPI