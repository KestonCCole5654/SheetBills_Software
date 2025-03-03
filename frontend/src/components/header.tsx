import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth(); // Use our custom useAuth hook
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b font-poppins border-gray-200">
      <div className="container mx-auto px-10 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link to="/" className="text-green-600 font-extrabold text-2xl">
            SheetBills
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link to="/invoices" className="text-gray-800 hover:text-green-600 hover:font-semibold font-normal">
            Invoices
          </Link>
          <Link to="/customers" className="text-gray-800 hover:text-green-600 hover:font-semibold font-normal">
            Customers
          </Link>
          <Link to="/integration" className="text-gray-800 hover:text-green-600 hover:font-semibold font-normal">
            Google Sheets Integration
          </Link>
          <Link to="/terms" className="text-gray-800 hover:text-green-600 hover:font-semibold font-normal">
            Terms & Privacy
          </Link>
        </nav>
        <div className="flex flex-row items-center relative">
          {isAuthenticated ? (
            // Dropdown for user profile and logout
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-green-500"
              >
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || 'User profile'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Display login and register buttons
            <>
              <Link
                to="/register"
                className="p-3 border border-green-600 bg-green-600 text-white hover:font-semibold font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-green-600 font-medium p-3 border-2 border-green-600 hover:text-green-600 hover:font-semibold ml-3"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
