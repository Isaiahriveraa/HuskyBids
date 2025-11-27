/**
 * Dropdown Component
 * Reusable dropdown menu component with customizable trigger and content
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className = '',
  closeOnClick = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 z-50
            bg-white rounded-lg shadow-xl border border-gray-200
            min-w-[280px] max-w-md
            animate-in fade-in slide-in-from-top-2 duration-200
            ${alignmentClasses[align]}
          `}
          onClick={handleContentClick}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown.Item component for individual menu items
Dropdown.Item = function DropdownItem({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
}) {
  const baseClasses = `
    w-full px-4 py-3 text-left
    transition-colors duration-150
    ${disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-gray-50 cursor-pointer'
    }
    ${className}
  `;

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

// Dropdown.Divider component for visual separation
Dropdown.Divider = function DropdownDivider() {
  return <div className="h-px bg-gray-200 my-1" />;
};

// Dropdown.Header component for section headers
Dropdown.Header = function DropdownHeader({ children, className = '' }) {
  return (
    <div className={`px-4 py-2 text-sm font-semibold text-gray-700 ${className}`}>
      {children}
    </div>
  );
};
