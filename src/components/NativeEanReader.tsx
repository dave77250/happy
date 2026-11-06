imimport React, { useEffect, useRef, useState } from 'react';

// BarcodeDetector n'est pas encore dans lib.dom.d.ts : types minimaux
interface DetectedBarcode {
  rawValue: string;
  format: string;
}

interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats(): Promise<string[]>;
}

type WindowWithBarcodeDetector = Window & {
  BarcodeDetector?: BarcodeDetectorConstructor;
};

export interface NativeEanReaderProps {
  /** Appelé une seule fois, avec le premier EAN-13 détecté. */
  onScan: (barcode: string) => void;
  /** Appelé en cas d'erreur (API non supportée, caméra inaccessible...). */
  onError?: (message: string) => void;
}

export default function NativeEanReader({ onScan, onError }: NativeEanReaderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs pour que le changement de callbacks ne relance pas la caméra
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onScanRef.current = onScan;
    onErrorRef.current = onError;
  }, [onScan, onError]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;
    let stopped = false;

    const stop = () => {
      stopped = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    };

    const fail = (message: string) => {
      setError(message);
      onErrorRef.current?.(message);
    };

    const startScanner = async () => {
      const Detector = (window as WindowWithBarcodeDetector).BarcodeDetector;
      if (!Detector) {
        fail("L'API BarcodeDetector n'est pas supportée par ce navigateur. Utilisez de préférence Google Chrome.");
        return;
      }

      try {
        const supportedFormats = await Detector.getSupportedFormats();
        if (!supportedFormats.includes('ean_13')) {
          fail("Le format EAN-13 n'est pas supporté par ce navigateur.");
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        // Le composant a pu être démonté pendant l'attente
        if (stopped) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = mediaStream;

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = mediaStream;
        await video.play();

        const detector = new Detector({ formats: ['ean_13'] });

        const detectLoop = async () => {
          if (stopped) return;

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(video);
              if (stopped) return;

              if (barcodes.length > 0) {
                const value = barcodes[0].rawValue;
                stop(); // coupe la boucle et la caméra
                onScanRef.current(value);
                return;
              }
            } catch (err) {
              console.error('Erreur lors de la détection du code-barres :', err);
            }
          }

          animationFrameId = requestAnimationFrame(detectLoop);
        };

        void detectLoop();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        fail("Impossible d'accéder à la caméra : " + message);
      }
    };

    void startScanner();

    return stop;
  }, []);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div
        style={{
          margin: '20px auto',
          maxWidth: '400px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <video ref={videoRef} style={{ width: '100%', display: 'block' }} muted playsInline />
      </div>

      <p style={{ color: '#666' }}>Pointez votre caméra vers un code-barres EAN-13...</p>
    </div>
  );
}port React, { useEffect, useRef, useSt


