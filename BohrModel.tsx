import { Element } from '@/data/elements';

interface BohrModelProps {
  element: Element;
  size?: number;
  showLabels?: boolean;
}

export const BohrModel: React.FC<BohrModelProps> = ({ element, size = 200, showLabels = true }) => {
  const { shells, number, symbol } = element;
  const center = size / 2;
  
  // Dynamic sizing based on number of shells
  const numShells = shells.length;
  const nucleusRadius = Math.max(size * 0.08, 12);
  const electronRadius = Math.max(size * 0.018, 3);
  
  // Calculate shell radii with proper spacing
  const minShellRadius = nucleusRadius + 12;
  const maxShellRadius = (size / 2) - electronRadius - 4;
  const shellSpacing = numShells > 1 
    ? (maxShellRadius - minShellRadius) / (numShells - 1) 
    : 0;
  
  const shellRadii = shells.map((_, i) => minShellRadius + shellSpacing * i);

  // Calculate protons and neutrons
  const protons = number;
  const neutrons = Math.max(0, Math.round(element.atomic_mass) - protons);

  // Generate unique gradient ID to avoid conflicts
  const gradientId = `nucleusGradient-${element.number}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`} 
      className="mx-auto block"
      style={{ minWidth: size, minHeight: size }}
    >
      {/* Definitions */}
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <filter id={`shadow-${element.number}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* Background circle */}
      <circle 
        cx={center} 
        cy={center} 
        r={center - 2} 
        fill="#f8fafc" 
        stroke="#e2e8f0" 
        strokeWidth="1.5" 
      />
      
      {/* Shell orbits - Draw these first so they're behind electrons */}
      {shells.map((_, shellIndex) => {
        const radius = shellRadii[shellIndex];
        return (
          <circle
            key={`orbit-${shellIndex}`}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        );
      })}
      
      {/* Nucleus */}
      <circle 
        cx={center} 
        cy={center} 
        r={nucleusRadius} 
        fill={`url(#${gradientId})`}
        filter={`url(#shadow-${element.number})`}
      />
      
      {/* Nucleus symbol */}
      <text 
        x={center} 
        y={center + (showLabels ? -1 : 2)} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="white" 
        fontSize={Math.max(nucleusRadius * 0.8, 8)} 
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {symbol}
      </text>
      
      {/* Proton/Neutron count in nucleus */}
      {showLabels && size >= 120 && (
        <text 
          x={center} 
          y={center + nucleusRadius * 0.6} 
          textAnchor="middle" 
          fill="rgba(255,255,255,0.9)" 
          fontSize={Math.max(nucleusRadius * 0.35, 6)}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {protons}p⁺ {neutrons}n⁰
        </text>
      )}
      
      {/* Electrons on each shell */}
      {shells.map((electronCount, shellIndex) => {
        const radius = shellRadii[shellIndex];
        const electrons = [];
        
        // Calculate electron positions evenly distributed
        for (let i = 0; i < electronCount; i++) {
          // Start from top (-90 degrees) and distribute evenly
          const angle = (i * 2 * Math.PI) / electronCount - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          
          electrons.push(
            <g key={`electron-${shellIndex}-${i}`}>
              {/* Electron glow */}
              <circle
                cx={x}
                cy={y}
                r={electronRadius + 1}
                fill="rgba(59, 130, 246, 0.3)"
              />
              {/* Electron */}
              <circle
                cx={x}
                cy={y}
                r={electronRadius}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={Math.max(electronRadius * 0.3, 0.5)}
              />
            </g>
          );
        }
        
        return (
          <g key={`shell-${shellIndex}`}>
            {/* Shell number label */}
            {showLabels && size >= 140 && (
              <g>
                <rect
                  x={center + radius - 12}
                  y={center - radius - 6}
                  width={16}
                  height={12}
                  rx={3}
                  fill="white"
                  stroke="#e2e8f0"
                  strokeWidth={0.5}
                />
                <text
                  x={center + radius - 4}
                  y={center - radius + 3}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={7}
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {electronCount}e⁻
                </text>
              </g>
            )}
            {/* Electrons */}
            {electrons}
          </g>
        );
      })}
      
      {/* Element info labels */}
      {showLabels && size >= 140 && (
        <>
          {/* Atomic number */}
          <text 
            x={8} 
            y={14} 
            fill="#64748b" 
            fontSize={9}
            fontWeight="600"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Z = {number}
          </text>
          
          {/* Total electrons */}
          <text 
            x={size - 8} 
            y={size - 8} 
            textAnchor="end" 
            fill="#64748b" 
            fontSize={9}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {shells.length} shell{shells.length > 1 ? 's' : ''}
          </text>
        </>
      )}
    </svg>
  );
};
