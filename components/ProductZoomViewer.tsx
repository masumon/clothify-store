"use client";

import { useRef, useState } from "react";

type Props = {
  imageUrl: string;
  productName: string;
};

export default function ProductZoomViewer({ imageUrl, productName }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const startRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
        lastPositionRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    lastPositionRef.current = { x: 0, y: 0 };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale === 1) return;
    setDragging(true);
    startRef.current = {
      x: e.clientX - lastPositionRef.current.x,
      y: e.clientY - lastPositionRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || scale === 1) return;

    const newPosition = {
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    };

    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setDragging(false);
    lastPositionRef.current = position;
  };

  const handleMouseLeave = () => {
    setDragging(false);
    lastPositionRef.current = position;
  };

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={productName}
            draggable={false}
            className="h-full w-full object-cover select-none transition-transform duration-150"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default",
              transformOrigin: "center center",
            }}
          />
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 p-2 shadow">
          <button
            type="button"
            onClick={zoomOut}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-slate-800"
          >
            -
          </button>

          <button
            type="button"
            onClick={resetZoom}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={zoomIn}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-slate-800"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Use + / - to zoom. When zoomed in, drag the image to inspect fabric details.
      </p>
    </div>
  );
}
