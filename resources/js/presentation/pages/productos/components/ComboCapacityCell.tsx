import { useState, useEffect } from 'react';
import { Package, AlertCircle } from 'lucide-react';

interface CapacityData {
  capacidad: number;
  combo_nombre: string;
}

interface ComboCapacityCellProps {
  comboId: number;
  esComboCampo?: boolean;
}

export default function ComboCapacityCell({ comboId, esComboCampo }: ComboCapacityCellProps) {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/combos/${comboId}/capacidad`);
        if (!response.ok) throw new Error('Error');

        const data = await response.json();
        setCapacity(data);
        setError(null);
      } catch (err) {
        setError('Error');
        setCapacity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacity();
  }, [comboId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
      </div>
    );
  }

  if (error || !capacity) {
    return (
      <div className="flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={14} />
        <span>—</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
      <Package size={14} className="text-blue-600 dark:text-blue-400" />
      <div className="flex flex-col">
        <span className="font-semibold text-blue-700 dark:text-blue-200">{capacity.capacidad}</span>
        <span className="text-[10px] text-blue-600 dark:text-blue-300 leading-none">combos</span>
      </div>
    </div>
  );
}
