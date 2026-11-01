import React, { useEffect, useRef, useState } from 'react';

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let animationFrameId = null;

    const startScanner = async () => {
      // 1. Vérifier si l'API BarcodeDetector est supportée par le navigateur
      if (!('BarcodeDetector' in window)) {
        setError("L'API BarcodeDetector n'est pas supportée par ce navigateur. Utilisez de préférence Google Chrome.");
        return;
      }

      try {
        // 2. Demander l'accès à la caméra (caméra arrière de préférence sur mobile)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // 3. Initialiser le détecteur avec les formats souhaités
        const supportedFormats = await window.BarcodeDetector.getSupportedFormats();
        console.p('Formats supportés :', supportedFormats);

        const barcodeDetector = new window.BarcodeDetector({
          formats: ['code_128', 'ean_13', 'ean_8', 'qr_code', 'upc_a']
        });

        // 4. Boucle de détection continue avec requestAnimationFrame
        const detectLoop = async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                // On récupère la valeur du premier code-barres détecté
                setScannedData(barcodes[0].rawValue);
                
                // Optionnel : vous pouvez arrêter la boucle ou le flux ici si vous n'avez besoin que d'un scan unique
              }
            } catch (err) {
              console.error('Erreur lors de la détection du code-barres :', err);
            }
          }
          animationFrameId = requestAnimationFrame(detectLoop);
        };

        detectLoop();

      } catch (err) {
        setError("Impossible d'accéder à la caméra : " + err.message);
      }
    };

    startScanner();

    // Nettoyage à la destruction du composant (couper la caméra et stopper la boucle)
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Scanner de Code-Barres Natif (Web)</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ margin: '20px auto', maxWidth: '400px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
        <video 
          ref={videoRef} 
          style={{ width: '100%', display: 'block' }} 
          muted 
          playsInline 
        />
      </div>

      {scannedData ? (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '5px', display: 'inline-block' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Code scanné avec succès !</h3>
          <p style={{ fontSize: '1.4em', fontWeight: 'bold', margin: 0 }}>{scannedData}</p>
        </div>
      ) : (
        <p style={{ color: '#666' }}>Pointez votre caméra vers un code-barres...</p>
      )}
    </div>
  );
}