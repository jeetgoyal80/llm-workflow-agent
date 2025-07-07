import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log("user",user);
  
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  const alwaysVisibleLinks = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/app" },
  ];

  const authLinks = [
    { label: "Reminders", to: "/reminders" },
    { label: "ToDos", to: "/todos" },
    { label: "Contacts", to: "/contacts" },
    { label: "Settings", to: "/settings" },
  ];

  const allLinks = [...alwaysVisibleLinks, ...(user ? authLinks : [])];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-purple-400 hover:text-purple-500"
        >
          TaskMate
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-6 items-center">
          {allLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-purple-400 transition ${
                location.pathname === link.to
                  ? "text-purple-500 font-semibold"
                  : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="sm:hidden text-white text-xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="sm:hidden bg-black/90 px-4 py-2 space-y-2"
          >
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-2 py-1 rounded hover:bg-purple-700 transition ${
                  location.pathname === link.to
                    ? "text-purple-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-1 text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow text-center"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
