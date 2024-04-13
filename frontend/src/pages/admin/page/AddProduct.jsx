import React, { useContext, useState } from "react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
function AddProduct() {
  const context = useContext(myContext);
  const navigate = useNavigate();
  const [newProduct] = useNewProductMutation();
  
  const { user } = useSelector(
    (state) =>
      state.userReducer
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    name: null,
    price: null,
    category: null,
    description: null,
    stock: null,
    id: ''
  });
  const addProduct = async () => {
    if (products.name == null || products.price == null || products.category == null || products.description == null || products.stock == null) {
      return toast.error("all fields are required")
    }

    setLoading(true);
    const res = await newProduct({ id: user._id, products });

    if ("data" in res) {
      toast.success("Add product successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
      setLoading(false);
    }
  }
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className=" bg-green-800 px-10 py-10 rounded-xl ">
          <div className="">
            <h1 className="text-center text-white text-xl mb-4 font-bold">
              Add Product
            </h1>
          </div>
          <div>
            <input
              type="text"
              value={products.name}
              onChange={(e) =>
                setProducts({ ...products, name: e.target.value })
              }
              name="title"
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product title"
            />
          </div>
          <div>
            <input
              type="number"
              value={products.price}
              onChange={(e) =>
                setProducts({ ...products, price: e.target.value })
              }
              name="price"
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product price"
            />
          </div>
          <div>
            <input
              type="number"
              value={products.stock}
              onChange={(e) =>
                setProducts({ ...products, stock: e.target.value })
              }
              name="price"
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product stock"
            />
          </div>
          {/* <div>
            <input
              type="file"
              value={products.photo}
              onChange={(e) =>
                setProducts({ ...products, photo: e.target.files[0] })
              }
              name="imageurl"
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product Photo"
            />
          </div> */}
          <div>
            <input
              type="text"
              value={products.category}
              onChange={(e) =>
                setProducts({ ...products, category: e.target.value })
              }
              name="category"
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product category"
            />
          </div>
          <div>
            <textarea
              cols="30"
              rows="10"
              name="title"
              value={products.description}
              onChange={(e) =>
                setProducts({ ...products, description: e.target.value })
              }
              className=" bg-green-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-green-200 outline-none"
              placeholder="Product desc"
            ></textarea>
          </div>
          <div className=" flex justify-center mb-3">
            <button
              onClick={addProduct}
              className=" bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
