import React, { useRef } from 'react';
import { ensureUnder1MB } from '@/infrastructure/services/image.service';

interface FileUploadPreviewProps {
  label: string;
  name: string;
  value?: File | string | null;
  previewUrl?: string | null; // URL para preview (para modo edición)
  onChange: (file: File | null) => void;
  previewType?: 'circle' | 'rect';
  accept?: string;
  helperText?: string;
  disabled?: boolean;
}

const defaultHelper = 'Formatos aceptados: JPG, PNG, GIF. Tamaño máximo 1MB.';

export default function FileUploadPreview({
  label,
  name,
  value,
  previewUrl: externalPreviewUrl,
  onChange,
  previewType = 'rect',
  accept = 'image/jpeg,image/png,image/gif',
  helperText = defaultHelper,
  disabled = false,
}: FileUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Determina la URL de previsualización
  const [internalPreviewUrl, setInternalPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setInternalPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string' && value) {
      setInternalPreviewUrl(value);
    } else {
      setInternalPreviewUrl(null);
    }
  }, [value]);

  // Usar preview externa si está disponible, sino usar la interna
  const previewUrl = internalPreviewUrl || externalPreviewUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] || null;
    if (!picked) {
      onChange(null);
      return;
    }
    try {
      const processed = await ensureUnder1MB(picked);
      onChange(processed);
    } catch {
      onChange(picked);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm text-gray-700 dark:text-gray-200">{label}</label>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={
          'text-center ' +
          (
          previewType === 'circle'
            ? 'group w-20 h-20 rounded-full border border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer relative overflow-hidden transition-colors'
            : 'group w-44 h-28 rounded-md border border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer relative overflow-hidden transition-colors'
          )
      }
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Previsualización" className="object-cover w-full h-full" />
            <div className="absolute inset-0 hidden items-center justify-center bg-black/30 text-white text-xs group-hover:flex">Cambiar imagen</div>
          </>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">Cargar imagen</span>
        )}
      </div>

      {previewUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-red-500 dark:text-red-400 hover:underline mt-1 self-start"
          disabled={disabled}
        >
          Quitar imagen
        </button>
      )}

      <span className="text-xs text-gray-500 dark:text-gray-400">{helperText}</span>
    </div>
  );
}

