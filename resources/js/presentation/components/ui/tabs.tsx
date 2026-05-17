import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className = '' }: TabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || value || '');

    // Use controlled value if provided, otherwise use internal state
    const activeTab = value !== undefined ? value : internalActiveTab;

    const handleSetActiveTab = (tab: string) => {
        if (value === undefined) {
            // Uncontrolled mode
            setInternalActiveTab(tab);
        }
        // Call the callback if provided
        onValueChange?.(tab);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
    return (
        <div className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within Tabs');
    }

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                } ${className}`}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    const { activeTab } = context;

    if (activeTab !== value) {
        return null;
    }

    return <div className={className}>{children}</div>;
}
