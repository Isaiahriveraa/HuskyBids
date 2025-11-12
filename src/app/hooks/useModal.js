import { useState } from 'react';

/**
 * Custom hook for managing modal state
 * @returns {Object} - { isOpen, open, close, toggle, data, setData }
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = (modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    data,
    setData,
  };
}
