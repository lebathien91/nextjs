import React from "react";
import BackToTop from "./BackToTop";

const Footer = () => {
  return (
    <footer className="bg-[#4d626e] py-5 border-b-4 border-[#ffbe02] text-white">
      <div className="container md:flex md:justify-between">
        <p className="text-center mb-4 md:mb-0">
          Copyright © 2021 by{" "}
          <a href="#" className="text-[#ffbe02] font-bold">
            Kủ Chuối
          </a>
        </p>
        <ul className="flex justify-center">
          <li className="ml-4">
            <a href="#">Home</a>
          </li>
          <li className="ml-4">
            <a href="#">About</a>
          </li>
          <li className="ml-4">
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>
      <BackToTop />
    </footer>
  );
};

export default Footer;
