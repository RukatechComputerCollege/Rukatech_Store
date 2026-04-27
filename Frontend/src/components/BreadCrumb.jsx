import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { RxCaretRight } from "react-icons/rx";

const BreadCrumb = () => {
  const location = useLocation();

  // Return null if on the homepage
  if (location.pathname === "/") return null;

  // Split the path into an array of path segments
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="w-full bg-[#F2F4F5] text-[#5F6C72]" style={{ padding: '10px 6%' }}>
      <div className="flex gap-4 items-center overflow-x-auto whitespace-nowrap">
        <NavLink to="/" className="hover:text-[#191C1F]">
          Home
        </NavLink>

        {pathnames.length > 0 && (
          pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <span key={to} className="flex items-center gap-4">
                <span><RxCaretRight /></span>
                {isLast ? (
                  <span className="text-[#2DA5F3] font-semibold capitalize">{decodeURIComponent(value)}</span>
                ) : (
                  <NavLink to={to} className="hover:text-[#191C1F] capitalize">{decodeURIComponent(value)}</NavLink>
                )}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BreadCrumb;
