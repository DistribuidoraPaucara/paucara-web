import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Foto de perfil</Label>
          <div className="relative space-y-2">
            <div className="flex gap-2">
              <div className="relative inline-block">
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
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => openCamera('perfil')}>
                Usar cámara
              </Button>
            </div>

            {data.perfil?.url ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img src={data.perfil.url} alt="Perfil del producto" className="w-10 h-10 object-cover rounded-full border shadow-sm" />
                  <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0" onClick={() => setPerfil(undefined)}>✕</Button>
                </div>
                <div className="text-sm text-gray-600">Imagen actual del producto</div>
              </div>
            ) : data.perfil?.file ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img src={URL.createObjectURL(data.perfil.file)} alt="Vista previa" className="w-48 h-48 object-cover rounded-full border shadow-sm" />
                  <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0" onClick={() => setPerfil(undefined)}>✕</Button>
                </div>
                <div className="text-sm text-gray-600">Nueva imagen seleccionada</div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center text-gray-400 bg-secondary/50">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {/*Selecciona una imagen o usa la cámara — PNG, JPG, GIF hasta 4MB*/}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Galería de imágenes</Label>
            <div className="flex gap-2">
              <div className="relative">
                <Button type="button" size="sm" variant="outline" className="relative overflow-hidden">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Agregar imágenes
                  </span>
                  <input type="file" accept="image/*" multiple onChange={async e => {
                                      const list = e.target.files;
                                      if (!list) { return; }
                                      // Resize each before passing on
                                      const dt = new DataTransfer();
                                      for (let i = 0; i < list.length; i++) {
                                        const f = list.item(i);
                                        if (f) {
                                          const r = await ensureUnder1MB(f);
                                          dt.items.add(r);
                                        }
                                      }
                                      addGaleria(dt.files);
                                    }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </Button>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => openCamera('galeria')}>Cámara</Button>
            </div>
          </div>

          {data.galeria && data.galeria.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.galeria.map((img: Imagen, i: number) => (
                <div key={i} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border bg-secondary">
                    {img.url ? (
                      <img src={img.url} alt={`Galería ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : img.file ? (
                      <img src={URL.createObjectURL(img.file)} alt={`Vista previa ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" onClick={() => removeGaleria(i)}>✕</Button>
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">Imagen {i + 1}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-10 h-10 text-gray-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-sm text-muted-foreground">No hay imágenes en la galería</p>
                <p className="text-xs text-muted-foreground/80">Usa el botón "Agregar imágenes" o "Cámara" para subir fotos</p>
              </div>
            </div>
          )}
        </div>

        {cameraOpen && (
          <div className="border rounded-lg p-3 bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Cámara {cameraMode === 'perfil' ? '— Perfil' : '— Galería'}</div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={toggleFacing}>Cambiar cámara</Button>
                <Button type="button" size="sm" variant="outline" onClick={closeCamera}>Cerrar</Button>
              </div>
            </div>

            {cameraError && (
              <div className="text-xs text-red-600 mb-2">{cameraError}</div>
            )}

            <div className="w-full flex justify-center">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={() => setCameraError('No se pudo acceder a la cámara. Verifique permisos del navegador.')}
                className="rounded-md border max-h-[60vh]"
              />
            </div>

            <div className="mt-3 flex justify-center gap-3">
              <Button type="button" onClick={handleCapture}>Capturar</Button>
            </div>

            <div className="mt-2 text-[11px] text-muted-foreground text-center">
              Nota: En móviles, para usar la cámara trasera seleccione "Cambiar cámara". Es posible que se requiera HTTPS y conceder permisos.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
