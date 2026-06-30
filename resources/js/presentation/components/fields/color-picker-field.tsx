// Presentation Layer: Color Picker Field Component
import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Input } from '@/presentation/components/ui/input';
import { ChevronDown } from 'lucide-react';

interface ColorPickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function ColorPickerField({
  id,
  value,
  onChange,
  placeholder = '#6366F1',
  disabled = false,
  error
}: ColorPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || placeholder);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Validar hex color
  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Actualizar input cuando value cambia
  useEffect(() => {
    setInputValue(value || placeholder);
  }, [value, placeholder]);

  // Cerrar picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        buttonRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        {/* Color Preview + Input */}
        <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
          {/* Color Preview Circle */}
          <div
            className="w-8 h-8 rounded-md border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: isValidHex(inputValue) ? inputValue : placeholder }}
            onClick={() => setIsOpen(!isOpen)}
            title="Click para abrir selector de color"
          />

          {/* Hex Input */}
          <Input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 text-sm font-mono uppercase ${
              error
                ? 'text-red-600 dark:text-red-400 placeholder:text-red-400'
                : isValidHex(inputValue)
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-yellow-600 dark:text-yellow-400'
            }`}
          />
        </div>

        {/* Toggle Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`px-3 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
            isOpen ? 'bg-accent' : ''
          }`}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Color Picker Popup */}
      {isOpen && !disabled && (
        <div
          ref={pickerRef}
          className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-input p-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <HexColorPicker
            color={isValidHex(inputValue) ? inputValue : placeholder}
            onChange={handleColorChange}
            style={{
              width: '280px',
              height: '220px'
            }}
          />

          {/* Hex Display Below Picker */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-muted-foreground mb-2">Valor Hexadecimal</p>
            <p className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
              {isValidHex(inputValue) ? inputValue.toUpperCase() : 'Invalid'}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}

      {/* Info Message */}
      {!error && !isValidHex(inputValue) && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
          Formato hexadecimal inválido. Ej: #6366F1
        </p>
      )}
    </div>
  );
}
