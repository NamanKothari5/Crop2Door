import React, { useContext, useEffect, useState } from "react";
import Filter from "../../components/filter/Filter";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { useAllProductsMutation } from "../../redux/api/productApi";
import { productDetails } from "../../assets/productDetails";
import { toast } from "react-toastify";

function Allproducts() {
  const context = useContext(myContext);
  const {
    mode
  } = context;
  const { user, loading } = useSelector(
    (state) => state.userReducer
  );

  const [getAllProducts] = useAllProductsMutation();
  const [allProductDetails, setAllProductsDetails] = useState({});
  const [productNameList, setProductNameList] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      if (user) {
        const res = await getAllProducts({ userId: user._id, userCoordinates: user.coordinates });
        if ("data" in res) {
          const products = res.data.products;
          setAllProductsDetails(products);
          setProductNameList(Object.keys(products));
        }
      }
    }
    fetchProducts();
  }, [user]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to Cart!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Filter />
      <section className="text-green-600 body-font">
        <div className="container px-5 py-8 md:py-16 mx-auto">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
              class="sm:text-3xl text-2xl font-medium title-font mb-2 text-green-900"
              style={{ color: mode === "dark" ? "white" : "" }}
            >
              Our Latest Collection
            </h1>
            <div class="h-1 w-20 bg-green-600 rounded"></div>
          </div>

          <div className="flex flex-wrap -m-4">
            {productNameList
              .map((item, index) => {
                const { quantity } = allProductDetails[item];
                const { imageUrl, price } = productDetails[item];

                return (
                  <div key={index} className="p-4 md:w-1/4  drop-shadow-lg ">
                    <div
                      className="h-full border-2 hover:shadow-green-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out    border-green-200 border-opacity-60 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <div
                        onClick={() =>
                          (window.location.href = `/productinfo?name=${item}&quantity=${quantity}`)
                        }
                        className="flex justify-center cursor-pointer"
                      >
                        <img
                          className=" rounded-2xl w-full h-80 p-2 hover:scale-110 transition-scale-110  duration-300 ease-in-out"
                          src={imageUrl}
                          alt="blog"
                        />
                      </div>
                      <div className="p-5 border-t-2 ">
                        <h1
                          className="title-font text-lg font-medium text-green-900 mb-3"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          {item}
                        </h1>
                        <p
                          className="leading-relaxed mb-3"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          ₹{price}
                        </p>
                        <div className=" flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              addCart({
                                ...productDetails[item],
                                name: item,
                                quantity: 50,
                              })
                            }
                            className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm w-full  py-2"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Allproducts;
