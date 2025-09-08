'use client';
import { IoChevronUp } from "react-icons/io5";
import { HiMiniChevronDown } from "react-icons/hi2";
import { useState, useRef, useEffect,useCallback } from 'react';

const SelectDropdown = ({
  label,
  options,
  selectedValue,
  onChange,
  textColor = 'text-black',
  width = 'w-full',
  padding = "p-[5.5px]",
  labelshow = true,
  showToggle = true,
  open,
  onOpenChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const isControlled = typeof open === 'boolean';
  const actualOpen = isControlled ? open : showDropdown;

const setOpen = useCallback((v) => (isControlled ? onOpenChange?.(v) : setShowDropdown(v)), [isControlled, onOpenChange]);
  const toggleDropdown = useCallback(() => setOpen(!actualOpen), [setOpen, actualOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (actualOpen) {
      const anchorEl = buttonRef.current || containerRef.current;
      const rect = anchorEl?.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 36, 200); // ~36px/item, capped
      setDropUp(spaceBelow < dropdownHeight);
    }
  }, [actualOpen, options.length]);

  // Close on outside click + Esc
  useEffect(() => {
    if (!actualOpen) return;

    const handlePointerDown = (e) => {
      if (!containerRef.current || !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDropdown();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actualOpen, closeDropdown]);

  return (
    <div ref={containerRef} className={`space-y-1 relative ${width}`}>
      {labelshow && <label className="text-[14px] text-black dark:text-white !font-[Inter] block font-semibold">{label}</label>}

      {showToggle && (
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className={`dark:text-white text-[13px] ${textColor} leading-[1.5rem] w-full ${padding} border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-left cursor-pointer !font-[Inter]`}
        >
          {selectedValue || `${label}`}
          <span className="float-right">
            {actualOpen ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
          </span>
        </button>
      )}

      {actualOpen && (
        <div
          className="custom-scrollbar text-[12px] absolute bg-white shadow z-20 w-full max-h-48 overflow-y-auto dark:bg-gray-700 dark:border-gray-600 border-2"
          style={dropUp ? { bottom: showToggle ? '100%' : '0', marginBottom: '0.25rem' } : { top: showToggle ? '100%' : 'auto', marginTop: '0.25rem' }}
        >
          {/* Default Option */}
          <label key="default" className="!font-[Inter] block px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-100 truncate cursor-pointer">
            <input
              type="radio"
              name={label}
              value=""
              checked={!selectedValue}
              onChange={() => {
                onChange(""); // Pass empty or custom value
                closeDropdown();
              }}
              className="mr-2 !font-[Inter]"
            />
            {`Select ${label}`}
          </label>

          {/* Real Options */}
          {options.map((option) => (
            <label key={option} className="!font-[Inter] block px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-100 truncate cursor-pointer">
              <input
                type="radio"
                name={label}
                value={option}
                checked={selectedValue === option}
                onChange={() => {
                  onChange(option);
                  closeDropdown();
                }}
                className="mr-2 !font-[Inter]"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};


export default SelectDropdown;
