import React, { useEffect, useState } from "react";

interface SesiLogoProps {
  className?: string;
  variant?: "color" | "white";
  customLogoUrl?: string | null;
}

export const SesiLogo: React.FC<SesiLogoProps> = ({ 
  className = "h-8", 
  variant = "color",
  customLogoUrl
}) => {
  const [pngDataUrl, setPngDataUrl] = useState<string>("");

  useEffect(() => {
    if (customLogoUrl) return;

    // Generate high-resolution PNG raster image for standard SESI logo
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const blueColor = variant === "color" ? "#0038A8" : "#FFFFFF";
      const greenColor = "#58B947";

      const svgString = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 100' width='640' height='200'>
        <g transform='skewX(-14)'>
          <path d='M 62 14 C 38 14 18 25 18 43 C 18 60 36 63 52 67 C 63 70 70 72 70 78 C 70 83 61 86 48 86 C 33 86 21 82 8 74 L 0 88 C 16 97 35 101 52 101 C 80 101 100 89 100 70 C 100 52 80 48 64 44 C 52 41 46 39 46 33 C 46 28 55 26 66 26 C 79 26 91 30 102 36 L 110 21 C 96 16 80 14 62 14 Z' fill='${blueColor}'/>
          <path d='M 112 16 L 168 16 L 162 31 L 132 31 L 128 47 L 158 47 L 152 61 L 124 61 L 118 80 L 154 80 L 148 95 L 90 95 Z' fill='${blueColor}'/>
          <path d='M 202 14 C 178 14 158 25 158 43 C 158 60 176 63 192 67 C 203 70 210 72 210 78 C 210 83 201 86 188 86 C 173 86 161 82 148 74 L 140 88 C 156 97 175 101 192 101 C 220 101 240 89 240 70 C 240 52 220 48 204 44 C 192 41 186 39 186 33 C 186 28 195 26 206 26 C 219 26 231 30 242 36 L 250 21 C 236 16 220 14 202 14 Z' fill='${blueColor}'/>
          <path d='M 232 38 L 256 38 L 241 95 L 217 95 Z' fill='${blueColor}'/>
          <path d='M 238 16 L 260 16 L 254 32 L 232 32 Z' fill='${greenColor}'/>
        </g>
      </svg>`;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL("image/png");
        setPngDataUrl(png);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [variant, customLogoUrl]);

  if (customLogoUrl) {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src={customLogoUrl}
          alt="Logo Personalizada"
          className="h-full w-auto object-contain select-none max-h-12"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      {pngDataUrl ? (
        <img
          src={pngDataUrl}
          alt="Logo SESI"
          className="h-full w-auto object-contain select-none"
        />
      ) : (
        <div className="h-full w-20 bg-slate-300/30 animate-pulse rounded" />
      )}
    </div>
  );
};

export default SesiLogo;
