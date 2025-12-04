'use client'

import React from "react";

/**
 * Simple responsive bar chart using SVG.
 * `data` = [{ label: '1', value: 5 }, ...]
 */
export default function BarChart({ data, height = 160 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const padding = 12;
  const bars = data.length;
  const barGap = 8;
  const barWidth = Math.max(8, Math.floor(( (600 - padding * 2) - (bars - 1) * barGap) / bars ));

  // We'll make the chart responsive using viewBox (width value used only for internal math)
  const svgWidth = Math.max(300, bars * (barWidth + barGap) + padding * 2);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${svgWidth} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto">
        {/* bg */}
        <rect x="0" y="0" width={svgWidth} height={height} fill="transparent" />
        {/* horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding + (height - padding * 2) * (1 - t);
          return <line key={i} x1={padding} x2={svgWidth - padding} y1={y} y2={y} stroke="#e6e6e6" strokeWidth={1} />;
        })}
        {/* bars */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + barGap);
          const h = ((d.value / max) * (height - padding * 2));
          const y = padding + (height - padding * 2) - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={4}
                fill="#111827" /* primary dark color (gray-900) for minimal look */
                opacity={0.95}
              />
              <text x={x + barWidth / 2} y={height - padding + 12} fontSize={10} textAnchor="middle" fill="#6b7280">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
