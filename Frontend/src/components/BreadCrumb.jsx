import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx";

const BreadCrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Return null if on the homepage
  if (location.pathname === "/") return null;

  // Split the path into an array of path segments
  const pathnames = location.pathname.split("/").filter((x) => x);

  const handleNavigate = (path) => {
    navigate(path, { replace: false });
  };

  return (
    <div
      className="w-full bg-[#F2F4F5] text-[#5F6C72]"
      style={{ padding: "10px 6%" }}
    >
      <div className="flex gap-4 items-center overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => handleNavigate("/")}
          className="hover:text-[#191C1F] bg-transparent border-none cursor-pointer p-0"
        >
          Home
        </button>

        {pathnames.length > 0 &&
          pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <span key={index} className="flex items-center gap-4">
                <span>
                  <RxCaretRight />
                </span>
                {isLast ? (
                  <span className="text-[#2DA5F3] font-semibold capitalize">
                    {decodeURIComponent(value)}
                  </span>
                ) : (
                  <button
                    onClick={() => handleNavigate(to)}
                    className="hover:text-[#191C1F] capitalize bg-transparent border-none cursor-pointer p-0"
                  >
                    {decodeURIComponent(value)}
                  </button>
                )}
              </span>
            );
          })}
      </div>
    </div>
  );
};

export default BreadCrumb;
