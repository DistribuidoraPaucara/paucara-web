import Resizer from 'react-image-file-resizer';

export type ResizeOptions = {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 1-100
  format?: 'JPEG' | 'PNG' | 'WEBP';
};

// ============ Camera helpers ============
export type CameraConstraints = MediaStreamConstraints;

export async function openCameraStream(constraints?: CameraConstraints): Promise<MediaStream> {
  const defaultConstraints: MediaStreamConstraints = {
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  };
  const finalConstraints = constraints ?? defaultConstraints;
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error('getUserMedia no está disponible en este navegador / contexto.');
  }
  return await navigator.mediaDevices.getUserMedia(finalConstraints);
}

export function stopStream(stream: MediaStream | null | undefined): void {
  if (!stream) {
    return;
  }
  try {
    stream.getTracks().forEach((t) => t.stop());
  } catch {
    // ignore
  }
}

export function captureFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  mime: string = 'image/jpeg',
  quality: number = 0.92
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(mime, quality);
}

export function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// ============ Resize helpers ============
export async function resizeToUnder1MB(file: File, opts: Partial<ResizeOptions> = {}): Promise<File> {
  const options: ResizeOptions = {
    maxWidth: opts.maxWidth ?? 1280,
    maxHeight: opts.maxHeight ?? 1280,
    quality: opts.quality ?? 85,
    format: opts.format ?? 'JPEG',
  };

  // If already < 1MB, return as is
  if (file.size < 1024 * 1024) {
    return file;
  }

  // Helper to run the resizer
  const doResize = (quality: number, maxW: number, maxH: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      try {
        Resizer.imageFileResizer(
          file,
          maxW,
          maxH,
          options.format!,
          quality,
          0,
          (uri) => {
            if (uri instanceof Blob) {
              const result = new File([uri], file.name.replace(/\.[^.]+$/, '.jpg'), { type: uri.type });
              resolve(result);
            } else if (typeof uri === 'string') {
              // Convert dataURL to File
              const arr = uri.split(',');
              const mimeMatch = arr[0].match(/:(.*?);/);
              const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              const result = new File([u8arr], file.name.replace(/\.[^.]+$/, '.jpg'), { type: mime });
              resolve(result);
            } else {
              reject(new Error('Unknown resized data type'));
            }
          },
          'base64'
        );
      } catch (e) {
        reject(e);
      }
    });
  };

  // Iteratively try to bring under 1MB by decreasing quality and dimensions
  let quality = options.quality;
  let width = options.maxWidth;
  let height = options.maxHeight;

  for (let i = 0; i < 6; i++) {
    const out = await doResize(quality, width, height);
    if (out.size < 1024 * 1024) {
      return out;
    }
    // reduce for next iteration
    quality = Math.max(40, Math.floor(quality - 15));
    width = Math.floor(width * 0.85);
    height = Math.floor(height * 0.85);
  }

  // Final attempt at very low quality
  const finalTry = await doResize(40, Math.floor(width * 0.85), Math.floor(height * 0.85));
  return finalTry;
}

export async function ensureUnder1MB(file: File, opts?: Partial<ResizeOptions>): Promise<File> {
  try {
    return await resizeToUnder1MB(file, opts);
  } catch {
    return file;
  }
}

// Export default service object
const imageService = {
  // Camera helpers
  openCameraStream,
  stopStream,
  captureFromVideo,
  dataURLToFile,

  // Resize helpers
  resizeToUnder1MB,
  ensureUnder1MB,
};

export default imageService;
