import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart, updateCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { productDetails } from "../../assets/productDetails";
import { useNewOrderMutation } from "../../redux/api/orderApi";
function Cart() {
  const context = useContext(myContext);
  const { mode } = context;

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart);
  const {user}=useSelector((state)=>state.userReducer);
  const [newOrder]= useNewOrderMutation();

  const updateCartHandler = (item) => {
    dispatch(updateCart(item));
  }
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Delete cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const [totalAmout, setTotalAmount] = useState(0);

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price) * cartItem.quantity;
    });
    setTotalAmount(temp);
  }, [cartItems]);

  const shipping = parseInt(100);
  const grandTotal = (totalAmout >= 500 ? 0 : shipping) + totalAmout;
  // console.log(grandTotal)

  /**========================================================================
   *!                           Payment Intigration
   *========================================================================**/

  const buyNow = async () => {
    var options = {
      key: "rzp_test_uzZGM1K5pSN3tx",
      key_secret: "Oa92GRUpEAtwZkM9GANVsHLS",
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      order_receipt: "order_rcptid_" + user.name,
      name: "Crop2Door",
      description: "for testing purpose",
      handler: async function (response) {
        toast.success("Payment Successful");
        const paymentID = response.razorpay_payment_id;
        const res=await newOrder({id:user._id,paymentID,orderItems:cartItems});
        if ("data" in res) {
          toast.success("Order created successfully");
        }
      },
      theme: {
        color: "#027148",
      },
    };

    var pay = new window.Razorpay(options);
    pay.open();
    
    
  };
  return (
    <Layout>
      <div
        className="h-screen bg-green-100 pt-5 mb-[60%] "
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
          <div className="rounded-lg md:w-2/3 ">
            {cartItems.map((item, index) => {
              const price = item.price,
                description = item.description,
                imageUrl = item.imageUrl,
                quantity = item.quantity;

              return (
                <div
                  className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white p-6  sm:flex  sm:justify-start"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="product-image"
                    className="w-full rounded-lg sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2
                        className="text-lg font-bold text-green-900"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        {item.name}
                      </h2>
                      <h2
                        className="text-sm  text-green-900"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        {description}
                      </h2>
                      <p
                        className="mt-1 text-xs font-semibold text-green-700"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        ₹{price}
                      </p>
                      <p>
                        <label
                          for="quantity-input"
                          class="block mb-2 text-sm font-medium text-green-900 dark:text-white"
                        >
                          Choose quantity:
                        </label>
                        <div class="relative flex items-center max-w-[8rem]">
                          <button
                            type="button"
                            onClick={() => updateCartHandler({ ...item, quantity: Number(quantity) - 1 })}
                            id="decrement-button"
                            data-input-counter-decrement="quantity-input"
                            class="bg-green-100 dark:bg-green-700 dark:hover:bg-green-600 dark:border-green-600 hover:bg-green-200 border border-green-300 rounded-s-lg p-3 h-11 focus:ring-green-100 dark:focus:ring-green-700 focus:ring-2 focus:outline-none"
                          >
                            <svg
                              class="w-3 h-3 text-green-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 2"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            id="quantity-input"
                            data-input-counter
                            aria-describedby="helper-text-explanation"
                            class="bg-green-50 border-x-0 border-green-300 h-11 text-center text-green-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full py-2.5 dark:bg-green-700 dark:border-green-600 dark:placeholder-green-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            placeholder="Qty"
                            onChange={(e) => updateCartHandler({ ...item, quantity: e.target.value })}
                            min={100}
                            value={quantity}
                            required
                          />
                          <button
                            type="button"
                            id="increment-button"
                            data-input-counter-increment="quantity-input"
                            class="bg-green-100 dark:bg-green-700 dark:hover:bg-green-600 dark:border-green-600 hover:bg-green-200 border border-green-300 rounded-e-lg p-3 h-11 focus:ring-green-100 dark:focus:ring-green-700 focus:ring-2 focus:outline-none"
                            onClick={() => updateCartHandler({ ...item, quantity: Number(quantity) + 1 })}
                          >
                            <svg
                              class="w-3 h-3 text-green-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <p
                          id="helper-text-explanation"
                          class="mt-2 text-sm text-green-500 dark:text-green-400"
                        >
                          Please select a order quantity above 50.
                        </p>
                      </p>
                    </div>
                    <div
                      onClick={() => deleteCart(item)}
                      className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
              color: mode === "dark" ? "white" : "",
            }}
          >
            <div className="mb-2 flex justify-between">
              <p
                className="text-green-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Subtotal
              </p>
              <p
                className="text-green-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                ₹{totalAmout}
              </p>
            </div>
            <div className="flex justify-between">
              <p
                className="text-green-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Shipping
              </p>
              <p
                className="text-green-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                ₹{shipping}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p
                className="text-lg font-bold"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Total
              </p>
              <div className>
                <p
                  className="mb-1 text-lg font-bold"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  ₹{grandTotal}
                </p>
              </div>
            </div>
            {/* <Modal  /> */}
            <div className="  text-center rounded-lg text-white font-bold">
              <button
                type="button"
                onClick={buyNow}
                className="w-full  bg-green-600 py-2 text-center rounded-lg text-white font-bold "
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;