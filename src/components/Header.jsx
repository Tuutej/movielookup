import React from "react";
import MenuItem from "./MenuItem";
import { AiFillHome } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-3 max-w-6xl mx-auto">
      <div className="flex gap-4">
        <MenuItem title="home" address="/" Icon={AiFillHome}></MenuItem>
        <MenuItem
          title="about"
          address="/about"
          Icon={BsFillInfoCircleFill}
        ></MenuItem>
      </div>
      <div className="flex items-center gap-4">
        <Link href={"/"} className="flex gap-1 items-center">
          <div className="">
            <span className="text-2xl font-bold bg-red-800 py-1 px-2 rounded-lg">
              Bootleg IMDb
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
