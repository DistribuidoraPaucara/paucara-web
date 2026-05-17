import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const isMobileValue = window.innerWidth < MOBILE_BREAKPOINT;
            console.log('[Mobile Detection] Init:', { w: window.innerWidth, bp: 768, isMobile: isMobileValue });
            return isMobileValue;
        }
        return false;
    });

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 767px)');
        const onChange = () => {
            const isMobileValue = window.innerWidth < MOBILE_BREAKPOINT;
            console.log('[Mobile Detection] Change:', { w: window.innerWidth, bp: 768, isMobile: isMobileValue });
            setIsMobile(isMobileValue);
        };

        mql.addEventListener('change', onChange);
        const initialValue = window.innerWidth < MOBILE_BREAKPOINT;
        console.log('[Mobile Detection] Effect:', { w: window.innerWidth, bp: 768, isMobile: initialValue });
        setIsMobile(initialValue);

        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}
