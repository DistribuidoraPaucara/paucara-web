import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import SearchSelect from '@/presentation/components/ui/search-select';

const CamposRolDinamicos = ({ rol, onChange, defaultValues = {}, errors = {} }) => {
    const { camposRol } = usePage().props;
    const [campos, setCampos] = useState([]);
    const [camposCargados, setCamposCargados] = useState(false);

    // Cargar campos según el rol
    useEffect(() => {
        if (!rol || !camposRol || !camposRol[rol]) {
            setCampos([]);
            return;
        }

        setCampos(camposRol[rol].campos || []);
        setCamposCargados(true);
    }, [rol, camposRol]);

    if (!rol || !camposCargados || campos.length === 0) {
        return null;
    }

    const renderCampo = (campo, config) => {
        const value = defaultValues[campo] || '';
        const error = errors[campo];

        switch (config.type) {
            case 'text':
                return (
                    <div>
                        <Label htmlFor={campo}>{config.label}</Label>
                        <Input
                            id={campo}
                            name={campo}
                            value={value}
                            onChange={(e) => onChange(campo, e.target.value)}
                            placeholder={config.placeholder || ''}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'number':
                return (
                    <div>
                        <Label htmlFor={campo}>{config.label}</Label>
                        <Input
                            id={campo}
                            name={campo}
                            type="number"
                            value={value}
                            onChange={(e) => onChange(campo, e.target.value)}
                            placeholder={config.placeholder || ''}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'date':
                return (
                    <div>
                        <Label htmlFor={campo}>{config.label}</Label>
                        <Input
                            id={campo}
                            name={campo}
                            type="date"
                            value={value}
                            onChange={(e) => onChange(campo, e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'select':
                const selectOptions = config.options ? config.options.map((option) => ({
                    value: option,
                    label: option
                })) : [];

                return (
                    <div>
                        <SearchSelect
                            id={campo}
                            label={config.label}
                            placeholder="Seleccionar..."
                            value={value}
                            options={selectOptions}
                            onChange={(selectedValue) => onChange(campo, selectedValue)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={campo}
                            checked={value === true}
                            onCheckedChange={(checked) => onChange(campo, !!checked)}
                        />
                        <Label htmlFor={campo} className="text-sm font-medium">
                            {config.label}
                        </Label>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'multiselect':
                // Implementar multiselect
                return (
                    <div>
                        <Label>{config.label}</Label>
                        <p className="text-xs text-gray-500 mb-2">
                            Selección múltiple pendiente de implementar
                        </p>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="border-t border-gray-200 pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">
                Información específica para {rol}
            </h3>

            <div className="space-y-4">
                {Object.entries(campos).map(([campo, config]) => (
                    <div key={campo} className="mb-4">
                        {renderCampo(campo, config)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CamposRolDinamicos;
