import { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { ImagePlus, Images, Link2, Loader2, RotateCcw, Upload } from 'lucide-react';

export const DEFAULT_IMAGE_PATH = '/storage/notificacion/ic_notification.png';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

interface ImagenDisponible {
    url: string;
    nombre: string;
    tamano: number;
    modificado: number;
}

interface ImagenNotificacionInputProps {
    value?: string | null;
    onChange: (url: string) => void;
    error?: string;
}

const formatearTamano = (bytes: number) =>
    bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function ImagenNotificacionInput({ value, onChange, error }: ImagenNotificacionInputProps) {
    const inputArchivo = useRef<HTMLInputElement>(null);
    const [arrastrando, setArrastrando] = useState(false);
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [errorLocal, setErrorLocal] = useState<string | null>(null);
    // URL cuya carga falló; el aviso desaparece al cambiar de imagen
    const [urlConError, setUrlConError] = useState<string | null>(null);
    const [mostrarUrl, setMostrarUrl] = useState(false);
    const [galeriaAbierta, setGaleriaAbierta] = useState(false);
    const [imagenes, setImagenes] = useState<ImagenDisponible[]>([]);
    const [cargandoGaleria, setCargandoGaleria] = useState(false);

    const preview = value || DEFAULT_IMAGE_PATH;
    const esPorDefecto = !value || value === DEFAULT_IMAGE_PATH || value.endsWith(DEFAULT_IMAGE_PATH);

    const subirArchivo = async (archivo: File) => {
        setErrorLocal(null);
        if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
            setErrorLocal('Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
            return;
        }
        if (archivo.size > TAMANO_MAXIMO) {
            setErrorLocal(`La imagen pesa ${formatearTamano(archivo.size)}; el máximo es 5 MB.`);
            return;
        }

        const datos = new FormData();
        datos.append('imagen', archivo);
        setSubiendo(true);
        setProgreso(0);
        try {
            const { data } = await axios.post('/notificaciones/imagenes', datos, {
                onUploadProgress: (e) => e.total && setProgreso(Math.round((e.loaded / e.total) * 100)),
            });
            onChange(data.data.url);
            // La galería se recarga la próxima vez que se abra
            setImagenes([]);
        } catch (err) {
            const mensaje = axios.isAxiosError(err)
                ? err.response?.data?.errors?.imagen?.[0] ?? err.response?.data?.message
                : null;
            setErrorLocal(mensaje || 'No se pudo subir la imagen.');
        } finally {
            setSubiendo(false);
        }
    };

    const abrirGaleria = async () => {
        setGaleriaAbierta(true);
        if (imagenes.length > 0) return;
        setCargandoGaleria(true);
        try {
            const { data } = await axios.get('/notificaciones/imagenes');
            setImagenes(data.data);
        } catch {
            setErrorLocal('No se pudieron cargar las imágenes disponibles.');
            setGaleriaAbierta(false);
        } finally {
            setCargandoGaleria(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setArrastrando(false);
        const archivo = e.dataTransfer.files?.[0];
        if (archivo) subirArchivo(archivo);
    };

    const mensajeError = errorLocal || error;

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Vista previa */}
                <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/50 sm:w-36">
                    {urlConError === preview ? (
                        <p className="p-2 text-center text-xs text-red-600 dark:text-red-400">No se pudo cargar la imagen</p>
                    ) : (
                        <img
                            key={preview}
                            src={preview}
                            alt="Vista previa de la imagen de la notificación"
                            className="max-h-full max-w-full object-contain"
                            onError={() => setUrlConError(preview)}
                        />
                    )}
                </div>

                {/* Zona para subir */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => !subiendo && inputArchivo.current?.click()}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputArchivo.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setArrastrando(true);
                    }}
                    onDragLeave={() => setArrastrando(false)}
                    onDrop={onDrop}
                    className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition ${
                        arrastrando ? 'border-primary bg-primary/5' : 'border-input bg-input-background hover:bg-muted'
                    }`}
                >
                    {subiendo ? (
                        <>
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="text-sm">Subiendo… {progreso}%</span>
                            <div className="h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-muted">
                                <div className="h-full bg-primary transition-all" style={{ width: `${progreso}%` }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {arrastrando ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para elegirla'}
                            </span>
                            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP o GIF · máximo 5 MB</span>
                        </>
                    )}
                    <input
                        ref={inputArchivo}
                        type="file"
                        accept={TIPOS_PERMITIDOS.join(',')}
                        className="hidden"
                        onChange={(e) => {
                            const archivo = e.target.files?.[0];
                            if (archivo) subirArchivo(archivo);
                            e.target.value = '';
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="mr-auto text-xs text-muted-foreground">
                    {esPorDefecto ? 'Se usará la imagen por defecto' : value?.split('/').pop()}
                </span>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={abrirGaleria}>
                    <Images className="h-4 w-4" />
                    Elegir de la galería
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setMostrarUrl(!mostrarUrl)}>
                    <Link2 className="h-4 w-4" />
                    Usar URL
                </Button>
                {!esPorDefecto && (
                    <Button type="button" variant="ghost" size="sm" className="gap-2" onClick={() => onChange('')}>
                        <RotateCcw className="h-4 w-4" />
                        Usar por defecto
                    </Button>
                )}
            </div>

            {mostrarUrl && (
                <Input
                    type="url"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.png"
                />
            )}

            {mensajeError && <p className="text-sm text-red-600 dark:text-red-400">{mensajeError}</p>}

            <Dialog open={galeriaAbierta} onOpenChange={setGaleriaAbierta}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Imágenes disponibles</DialogTitle>
                        <DialogDescription>Elige una imagen ya subida para esta notificación.</DialogDescription>
                    </DialogHeader>
                    {cargandoGaleria ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : imagenes.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
                            <Upload className="h-6 w-6" />
                            Todavía no hay imágenes subidas.
                        </div>
                    ) : (
                        <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                            {imagenes.map((img) => {
                                const seleccionada = value === img.url;
                                return (
                                    <button
                                        key={img.url}
                                        type="button"
                                        onClick={() => {
                                            onChange(img.url);
                                            setGaleriaAbierta(false);
                                        }}
                                        className={`overflow-hidden rounded-lg border text-left transition hover:ring-2 hover:ring-primary/50 ${
                                            seleccionada ? 'ring-2 ring-primary' : ''
                                        }`}
                                    >
                                        <div className="flex aspect-square items-center justify-center bg-muted/50">
                                            <img src={img.url} alt={img.nombre} loading="lazy" className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div className="p-2">
                                            <p className="truncate text-xs font-medium" title={img.nombre}>{img.nombre}</p>
                                            <p className="text-xs text-muted-foreground">{formatearTamano(img.tamano)}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
