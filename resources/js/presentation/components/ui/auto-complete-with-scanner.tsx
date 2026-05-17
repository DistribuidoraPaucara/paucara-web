import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Camera, X } from 'lucide-react';

// Tipos para el componente
interface AutoCompleteWithScannerProps {
    id?: string;
    label?: string;
    value: string | number | null;
    options: Array<{
        value: string | number;
        label: string;
        description?: string;
        codigos_barras?: string;
    }>;
    onChange: (value: string | number | null, option?: { value: string | number; label: string; description?: string; codigos_barras?: string }) => void;
    onSearch?: (query: string) => Promise<Array<{ value: string | number; label: string; description?: string; codigos_barras?: string }>>;
    placeholder?: string;
    emptyText?: string;
    searchPlaceholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    allowScanner?: boolean; // Nueva prop para habilitar scanner
    scannerLabel?: string;
}

export default function AutoCompleteWithScanner({
    id,
    label,
    value,
    options = [],
    onChange,
    onSearch,
    placeholder = "Seleccionar...",
    emptyText = "No se encontraron resultados",
    searchPlaceholder = "Buscar...",
    error,
    disabled = false,
    required = false,
    className = "",
    allowScanner = false,
    scannerLabel = "Escanear código"
}: AutoCompleteWithScannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Encontrar la opción seleccionada
    const selectedOption = options.find(opt => opt.value === value);

    // Filtrar opciones localmente si no hay búsqueda async
    useEffect(() => {
        if (!onSearch) {
            const filtered = options.filter(option =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                option.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                option.codigos_barras?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [searchQuery, options, onSearch]);

    // Búsqueda async
    useEffect(() => {
        if (!onSearch || searchQuery.length < 2) {
            if (onSearch) setFilteredOptions([]);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await onSearch(searchQuery);
                setFilteredOptions(results);
            } catch (error) {
                console.error('Error en búsqueda:', error);
                setFilteredOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, onSearch]);

    // Manejar clicks fuera del componente
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus en el input de búsqueda cuando se abre
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelectOption = (option: { value: string | number; label: string; description?: string; codigos_barras?: string }) => {
        onChange(option.value, option);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClear = () => {
        onChange(null);
        setSearchQuery('');
    };

    // Funcionalidad del scanner
    const startScanner = async () => {
        try {
            setScannerError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Usar cámara trasera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setShowScanner(true);

            // Inicializar detección de códigos de barras
            initBarcodeDetection();
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            setScannerError('No se pudo acceder a la cámara. Verifique los permisos.');
        }
    };

    const stopScanner = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowScanner(false);
        setScannerError(null);
    };

    const initBarcodeDetection = async () => {
        try {
            // Intentar usar BarcodeDetector si está disponible
            if ('BarcodeDetector' in window) {
                const barcodeDetector = new (window as unknown as { BarcodeDetector: new (options?: { formats: string[] }) => { detect: (image: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector({
                    formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e']
                });

                const detectBarcodes = async () => {
                    if (videoRef.current && videoRef.current.readyState === 4) {
                        try {
                            const barcodes = await barcodeDetector.detect(videoRef.current);
                            if (barcodes.length > 0) {
                                const barcode = barcodes[0].rawValue;
                                handleBarcodeDetected(barcode);
                                return;
                            }
                        } catch (error) {
                            console.error('Error detectando código de barras:', error);
                        }
                    }

                    if (showScanner) {
                        setTimeout(detectBarcodes, 100);
                    }
                };

                detectBarcodes();
            } else {
                // Fallback usando ZXing
                await initZXingDetection();
            }
        } catch (error) {
            console.error('Error inicializando detección:', error);
            setScannerError('Error al inicializar el scanner de códigos de barras');
        }
    };

    const initZXingDetection = async () => {
        try {
            // Importar ZXing dinámicamente
            const { BrowserMultiFormatReader } = await import('@zxing/library');
            const codeReader = new BrowserMultiFormatReader();

            const detectZXing = async () => {
                if (videoRef.current && showScanner) {
                    try {
                        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);
                        if (result) {
                            handleBarcodeDetected(result.getText());
                            return;
                        }
                    } catch {
                        // Error silencioso, continuar intentando
                    }

                    if (showScanner) {
                        setTimeout(detectZXing, 100);
                    }
                }
            };

            detectZXing();
        } catch (error) {
            console.error('Error con ZXing:', error);
            setScannerError('Scanner no disponible en este dispositivo');
        }
    };

    const handleBarcodeDetected = async (barcode: string) => {
        console.log('Código detectado:', barcode);

        // Buscar el producto por código de barras
        if (onSearch) {
            try {
                setLoading(true);
                const results = await onSearch(barcode);
                if (results.length > 0) {
                    // Seleccionar automáticamente el primer resultado
                    handleSelectOption(results[0]);
                    stopScanner();
                } else {
                    setScannerError(`No se encontró ningún producto con el código: ${barcode}`);
                }
            } catch {
                setScannerError('Error al buscar el producto');
            } finally {
                setLoading(false);
            }
        } else {
            // Buscar en las opciones locales
            const foundOption = options.find(opt =>
                opt.codigos_barras?.includes(barcode) ||
                opt.value.toString() === barcode
            );

            if (foundOption) {
                handleSelectOption(foundOption);
                stopScanner();
            } else {
                setScannerError(`No se encontró ningún producto con el código: ${barcode}`);
            }
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    id={id}
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`
            relative w-full bg-white dark:bg-gray-700 border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default 
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${disabled ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          `}
                >
                    <span className="block truncate text-gray-900 dark:text-white">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {/* Búsqueda */}
                        <div className="sticky top-0 bg-white dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {allowScanner && (
                                    <button
                                        type="button"
                                        onClick={startScanner}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        title={scannerLabel}
                                    >
                                        <Camera className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Botón de limpiar */}
                        {selectedOption && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Limpiar selección
                            </button>
                        )}

                        {/* Opciones */}
                        {loading ? (
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                Buscando...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {emptyText}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelectOption(option)}
                                    className={`
                    w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600
                    ${option.value === value ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}
                  `}
                                >
                                    <div className="font-medium">{option.label}</div>
                                    {option.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                                    )}
                                    {option.codigos_barras && (
                                        <div className="text-xs text-blue-600 dark:text-blue-400">Códigos: {option.codigos_barras}</div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Scanner Modal */}
            {showScanner && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={stopScanner}></div>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Scanner de Códigos de Barras
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={stopScanner}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="relative bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-64 object-cover"
                                    />

                                    {/* Overlay de enfoque */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="border-2 border-red-500 bg-transparent w-64 h-16 rounded-lg"></div>
                                    </div>
                                </div>

                                {scannerError && (
                                    <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                                        {scannerError}
                                    </div>
                                )}

                                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Coloca el código de barras dentro del marco para escanearlo
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={stopScanner}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cerrar Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}
