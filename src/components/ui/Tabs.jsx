/**
 * Tabs Component
 * Navigate between different views
 */

'use client';

import React, { useState } from 'react';

const Tabs = ({ 
  tabs = [],
  defaultTab = 0,
  onChange,
  variant = 'underline',
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };
  
  // Variant styles
  const variants = {
    underline: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-3 font-medium transition-colors duration-200',
      active: 'border-b-2 border-uw-purple text-uw-purple',
      inactive: 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: 'px-4 py-2 font-medium rounded-md transition-all duration-200',
      active: 'bg-white text-uw-purple shadow-sm',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    enclosed: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-3 font-medium border border-transparent rounded-t-lg transition-all duration-200',
      active: 'bg-white border-gray-200 border-b-white text-uw-purple -mb-px',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
    },
  };
  
  const styles = variants[variant];
  
  return (
    <div className={className} {...props}>
      {/* Tab Headers */}
      <div className={`flex ${styles.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`
              ${styles.tab}
              ${index === activeTab ? styles.active : styles.inactive}
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
