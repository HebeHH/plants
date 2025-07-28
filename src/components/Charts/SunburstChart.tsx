import React, { useState, useRef } from 'react';
import { SunburstNode } from '@/types';
import { PIE_COLORS } from '@/constants/colors';

interface SunburstChartProps {
  data: SunburstNode[];
  width?: number;
  height?: number;
}

export const SunburstChart: React.FC<SunburstChartProps> = ({ 
  data, 
  width = 800, 
  height = 700 
}) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const centerX = width / 2;
  const centerY = height / 2;
  const innerRadius = 50;
  const ringWidth = 90;

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex justify-center">
        <svg width={width} height={height}>
          <text x={centerX} y={centerY} textAnchor="middle" className="text-gray-500">
            No valid taxonomic data available
          </text>
        </svg>
      </div>
    );
  }

  // Helper function to create SVG path for arc
  const createArc = (innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + innerR * Math.cos(startAngleRad);
    const y1 = centerY + innerR * Math.sin(startAngleRad);
    const x2 = centerX + outerR * Math.cos(startAngleRad);
    const y2 = centerY + outerR * Math.sin(startAngleRad);
    
    const x3 = centerX + outerR * Math.cos(endAngleRad);
    const y3 = centerY + outerR * Math.sin(endAngleRad);
    const x4 = centerX + innerR * Math.cos(endAngleRad);
    const y4 = centerY + innerR * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  };

  // Mouse event handlers for zoom/pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.3, Math.min(3, transform.scale * delta));
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Calculate total for angle distribution
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  interface Segment {
    path: string;
    fill: string;
    opacity: number;
    level: string;
    name: string;
    value: number;
  }

  interface Label {
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fill: string;
    fontWeight: string;
  }

  const segments: Segment[] = [];
  const labels: Label[] = [];

  // Create segments for each ring
  data.forEach((cladeData, cladeIndex) => {
    const cladeAngle = (cladeData.value / total) * 360;
    const cladeColor = PIE_COLORS[cladeIndex % PIE_COLORS.length];
    
    // Clade ring (innermost)
    segments.push({
      path: createArc(innerRadius, innerRadius + ringWidth, currentAngle, currentAngle + cladeAngle),
      fill: cladeColor,
      opacity: 1,
      level: 'clade',
      name: cladeData.name,
      value: cladeData.value
    });

    // Add clade label
    const cladeMidAngle = currentAngle + cladeAngle / 2;
    const cladeLabelRadius = innerRadius + ringWidth / 2;
    const cladeLabelX = centerX + cladeLabelRadius * Math.cos((cladeMidAngle - 90) * Math.PI / 180);
    const cladeLabelY = centerY + cladeLabelRadius * Math.sin((cladeMidAngle - 90) * Math.PI / 180);
    
    if (cladeAngle > 15) { // Only show label if segment is large enough
      labels.push({
        x: cladeLabelX,
        y: cladeLabelY,
        text: cladeData.name,
        fontSize: 14,
        fill: '#fff',
        fontWeight: 'bold'
      });
    }

    // Orders ring
    let orderStartAngle = currentAngle;
    if (cladeData.children) {
      cladeData.children.forEach((orderData) => {
        const orderAngle = (orderData.value / cladeData.value) * cladeAngle;
        const orderColor = cladeColor;
        
        segments.push({
          path: createArc(innerRadius + ringWidth, innerRadius + 2 * ringWidth, orderStartAngle, orderStartAngle + orderAngle),
          fill: orderColor,
          opacity: 0.8,
          level: 'order',
          name: orderData.name,
          value: orderData.value
        });

        // Add order label
        const orderMidAngle = orderStartAngle + orderAngle / 2;
        const orderLabelRadius = innerRadius + 1.5 * ringWidth;
        const orderLabelX = centerX + orderLabelRadius * Math.cos((orderMidAngle - 90) * Math.PI / 180);
        const orderLabelY = centerY + orderLabelRadius * Math.sin((orderMidAngle - 90) * Math.PI / 180);
        
        if (orderAngle > 12) {
          labels.push({
            x: orderLabelX,
            y: orderLabelY,
            text: orderData.name.length > 12 ? orderData.name.substring(0, 12) + '...' : orderData.name,
            fontSize: 11,
            fill: '#fff',
            fontWeight: 'normal'
          });
        }

        // Families ring
        let familyStartAngle = orderStartAngle;
        if (orderData.children) {
          orderData.children.forEach((familyData) => {
            const familyAngle = (familyData.value / orderData.value) * orderAngle;
            const familyColor = orderColor;
            
            segments.push({
              path: createArc(innerRadius + 2 * ringWidth, innerRadius + 3 * ringWidth, familyStartAngle, familyStartAngle + familyAngle),
              fill: familyColor,
              opacity: 0.6,
              level: 'family',
              name: familyData.name,
              value: familyData.value
            });

            // Add family label for larger segments
            if (familyAngle > 8) {
              const familyMidAngle = familyStartAngle + familyAngle / 2;
              const familyLabelRadius = innerRadius + 2.5 * ringWidth;
              const familyLabelX = centerX + familyLabelRadius * Math.cos((familyMidAngle - 90) * Math.PI / 180);
              const familyLabelY = centerY + familyLabelRadius * Math.sin((familyMidAngle - 90) * Math.PI / 180);
              
              labels.push({
                x: familyLabelX,
                y: familyLabelY,
                text: familyData.name.length > 8 ? familyData.name.substring(0, 8) + '...' : familyData.name,
                fontSize: 9,
                fill: '#fff',
                fontWeight: 'normal'
              });
            }

            // Genera ring
            let genusStartAngle = familyStartAngle;
            if (familyData.children) {
              familyData.children.forEach((genusData) => {
                const genusAngle = (genusData.value / familyData.value) * familyAngle;
                const genusColor = familyColor;
                
                segments.push({
                  path: createArc(innerRadius + 3 * ringWidth, innerRadius + 4 * ringWidth, genusStartAngle, genusStartAngle + genusAngle),
                  fill: genusColor,
                  opacity: 0.4,
                  level: 'genus',
                  name: genusData.name,
                  value: genusData.value
                });

                genusStartAngle += genusAngle;
              });
            }

            familyStartAngle += familyAngle;
          });
        }

        orderStartAngle += orderAngle;
      });
    }

    currentAngle += cladeAngle;
  });

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-lg p-2 flex items-center space-x-4">
          <button
            onClick={resetView}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Reset View
          </button>
          <span className="text-sm text-gray-600">
            Scroll to zoom • Drag to pan • Scale: {transform.scale.toFixed(1)}x
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden border border-gray-200 rounded-lg bg-white">
        <svg 
          ref={svgRef}
          width="100%" 
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`cursor-${isDragging ? 'grabbing' : 'grab'}`}
          style={{ userSelect: 'none' }}
        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.fill}
                opacity={segment.opacity}
                stroke="#fff"
                strokeWidth="1"
                className="hover:opacity-100 transition-opacity"
              >
                <title>{`${segment.level}: ${segment.name} (${segment.value} species)`}</title>
              </path>
            ))}
            
            {labels.map((label, index) => (
              <text
                key={index}
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={label.fontSize}
                fill={label.fill}
                fontWeight={label.fontWeight}
                className="pointer-events-none"
              >
                {label.text}
              </text>
            ))}

            <text
              x={centerX}
              y={centerY - 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#374151"
            >
              Taxonomy
            </text>
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#6b7280"
            >
              {total} species
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#9ca3af"
            >
              4 taxonomic levels
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};