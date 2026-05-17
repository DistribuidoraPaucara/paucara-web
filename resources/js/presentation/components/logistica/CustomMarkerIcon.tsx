import React from 'react';
import { Truck, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface CustomMarkerIconProps {
    estado: string;
    velocidad?: number | null;
    entregaId?: number;
}

/**
 * Mapa de colores por estado de entrega
 */
const ESTADO_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    PROGRAMADO: { bg: '#3b82f6', border: '#1e40af', text: '#fff' }, // Blue
    ASIGNADA: { bg: '#a855f7', border: '#6d28d9', text: '#fff' }, // Purple
    EN_CAMINO: { bg: '#f97316', border: '#c2410c', text: '#fff' }, // Orange
    LLEGO: { bg: '#06b6d4', border: '#0c4a6e', text: '#fff' }, // Cyan
    ENTREGADO: { bg: '#10b981', border: '#065f46', text: '#fff' }, // Green
    NOVEDAD: { bg: '#eab308', border: '#713f12', text: '#000' }, // Yellow
    CANCELADA: { bg: '#ef4444', border: '#7f1d1d', text: '#fff' }, // Red
};

/**
 * Mapa de colores por velocidad
 */
const VELOCIDAD_COLORS: Record<string, string> = {
    slow: '#ef4444', // Red (<10 km/h)
    medium: '#f97316', // Orange (10-40 km/h)
    fast: '#10b981', // Green (>40 km/h)
};

const getVelocidadColor = (velocidad?: number | null): string => {
    if (!velocidad || velocidad < 1) return '#ef4444'; // Parado o sin datos
    if (velocidad < 10) return '#ef4444'; // Muy lento
    if (velocidad < 40) return '#f97316'; // Velocidad normal
    return '#10b981'; // Rápido
};

const getEstadoIcon = (estado: string) => {
    switch (estado) {
        case 'EN_CAMINO':
            return 'truck';
        case 'LLEGO':
            return 'map-pin';
        case 'ENTREGADO':
            return 'check-circle';
        case 'NOVEDAD':
            return 'alert-circle';
        default:
            return 'map-pin';
    }
};

/**
 * Componente CustomMarkerIcon
 *
 * Renderiza un icono personalizado para marcadores en Google Maps
 * - Color basado en estado de entrega
 * - Icono específico según estado
 * - Indicador de velocidad con animación
 *
 * @example
 * <CustomMarkerIcon estado="EN_CAMINO" velocidad={45.5} entregaId={123} />
 */
export function CustomMarkerIcon({
    estado,
    velocidad,
    entregaId,
}: CustomMarkerIconProps) {
    const colors = ESTADO_COLORS[estado] || ESTADO_COLORS.ASIGNADA;
    const velocidadColor = getVelocidadColor(velocidad);
    const iconType = getEstadoIcon(estado);

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: '56px', height: '56px' }}
        >
            {/* Fondo del pin */}
            <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                {/* Pin shape */}
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>
                <path
                    d="M 28 4 C 34.6274 4 40 9.3726 40 16 C 40 24 28 48 28 48 C 28 48 16 24 16 16 C 16 9.3726 21.3726 4 28 4 Z"
                    fill={colors.bg}
                    stroke={colors.border}
                    strokeWidth="1"
                    filter="url(#shadow)"
                />

                {/* Circulito interior blanco */}
                <circle
                    cx="28"
                    cy="18"
                    r="7"
                    fill="white"
                    opacity="0.9"
                />
            </svg>

            {/* Icono dentro del pin */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -60%)',
                    color: colors.text,
                    zIndex: 2,
                }}
            >
                {iconType === 'truck' && <Truck size={20} />}
                {iconType === 'map-pin' && <MapPin size={20} />}
                {iconType === 'check-circle' && <CheckCircle size={20} />}
                {iconType === 'alert-circle' && <AlertCircle size={20} />}
            </div>

            {/* Indicador de velocidad (anillo exterior con animación) */}
            {velocidad && velocidad > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: velocidadColor,
                        opacity: 0.3,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        zIndex: 0,
                    }}
                />
            )}

            {/* Badge con ID de entrega */}
            {entregaId && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        zIndex: 3,
                        border: `2px solid white`,
                    }}
                >
                    {(entregaId % 100).toString().padStart(2, '0')}
                </div>
            )}

            {/* CSS para animación pulse */}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
}

/**
 * Helper para crear elemento HTML de marcador para Google Maps
 */
export function createMarkerElement(estado: string, velocidad?: number | null, entregaId?: number): HTMLElement {
    const colors = ESTADO_COLORS[estado] || ESTADO_COLORS.ASIGNADA;
    const velocidadColor = getVelocidadColor(velocidad);
    const iconType = getEstadoIcon(estado);

    const container = document.createElement('div');
    container.className = 'relative inline-flex items-center justify-center';
    container.style.width = '56px';
    container.style.height = '56px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '56');
    svg.setAttribute('height', '56');
    svg.setAttribute('viewBox', '0 0 56 56');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

    // Crear el path del pin
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 28 4 C 34.6274 4 40 9.3726 40 16 C 40 24 28 48 28 48 C 28 48 16 24 16 16 C 16 9.3726 21.3726 4 28 4 Z');
    path.setAttribute('fill', colors.bg);
    path.setAttribute('stroke', colors.border);
    path.setAttribute('stroke-width', '1');

    // Crear circulito blanco interior
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '28');
    circle.setAttribute('cy', '18');
    circle.setAttribute('r', '7');
    circle.setAttribute('fill', 'white');
    circle.setAttribute('opacity', '0.9');

    svg.appendChild(path);
    svg.appendChild(circle);
    container.appendChild(svg);

    // Icono
    const iconContainer = document.createElement('div');
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '50%';
    iconContainer.style.left = '50%';
    iconContainer.style.transform = 'translate(-50%, -60%)';
    iconContainer.style.color = colors.text;
    iconContainer.style.zIndex = '2';
    iconContainer.innerHTML = getIconSVG(iconType);

    container.appendChild(iconContainer);

    // Indicador de velocidad
    if (velocidad && velocidad > 0) {
        const pulse = document.createElement('div');
        pulse.style.position = 'absolute';
        pulse.style.top = '50%';
        pulse.style.left = '50%';
        pulse.style.transform = 'translate(-50%, -50%)';
        pulse.style.width = '48px';
        pulse.style.height = '48px';
        pulse.style.borderRadius = '50%';
        pulse.style.backgroundColor = velocidadColor;
        pulse.style.opacity = '0.3';
        pulse.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
        pulse.style.zIndex = '0';
        container.appendChild(pulse);
    }

    // Badge con ID
    if (entregaId) {
        const badge = document.createElement('div');
        badge.style.position = 'absolute';
        badge.style.top = '-4px';
        badge.style.right = '-4px';
        badge.style.backgroundColor = colors.bg;
        badge.style.color = colors.text;
        badge.style.borderRadius = '50%';
        badge.style.width = '20px';
        badge.style.height = '20px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.fontSize = '10px';
        badge.style.fontWeight = 'bold';
        badge.style.zIndex = '3';
        badge.style.border = '2px solid white';
        badge.textContent = (entregaId % 100).toString().padStart(2, '0');
        container.appendChild(badge);
    }

    return container;
}

/**
 * Helper para obtener el SVG del icono
 */
function getIconSVG(type: string): string {
    const iconMap: Record<string, string> = {
        truck: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19H4V7a2 2 0 0 1 2-2h26a2 2 0 0 1 2 2v10h-15.5"/><circle cx="18.5" cy="17.5" r="2.5"/><circle cx="9.5" cy="17.5" r="2.5"/></svg>',
        'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    };
    return iconMap[type] || iconMap['map-pin'];
}
