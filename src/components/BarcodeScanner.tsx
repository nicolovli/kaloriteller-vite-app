// src/components/BarcodeScanner.tsx
import BarcodeScannerComponent from "react-qr-barcode-scanner";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onCancel: () => void;
}

export default function BarcodeScanner({ onDetected, onCancel }: BarcodeScannerProps) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Skann strekkode</h3>

      <BarcodeScannerComponent
        width={300}
        height={300}
        onUpdate={(_, result) => {
          if (result) {
            onDetected(result.getText());
          }
        }}
      />

      <button onClick={onCancel} style={{ marginTop: "1rem" }}>
        Avbryt
      </button>
    </div>
  );
}
