import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/cartSlice";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { useSearchParams } from "react-router-dom";
import { productDetails } from "../../assets/productDetails";

function ProductInfo() {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [products, setProducts] = useState("");
  const params = useParams();

  const [searchParams]=useSearchParams();
  const productName=searchParams.get('name');
  const stock=searchParams.get('quantity');

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  

  // add to cart
  const addCart = (products) => {
    console.log(products);
    dispatch(addToCart(products));
    toast.success("add to cart");
  };

  return (
    <Layout>
      <section className="text-green-600 body-font overflow-hidden">
        <div className="container px-5 py-10 mx-auto min-h-screen">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <img
                alt="ecommerce"
                className="w-40 h-40 lg:h-auto  object-cover object-center rounded"
                src={productDetails[productName].imageUrl}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h1 className="text-green-900 text-3xl title-font font-medium mb-1">
                  {productDetails[productName].name}
                </h1>
                <p className="leading-relaxed border-b-2 mb-5 pb-5">
                  {productDetails[productName].description}
                </p>

                <div className="flex">
                  <span className="title-font font-medium text-2xl text-green-900">
                    1kg @₹{productDetails[productName].price}
                  </span>
                  <button
                    onClick={() =>
                      addCart({
                        ...productDetails[productName],
                        name: productName,
                        quantity: 50,
                      })
                    }
                    className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                  >
                    Add To Cart
                  </button>
                  <button className="rounded-full w-10 h-10 bg-green-200 p-0 border-0 inline-flex items-center justify-center text-green-500 ml-4">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
        </div>
      </section>
    </Layout>
  );
}

export default ProductInfo;
