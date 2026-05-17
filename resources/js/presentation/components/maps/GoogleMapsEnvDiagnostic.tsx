/**
 * Componente de Diagnóstico para Google Maps API
 * Ejecuta en modo desarrollo para verificar variables de entorno
 */
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface DiagnosticResult {
    hasApiKey: boolean;
    apiKeyLength: number;
    apiKeyPrefix: string;
    environment: string;
    hostname: string;
    protocol: string;
    domain: string;
    isDevelopment: boolean;
    isProduction: boolean;
}

export function GoogleMapsEnvDiagnostic() {
    const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        const result: DiagnosticResult = {
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey ? apiKey.length : 0,
            apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
            environment: process.env.NODE_ENV || 'unknown',
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
            protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
            domain: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}` : 'unknown',
            isDevelopment: process.env.NODE_ENV === 'development',
            isProduction: process.env.NODE_ENV === 'production',
        };

        setDiagnostic(result);

        // Log to console for debugging
        console.group('[Google Maps Diagnostic]');
        console.log('API Key Status:', result.hasApiKey ? 'Present ✓' : 'Missing ✗');
        console.log('Key Length:', result.apiKeyLength);
        console.log('Key Prefix:', result.apiKeyPrefix);
        console.log('Environment:', result.environment);
        console.log('Domain:', result.domain);
        console.log('Environment Variables:', {
            VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'MISSING',
            MODE: import.meta.env.MODE,
            DEV: import.meta.env.DEV,
            PROD: import.meta.env.PROD,
        });
        console.groupEnd();
    }, []);

    if (!diagnostic) return null;

    // Solo mostrar en desarrollo
    if (!diagnostic.isDevelopment) return null;

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 text-xs font-mono max-h-80 overflow-y-auto">
            <div className="font-bold mb-3 flex items-center gap-2">
                {diagnostic.hasApiKey ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                )}
                Google Maps Diagnostic
            </div>

            <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span className="font-semibold">API Key:</span>
                    <span className={diagnostic.hasApiKey ? 'text-green-600' : 'text-red-600'}>
                        {diagnostic.hasApiKey ? `Present (${diagnostic.apiKeyLength} chars)` : 'Missing'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="font-semibold">Environment:</span>
                    <span>{diagnostic.environment}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-semibold">Domain:</span>
                    <span className="text-blue-600 break-all">{diagnostic.domain}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="font-semibold mb-2">Solución para Producción:</div>
                    <div className="text-gray-600 space-y-1">
                        <p>1. Verifica que .env.production tenga:</p>
                        <code className="block bg-gray-100 p-1 rounded">
                            VITE_GOOGLE_MAPS_API_KEY=your_key
                        </code>
                        <p className="mt-2">2. En Google Cloud Console:</p>
                        <ul className="list-disc list-inside ml-2">
                            <li>Agrega tu dominio a restricciones</li>
                            <li>Verifica permisos de Maps JavaScript API</li>
                        </ul>
                        <p className="mt-2">3. Rebuild después de cambios:</p>
                        <code className="block bg-gray-100 p-1 rounded">npm run build</code>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleMapsEnvDiagnostic;
