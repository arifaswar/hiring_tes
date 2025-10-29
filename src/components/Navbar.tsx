import { useState, useRef, useEffect } from "react";
import type { NavbarProps } from "../type/type";


export const Navbar = ({ role }: NavbarProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpenMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const handleProfile = () => {
    if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/applicant";
    }
  };

  // Klik di luar dropdown → otomatis tertutup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm py-3 px-8 flex justify-between items-center relative top-0 z-10">
      {/* Left side */}
      <h1 className="font-semibold text-gray-800 text-lg select-none">
        {role === "admin" ? "JobList" : "Available Jobs"}
      </h1>

      {/* Profile Avatar */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="rounded-full bg-gray-200 w-9 h-9 flex items-center justify-center text-gray-600 font-semibold focus:outline-none"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        </button>

        {/* Dropdown Menu */}
        {openMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fade-in">
            <button
              onClick={handleProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
