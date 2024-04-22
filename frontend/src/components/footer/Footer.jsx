import React, { useContext } from "react";
import myContext from "../../context/data/myContext";
import { Link } from "react-router-dom";

function Footer() {
  const context = useContext(myContext);
  const { mode } = context;
  return (
      <footer
        className="text-green-600 body-font bg-green-300 bottom-0"
        style={{
          backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <div
          className="bg-green-200"
          style={{
            backgroundColor: mode === "dark" ? "rgb(55 57 61)" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          <div className="container px-5 py-3 mx-auto flex items-center sm:flex-row flex-col">
            <Link to={"/"} className="flex">
              <div className="flex ">
                <h1
                  className=" text-2xl font-bold text-black  px-2 py-1 rounded"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Crop2Door
                </h1>
              </div>
            </Link>
            <p
              className="text-sm text-green-500 sm:ml-6 sm:mt-0 mt-4"
              style={{ color: mode === "dark" ? "white" : "" }}
            >
              © 2024 Crop2Door —
              <a
                href=""
                rel="noopener noreferrer"
                className="text-green-600 ml-1"
                target="_blank"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                www.crop2door.com
              </a>
            </p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
