'use client';

import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const MobileHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">HuskyBids</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
