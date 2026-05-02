import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckCircle2, Settings, ChevronDown } from "lucide-react";

const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user.displayName || user.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-surface-container py-3 px-6 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <CheckCircle2 className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold font-heading text-primary">
            Master To Do
          </h1>
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 hover:bg-surface-container-low px-2 py-1.5 rounded-2xl transition-all"
          >
            <span className="text-sm font-semibold text-on-surface hidden sm:block max-w-[140px] truncate">
              {displayName}
            </span>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-pink-100 border-2 border-pink-200 shrink-0 transition-all">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-pink-600 font-bold text-sm">
                  {initial}
                </span>
              )}
            </div>

            <ChevronDown
              className={`w-4 h-4 text-outline transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-surface-container py-2 animate-fade-in z-50">
              {/* Greeting */}
              <div className="px-4 py-3 border-b border-surface-container">
                <p className="text-xs font-bold text-outline uppercase tracking-widest">
                  Xin chào
                </p>
                <p className="text-sm font-bold text-on-surface mt-0.5 truncate">
                  {displayName} 👋
                </p>
                <p className="text-xs text-outline mt-0.5 truncate">
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Settings className="w-4 h-4 text-outline" />
                  Cài đặt tài khoản
                </button>

                <div className="mx-3 my-1 border-t border-surface-container"></div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-error-container/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
