'use client'

import React from "react";

interface ChartData {
  label: string;
  value: number;
  revenue: number;
}

interface BarChartProps {
  data: ChartData[];
  height?: number;
}

export default function BarChart({ data, height = 240 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No chart data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.revenue / 100)), 1);
  const padding = 40;
  const bars = data.length;
  const barGap = 4;
  const availableWidth = 600 - padding * 2;
  const barWidth = Math.max(6, Math.floor((availableWidth - (bars - 1) * barGap) / bars));
  const svgWidth = Math.max(300, bars * (barWidth + barGap) + padding * 2);
  
  // Calculate max for revenue scaling
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="relative w-full">
      <svg 
        viewBox={`0 0 ${svgWidth} ${height}`} 
        preserveAspectRatio="xMidYMid meet" 
        className="w-full h-auto"
      >
        {/* Background */}
        <rect x="0" y="0" width={svgWidth} height={height} fill="#f9fafb" rx="8" />
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding + (height - padding * 2) * (1 - t);
          const value = Math.round(maxValue * t);
          return (
            <g key={i}>
              <line 
                x1={padding - 10} 
                x2={svgWidth - padding} 
                y1={y} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
              <text 
                x={padding - 15} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="10" 
                fill="#6b7280"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {value}
              </text>
            </g>
          );
        })}
        
        {/* X-axis line */}
        <line 
          x1={padding} 
          x2={svgWidth - padding} 
          y1={height - padding} 
          y2={height - padding} 
          stroke="#374151" 
          strokeWidth="1.5"
        />
        
        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + barGap);
          const barHeight = ((d.value / maxValue) * (height - padding * 2)) * 0.8;
          const revenueHeight = ((d.revenue / maxRevenue) * (height - padding * 2)) * 0.8;
          const yBar = height - padding - barHeight;
          const yRevenue = height - padding - revenueHeight;
          
          // Gradient for bars
          const gradientId = `gradient-${i}`;
          
          return (
            <g key={i}>
              {/* Revenue bar (background) */}
              <rect
                x={x}
                y={yRevenue}
                width={barWidth}
                height={revenueHeight}
                rx="3"
                fill="url(#revenueGradient)"
                opacity="0.6"
              />
              
              {/* Orders bar (foreground) */}
              <rect
                x={x}
                y={yBar}
                width={barWidth}
                height={barHeight}
                rx="3"
                fill="url(#ordersGradient)"
                className="hover:opacity-90 transition-opacity"
              />
              
              {/* Tooltip area */}
              <rect
                x={x - 5}
                y="0"
                width={barWidth + 10}
                height={height}
                fill="transparent"
                onMouseEnter={(e) => {
                  const tooltip = document.getElementById(`tooltip-${i}`);
                  if (tooltip) {
                    tooltip.classList.remove('hidden');
                    const rect = e.currentTarget.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.top}px`;
                  }
                }}
                onMouseLeave={() => {
                  const tooltip = document.getElementById(`tooltip-${i}`);
                  if (tooltip) tooltip.classList.add('hidden');
                }}
              />
              
              {/* Date label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 16}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="500"
              >
                {d.label}
              </text>
              
              {/* Orders value label */}
              {barHeight > 20 && (
                <text
                  x={x + barWidth / 2}
                  y={yBar - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#111827"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="600"
                >
                  {Math.round(d.value)}
                </text>
              )}
              
              {/* Invisible tooltip element */}
              <foreignObject id={`tooltip-${i}`} className="hidden">
                <div className="absolute transform -translate-x-1/2 -translate-y-full -mt-2">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                    <div className="font-semibold">Day {d.label}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Orders: {Math.round(d.value)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Revenue: Rs. {Math.round(d.revenue).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </foreignObject>
            </g>
          );
        })}
        
        {/* Gradients */}
        <defs>
          <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        
        {/* Legend */}
        <g transform={`translate(${svgWidth - padding - 120}, ${padding - 20})`}>
          <rect x="0" y="0" width="120" height="40" fill="white" rx="6" opacity="0.9" />
          <g transform="translate(10, 12)">
            <g>
              <rect x="0" y="0" width="12" height="12" rx="2" fill="url(#ordersGradient)" />
              <text x="18" y="10" fontSize="11" fill="#374151" fontFamily="system-ui, -apple-system, sans-serif">
                Orders
              </text>
            </g>
            <g transform="translate(0, 18)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="url(#revenueGradient)" opacity="0.6" />
              <text x="18" y="10" fontSize="11" fill="#374151" fontFamily="system-ui, -apple-system, sans-serif">
                Revenue
              </text>
            </g>
          </g>
        </g>
      </svg>
      
      {/* CSS for tooltips */}
      <style jsx>{`
        .tooltip {
          position: fixed;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>
    </div>
  );
}