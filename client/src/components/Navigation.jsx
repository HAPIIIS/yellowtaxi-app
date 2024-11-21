import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    if (path.includes('/#')) {
      const elementId = path.split('/#')[1];
      const element = document.getElementById(elementId);
      
      if (element) {
        if (location.pathname === '/') {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/', { 
            state: { 
              scrollTo: elementId 
            } 
          });
        }
      }
    } else {
      navigate(path);
    }
    
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#000814] p-3 drop-shadow-xl sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          id="masterLogo" 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <h1 className="text-[#FFD60A] text-xl font-bold" style={{ fontFamily: 'Poppins' }}>
            Yellow Taxi App
          </h1> 
        </div>

        {/* Desktop Menu */}
        <ul 
          className="hidden md:flex lg:flex space-x-6 text-[#FFD60A] text-lg font-semibold items-center" 
          style={{ fontFamily: 'Poppins' }}
        >
          {[ 
            { name: 'Home', path: '/' },
            { name: 'Charts', path: '/#Charts' },
            { name: 'Maps', path: '/#Maps' },
          ].map((item) => (
            <li 
              key={item.path} 
              className="nav-item group transition-all duration-100 ease-in-out"
            >
              <button 
                onClick={() => handleNavigation(item.path)} 
                className="nav-link bg-left-bottom bg-gradient-to-r from-[#FFC300] to-[#FFC300] bg-[length:0%_3px] bg-no-repeat group-hover:bg-[length:100%_3px] transition-all duration-300 ease-out cursor-pointer"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button 
            id="hamburger-button" 
            onClick={toggleMobileMenu}
            className="text-white hover:text-green-700 focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="green" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div 
            id="dropdown-menu" 
            className="absolute top-full left-0 w-full font-semibold bg-white py-4 lg:hidden shadow-lg"
          >
            <ul className="text-center space-y-4">
              {[ 
                { name: 'Home', path: '/' },
                { name: 'Charts', path: '/#Charts' },
                { name: 'Maps', path: '/#Maps' },
              ].map((item) => (
                <li key={item.path}>
                  <button 
                    onClick={() => handleNavigation(item.path)}
                    className="text-[#137C13] cursor-pointer block py-2"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
