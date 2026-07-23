import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import type { Imagen } from '@/domain/entities/productos';
import Webcam from 'react-webcam';
import { ensureUnder1MB, dataURLToFile } from '@/infrastructure/services/image.service';
import { useRef, useState } from 'react';

export interface Step4Props {
  data: { perfil?: { file?: File | null; url?: string }; galeria: Imagen[] };
  setPerfil: (file: File | undefined) => void;
  addGaleria: (files: FileList | null) => void;
  removeGaleria: (i: number) => void | Promise<void>;
}

export default function Step4Imagenes({ data, setPerfil, addGaleria, removeGaleria }: Step4Props) {
  const webcamRef = useRef<Webcam | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraMode, setCameraMode] = useState<'perfil' | 'galeria' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoConstraints: MediaTrackConstraints = {
    facingMode: cameraFacing,
  };


  function nowStamp(): string {
    const d = new Date();
    const pad = (v: number) => String(v).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function openCamera(mode: 'perfil' | 'galeria'): void {
    setCameraMode(mode);
    setCameraOpen(true);
    setCameraError(null);
  }

  function closeCamera(): void {
    setCameraOpen(false);
    setCameraMode(null);
    setCameraError(null);
  }

  function toggleFacing(): void {
    setCameraFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  }

  async function handleCapture(): Promise<void> {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setCameraError('No se pudo capturar la imagen. Verifique permisos y vuelva a intentar.');
      return;
    }
    const file = dataURLToFile(screenshot, `captura-${nowStamp()}.jpg`);

    if (cameraMode === 'perfil') {
      const resized = await ensureUnder1MB(file);
      setPerfil(resized);
    } else if (cameraMode === 'galeria') {
      // Crear un FileList a partir del File usando DataTransfer
      const dt = new DataTransfer();
      const resized = await ensureUnder1MB(file);
      dt.items.add(resized);
      addGaleria(dt.files);
    }
    closeCamera();
  }

  return (
    <div>
      {/* <div className="bg-secondary border border-border rounded p-3">
        <div className="text-sm font-semibold text-foreground">Paso 4: Imágenes</div>
        <div className="text-xs text-muted-foreground">Agrega la foto de perfil y las imágenes de la galería</div>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-1">
        <div className="space-y-4">
          <div className="relative space-y-2">
            <div>
              <p className="text-base font-semibold">Foto de producto</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Seleccionar archivo
                  </span>
                  <input type="file" accept="image/*" onChange={async e => {
                                      const f = e.target.files?.[0];
                                      if (!f) { setPerfil(undefined); return; }
                                      const resized = await ensureUnder1MB(f);
                                      setPerfil(resized);
                                    }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => openCamera('perfil')}>
                  {/* icon camara */}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Usar cámara
                </Button>
              </div>
            </div>

            {data.perfil?.url ? (
              <div className="mt-3 flex flex-col items-center space-y-3 text-center">
                <div className="relative inline-block">
                  <img src={data.perfil.url} alt="Perfil del producto" className="w-40 h-40 object-cover rounded-md border shadow-sm" />
                  <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0" onClick={() => setPerfil(undefined)}>✕</Button>
                </div>
                <div className="text-sm text-gray-600">Imagen actual del producto</div>
              </div>
            ) : data.perfil?.file ? (
              <div className="mt-3 flex flex-col items-center space-y-3 text-center">
                <div className="relative inline-block">
                  <img src={URL.createObjectURL(data.perfil.file)} alt="Vista previa" className="w-48 h-48 object-cover rounded-md border shadow-sm" />
                  <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0" onClick={() => setPerfil(undefined)}>✕</Button>
                </div>
                <div className="text-sm text-gray-600">Nueva imagen seleccionada</div>
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center gap-3 text-center">
                <div className="w-40 h-40 rounded-md border-2 border-dashed border-border flex items-center justify-center text-gray-400 bg-secondary/50">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="text-xs text-muted-foreground">
                  {/*Selecciona una imagen o usa la cámara — PNG, JPG, GIF hasta 4MB*/}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modal de Cámara */}
        <Dialog open={cameraOpen} onOpenChange={closeCamera}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cámara {cameraMode === 'perfil' ? '— Foto de Perfil' : '— Galería'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {cameraError && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{cameraError}</div>
              )}

              <div className="w-full flex justify-center">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMediaError={() => setCameraError('No se pudo acceder a la cámara. Verifique permisos del navegador.')}
                  className="rounded-md border max-h-[60vh] w-full"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button type="button" variant="outline" onClick={toggleFacing}>Cambiar cámara</Button>
                <Button type="button" onClick={handleCapture}>Capturar</Button>
              </div>

              <div className="text-[11px] text-muted-foreground text-center">
                Nota: En móviles, para usar la cámara trasera seleccione "Cambiar cámara". Es posible que se requiera HTTPS y conceder permisos.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
