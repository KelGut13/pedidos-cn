import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PedidosDropdown.css';

const PedidosDropdown = ({ value, onChange, options, placeholder = "Seleccionar...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setDropdownPosition({
        top: rect.bottom + offsetTop,
        left: rect.left + offsetLeft,
        width: rect.width
      });
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendiente': { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' },
      'procesando': { bg: '#DBEAFE', text: '#2563EB', border: '#3B82F6' },
      'completado': { bg: '#D1FAE5', text: '#059669', border: '#10B981' },
      'cancelado': { bg: '#FEE2E2', text: '#DC2626', border: '#EF4444' },
      'enviado': { bg: '#EDE9FE', text: '#7C3AED', border: '#8B5CF6' },
      'entregado': { bg: '#DCFCE7', text: '#16A34A', border: '#22C55E' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', border: '#9CA3AF' };
  };

  return (
    <div 
      className={`pedidos-custom-dropdown ${isOpen ? 'open' : ''} ${className}`} 
      ref={dropdownRef}
      style={{ zIndex: isOpen ? 9999 : 1 }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`pedidos-custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="pedidos-custom-dropdown-selected">
          {selectedOption ? (
            <div className="pedidos-custom-dropdown-status">
              <span 
                className="pedidos-status-indicator"
                style={{
                  backgroundColor: getStatusColor(selectedOption.value).bg,
                  color: getStatusColor(selectedOption.value).text,
                  borderColor: getStatusColor(selectedOption.value).border
                }}
              >
                {selectedOption.label}
              </span>
            </div>
          ) : (
            <span className="pedidos-custom-dropdown-placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`pedidos-custom-dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="pedidos-custom-dropdown-menu-overlay">
            <motion.div
              className="pedidos-custom-dropdown-menu"
              style={{
                top: 0,
                left: 0,
                width: dropdownPosition.width
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="pedidos-custom-dropdown-options">
                {options.map((option) => {
                  const colorInfo = getStatusColor(option.value);
                  const isSelected = value === option.value;
                  
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      className={`pedidos-custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(option.value)}
                      whileHover={{ backgroundColor: 'rgba(97, 28, 137, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="pedidos-option-content">
                        <span 
                          className="pedidos-option-status"
                          style={{
                            backgroundColor: colorInfo.bg,
                            color: colorInfo.text,
                            borderColor: colorInfo.border
                          }}
                        >
                          {option.label}
                        </span>
                        {isSelected && (
                          <Check size={16} className="pedidos-option-check" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PedidosDropdown;
