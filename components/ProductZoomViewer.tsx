"use client";

import Image from "next/image";
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

  const pinchStartDistanceRef = useRef(0);
  const pinchStartScaleRef = useRef(1);
  const lastTouchRef = useRef({ x: 0, y: 0 });

  const clampScale = (value: number) => Math.min(Math.max(value, 1), 5);

  const zoomIn = () => {
    setScale((prev) => clampScale(prev + 0.5));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = clampScale(prev - 0.5);
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

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(e.touches);
      pinchStartScaleRef.current = scale;
      return;
    }

    if (e.touches.length === 1 && scale > 1) {
      lastTouchRef.current = {
        x: e.touches[0].clientX - lastPositionRef.current.x,
        y: e.touches[0].clientY - lastPositionRef.current.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      const currentDistance = getTouchDistance(e.touches);
      const ratio = currentDistance / pinchStartDistanceRef.current;
      const nextScale = clampScale(pinchStartScaleRef.current * ratio);

      setScale(nextScale);

      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
        lastPositionRef.current = { x: 0, y: 0 };
      }

      return;
    }

    if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();

      const newPosition = {
        x: e.touches[0].clientX - lastTouchRef.current.x,
        y: e.touches[0].clientY - lastTouchRef.current.y,
      };

      setPosition(newPosition);
    }
  };

  const handleTouchEnd = () => {
    lastPositionRef.current = position;
  };

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            draggable={false}
            className="select-none object-cover transition-transform duration-100"
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
        Use + / - to zoom. On mobile, use two fingers to pinch zoom and drag to inspect fabric details.
      </p>
    </div>
  );
}
