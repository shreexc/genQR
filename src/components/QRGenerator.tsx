"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { parse } from "path";

export default function QRgen() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const [error, setError] = useState("");

  const genQR = async () => {
    setError("");

    if (!url.trim()) {
      setError("Enter something IDIOT");
      return;
    }
    try {
      const cleanURL = url.trim();
      if (!cleanURL) {
        throw new Error("Enter something IDIOT");
      }

      const pngDataURL = await QRCode.toDataURL(cleanURL, {
        width: 500,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      const svg = await QRCode.toString(cleanURL, {
        type: "svg",
        width: 400,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      setQrCode(pngDataURL);
      setSvgCode(svg);
    } catch (error) {
      setError("error generating a QR");
      setQrCode(null);
      setSvgCode(null);
    }
  };

  const downloadPNG = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSVG = () => {
    if (!svgCode) return;

    const blob = new Blob([svgCode], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    document.body.appendChild(link);

    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      genQR();
    }
  };

  return (
    <div className="qr-container">
      <div className="qr-card">
        <h1>QR Code Generator</h1>
        <br />
        <br />
        <div className="qr-form">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: https://shreejalshah.com.np"
          />

          {error && <p className="error">{error}</p>}

          <button onClick={genQR}>Generate QR Code</button>
        </div>

        {qrCode && (
          <div className="qr-result">
            <div className="qr-preview">
              <img src={qrCode} alt="Generated QR code" />
            </div>

            <div className="download-buttons">
              <button onClick={downloadPNG}>Download PNG</button>

              <button onClick={downloadSVG}>Download SVG</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
