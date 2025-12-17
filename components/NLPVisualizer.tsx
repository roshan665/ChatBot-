import React, { useEffect, useRef } from 'react';
import { Cpu } from 'lucide-react';

interface NLPVisualizerProps {
  isProcessing: boolean;
  steps: any[]; // Kept for compatibility but unused
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
}

const NLPVisualizer: React.FC<NLPVisualizerProps> = ({ isProcessing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    const layers = 5;
    const nodesPerLayer = 6;
    let pulseTime = 0;

    // Initialize nodes
    const initNodes = () => {
        nodes = [];
        const width = canvas.width;
        const height = canvas.height;
        const layerWidth = width / (layers + 1);

        for (let l = 1; l <= layers; l++) {
            for (let i = 0; i < nodesPerLayer; i++) {
                nodes.push({
                    x: (l * layerWidth) + (Math.random() * 20 - 10),
                    y: (height / (nodesPerLayer + 1)) * (i + 1) + (Math.random() * 40 - 20),
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    layer: l
                });
            }
        }
    };

    const draw = () => {
        if (!canvas || !ctx) return;
        ctx.fillStyle = '#111827'; // bg-gray-900
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update node positions slightly
        nodes.forEach(node => {
            if(isProcessing) {
                node.x += node.vx;
                node.y += node.vy;
                // Bounce margins loosely
                if (Math.random() < 0.05) { node.vx = -node.vx; node.vy = -node.vy; }
            }
        });

        // Draw connections
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                
                // Only connect adjacent layers
                if (Math.abs(n1.layer - n2.layer) === 1) {
                    const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                    if (dist < 150) {
                        const alpha = isProcessing 
                            ? 0.1 + (Math.sin(pulseTime + n1.layer) + 1) * 0.2 // Pulsing effect
                            : 0.05;
                            
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue-500
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();

                        // Sending signals effect
                        if (isProcessing && Math.random() > 0.95) {
                            ctx.fillStyle = '#60A5FA'; // Blue-400
                            const t = (pulseTime * 2) % 1;
                            const sx = n1.x + (n2.x - n1.x) * t;
                            const sy = n1.y + (n2.y - n1.y) * t;
                            ctx.beginPath();
                            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
        }

        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = isProcessing ? '#3B82F6' : '#374151'; // Blue-500 or Gray-700
            ctx.fill();
            
            if (isProcessing) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(pulseTime * 5) * 0.2})`;
                ctx.stroke();
            }
        });

        if (isProcessing) {
            pulseTime += 0.05;
        }

        animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            initNodes();
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    draw();

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isProcessing]);

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800 overflow-hidden relative">
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2 text-green-400">
        <Cpu className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : 'text-gray-600'}`} />
        <span className={`font-bold tracking-wider text-xs ${isProcessing ? '' : 'text-gray-600'}`}>
            {isProcessing ? 'NEURAL ENGINE ACTIVE' : 'NEURAL ENGINE STANDBY'}
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default NLPVisualizer;