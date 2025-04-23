import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen px-2 mt-1 items-center bg-blue-400 h-10 flex justify-between">
      <Link to={"/"}>
        <p>Routiner</p>
      </Link>
      <Link to={"/professors"}>
        <p>Professor?</p>
      </Link>
    </div>
  );
}
