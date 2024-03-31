import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from 'axios';

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_SERVER}/api/user/`,
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => ({
                url: "login",
                method: "POST",
                body: user,
            }),
        }),
    })
});

export const getUser=async(id)=>{
    try {
        const {data}=await axios.get(`${process.env.REACT_APP_SERVER}/api/user/${id}`)
        return data;
    } catch (error) {
        return error;
    }
}

export const { useLoginMutation } = userAPI