import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProduct, useUpdateProductMutation } from "../../../redux/api/productApi";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { productDetails } from "../../../assets/productDetails";
function UpdateProduct() {
  const { user } = useSelector(
    (state) =>
      state.userReducer
  );

  const productList = Object.keys(productDetails)

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stock, setStock] = useState(null);
  const navigate = useNavigate();
  const [update] = useUpdateProductMutation();
  const { id } = useParams();
  useEffect(() => {
    async function getPreviousProduct() {
      const res = await getProduct(id);
      setName(res.product.name);
      setStock(res.product.stock);
    }
    getPreviousProduct();
  }, [])
  const updateProduct = async () => {
    if (!name || !stock) {
      return toast.error("all fields are required")
    }

    setLoading(true);
    const res = await update({ userId: user._id, product: { name, stock, _id: id } });

    if ("data" in res) {
      toast.success("Product Update successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
      setLoading(false);
    }
  }
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (name.length > 0)
        setShowSuggestions(true);
      else
        setShowSuggestions(false);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [name]);

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setShowSuggestions(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Add Product</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative py-2">
                  <input
                    autoComplete="off"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600"
                    placeholder="Product Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Product Name
                  </label>
                  {showSuggestions && (
                    <ul className="absolute z-10 left-0 w-full bg-white border border-gray-300 shadow-lg mt-1 rounded-b-lg">
                      {productList
                        .filter((suggestion) =>
                          suggestion.toLowerCase().includes(name.toLowerCase())
                        )
                        .map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <div className="relative py-2">
                  <input
                    autoComplete="off"
                    id="stock"
                    name="stock"
                    type="number"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                  <label
                    htmlFor="stock"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Stock
                  </label>
                </div>
                <div className="relative py-2">
                  <button onClick={updateProduct} class="before:ease relative h-12 w-40 overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-green-500 hover:before:-translate-x-40">
                    <span relative="relative z-10">Update Product</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="flex justify-center items-center h-screen">
    //     <div className=" bg-green-800 px-10 py-10 rounded-xl ">
    //       <div className="">
    //         <h1 className="text-center text-white text-xl mb-4 font-bold">
    //           Update Product
    //         </h1>
    //       </div>
    //       <div>
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) =>
    //             setName(e.target.value)
    //           }
    //           name="title"
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product title"
    //         />
    //       </div>
    //       {/* <div>
    //         <input
    //           type="number"
    //           value={products.price}
    //           onChange={(e) =>
    //             setProducts({ ...products, price: e.target.value })
    //           }
    //           name="price"
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product price"
    //         />
    //       </div> */}
    //       <div>
    //         <input
    //           type="number"
    //           value={stock}
    //           onChange={(e) =>
    //             setStock(e.target.value)
    //           }
    //           name="price"
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product stock"
    //         />
    //       </div>
    //       {/* <div>
    //         <input
    //           type="file"
    //           value={products.photo}
    //           onChange={(e) =>
    //             setProducts({ ...products, photo: e.target.files[0] })
    //           }
    //           name="imageurl"
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product Photo"
    //         />
    //       </div> */}
    //       {/* <div>
    //         <input
    //           type="text"
    //           value={products.category}
    //           onChange={(e) =>
    //             setProducts({ ...products, category: e.target.value })
    //           }
    //           name="category"
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product category"
    //         />
    //       </div>
    //       <div>
    //         <textarea
    //           cols="30"
    //           rows="10"
    //           name="title"
    //           value={products.description}
    //           onChange={(e) =>
    //             setProducts({ ...products, description: e.target.value })
    //           }
    //           className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
    //           placeholder="Product desc"
    //         ></textarea>
    //       </div> */}
    //       <div className=" flex justify-center mb-3">
    //         <button
    //           onClick={updateProduct}
    //           className=" bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg"
    //         >
    //           Update Product
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default UpdateProduct;
