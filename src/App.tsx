import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Code2, 
  Palette, 
  Globe, 
  Cpu, 
  Zap, 
  Layers, 
  GitBranch, 
  Terminal,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Sparkles,
  Hexagon,
  Binary,
  CircuitBoard,
  Box,
  Layout,
  FileCode,
  Command,
  RotateCcw,
  Eye,
  Star,
  Trophy,
  Rocket,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// ============================================
// INTERACTIVE COMPONENTS
// ============================================

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animate);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 hidden md:block ${
          isHovering ? 'w-16 h-16' : 'w-8 h-8'
        } ${isClicking ? 'scale-75' : 'scale-100'}`}
        style={{ mixBlendMode: 'difference' }}
      >
        <div className={`w-full h-full rounded-full border-2 border-cyan-400 transition-all duration-200 ${
          isHovering ? 'bg-cyan-400/20' : 'bg-transparent'
        }`} />
      </div>
      <div 
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full hidden md:block"
      />
    </>
  );
};

// Scroll Progress Indicator
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100]">
      <div 
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; pulse: number }[] = [];
    const particleCount = 100;
    const colors = ['#00d4ff', '#a855f7', '#00ff88', '#ff00ff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.pulse += 0.02;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect particles with gradient lines
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
            gradient.addColorStop(0, particle.color + '40');
            gradient.addColorStop(1, other.color + '40');
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 * (1 - distance / 120);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// Binary Rain Component
const BinaryRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 15);
    const drops: number[] = new Array(columns).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 212, 255, 0.25)';
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 15;
        const y = drops[i] * 15;
        
        // Random brightness for each character
        const brightness = Math.random();
        ctx.fillStyle = `rgba(0, 212, 255, ${0.1 + brightness * 0.3})`;
        
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

// Typing Effect Component
const TypingEffect = ({ text, speed = 80, className = '' }: { text: string; speed?: number; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className}>
      {displayText}
      <span className={`inline-block w-0.5 h-5 bg-cyan-400 ml-1 align-middle transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
};

// ============================================
// CREATIVE SKILL CONSTELLATION
// ============================================

const SkillConstellation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const skillNodes = [
    // Center - Core
    { id: 'core', name: 'Frontend', x: 50, y: 50, size: 80, color: '#00d4ff', icon: Code2, category: 'core' },
    
    // Coding Skills - Orbiting
    { id: 'react', name: 'React', x: 25, y: 25, size: 60, color: '#61dafb', icon: Code2, category: 'coding', level: 95 },
    { id: 'js', name: 'JavaScript', x: 75, y: 20, size: 55, color: '#f7df1e', icon: Terminal, category: 'coding', level: 90 },
    { id: 'tailwind', name: 'Tailwind', x: 80, y: 50, size: 50, color: '#38bdf8', icon: Palette, category: 'coding', level: 92 },
    { id: 'git', name: 'Git', x: 70, y: 75, size: 45, color: '#f05032', icon: GitBranch, category: 'coding', level: 85 },
    { id: 'typescript', name: 'TypeScript', x: 30, y: 80, size: 50, color: '#3178c6', icon: FileCode, category: 'coding', level: 88 },
    
    // No-Code Skills - Outer Orbit
    { id: 'bubble', name: 'Bubble.io', x: 15, y: 50, size: 55, color: '#0d47ff', icon: Box, category: 'nocode', level: 87 },
    { id: 'webflow', name: 'Webflow', x: 50, y: 15, size: 50, color: '#4353ff', icon: Layout, category: 'nocode', level: 82 },
    { id: 'wordpress', name: 'WordPress', x: 85, y: 35, size: 48, color: '#21759b', icon: Globe, category: 'nocode', level: 80 },
  ];

  const connections = [
    ['core', 'react'], ['core', 'js'], ['core', 'tailwind'], ['core', 'git'], ['core', 'typescript'],
    ['core', 'bubble'], ['core', 'webflow'], ['core', 'wordpress'],
    ['react', 'js'], ['js', 'typescript'], ['tailwind', 'react'],
    ['bubble', 'webflow'], ['webflow', 'wordpress'],
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[700px] md:h-[800px] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {connections.map(([from, to], i) => {
          const fromNode = skillNodes.find(n => n.id === from);
          const toNode = skillNodes.find(n => n.id === to);
          if (!fromNode || !toNode) return null;
          
          const isActive = hoveredNode === from || hoveredNode === to;
          
          return (
            <line
              key={i}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke={isActive ? '#00d4ff' : 'url(#lineGrad)'}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.4}
              className="transition-all duration-300"
              filter={isActive ? 'url(#glow)' : undefined}
            />
          );
        })}
        
        {/* Mouse connection line */}
        {hoveredNode && (
          <line
            x1={`${skillNodes.find(n => n.id === hoveredNode)?.x}%`}
            y1={`${skillNodes.find(n => n.id === hoveredNode)?.y}%`}
            x2={`${mousePos.x}%`}
            y2={`${mousePos.y}%`}
            stroke="#00d4ff"
            strokeWidth={1}
            strokeOpacity={0.3}
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {/* Skill Nodes */}
      {skillNodes.map((node) => {
        const Icon = node.icon;
        const isHovered = hoveredNode === node.id;
        const isCore = node.category === 'core';
        
        return (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group mt-12"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Orbit Ring for non-core nodes */}
            {!isCore && (
              <div 
                className={`absolute inset-0 rounded-full border border-dashed transition-all duration-500 ${
                  isHovered ? 'border-cyan-400/50 scale-150' : 'border-white/10 scale-125'
                }`}
                style={{ 
                  width: node.size * 2.5, 
                  height: node.size * 2.5,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
            
            {/* Main Node */}
            <div 
              className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              style={{ 
                width: node.size, 
                height: node.size,
                background: `radial-gradient(circle, ${node.color}30 0%, ${node.color}10 50%, transparent 70%)`,
                boxShadow: isHovered ? `0 0 40px ${node.color}80, 0 0 80px ${node.color}40` : `0 0 20px ${node.color}40`
              }}
            >
              {/* Inner Circle */}
              <div 
                className="absolute inset-2 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300"
                style={{ 
                  borderColor: isHovered ? node.color : `${node.color}50`,
                  background: isHovered ? `${node.color}20` : 'rgba(0,0,0,0.5)'
                }}
              >
                <Icon 
                  className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300" 
                  style={{ color: node.color }}
                />
              </div>
              
              {/* Pulse Effect */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: node.color, animationDuration: '2s' }}
              />
            </div>
            
            {/* Label */}
            <div 
              className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-70'
              }`}
            >
              <span 
                className="font-cyber text-xs md:text-sm font-bold whitespace-nowrap"
                style={{ color: node.color, textShadow: `0 0 10px ${node.color}` }}
              >
                {node.name}
              </span>
              
              {/* Skill Level Bar */}
              {node.level && isHovered && (
                <div className="mt-2 w-24 h-1 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${node.level}%`,
                      background: `linear-gradient(90deg, ${node.color}, ${node.color}80)`
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Info Panel */}
      <div className="absolute bottom-26 left-46 right-6 md:left-5 md:right-0.5 md:w-80 p-4 holo-card rounded-xl z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-cyber text-xs text-cyan-400 uppercase tracking-wider">Skill Constellation</span>
        </div>
        
        {!hoveredNode ? (
          <p className="text-gray-400 text-xs">
            Hover over nodes to explore my skills. The constellation shows connections between related technologies.
          </p>
        ) : (
          (() => {
            const node = skillNodes.find(n => n.id === hoveredNode);
            if (!node) return null;
            
            const categoryLabels: Record<string, string> = {
              core: 'Core Expertise',
              coding: 'Coding Skill',
              nocode: 'No-Code Platform'
            };
            
            return (
              <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      background: `${node.color}20`,
                      border: `1px solid ${node.color}50`
                    }}
                  >
                    <node.icon className="w-5 h-5" style={{ color: node.color }} />
                  </div>
                  <div>
                    <span className="text-white font-cyber text-base font-bold block">
                      {node.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {categoryLabels[node.category]}
                    </span>
                  </div>
                </div>
                
                {node.level && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Proficiency</span>
                      <span className="font-cyber text-sm font-bold" style={{ color: node.color }}>
                        {node.level}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${node.level}%`,
                          background: `linear-gradient(90deg, ${node.color}, ${node.color}80)`
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {node.category === 'core' && (
                  <p className="mt-2 text-gray-400 text-xs">
                    Central expertise connecting all technologies in my stack.
                  </p>
                )}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

// ============================================
// 3D TILT PROJECT CARDS
// ============================================

const TiltProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const Icon = project.icon;

  return (
    <div
      ref={cardRef}
      className="relative group cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-200 ease-out"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Background with Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Holographic Border */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(168,85,247,0.3), rgba(0,255,136,0.3))',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
          }}
        />
        
        {/* Main Card Content */}
        <div className="relative p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl h-full">
          {/* Project Number */}
          <div className="absolute top-4 right-4 font-cyber text-6xl font-bold text-white/5">
            {String(index + 1).padStart(2, '0')}
          </div>
          
          {/* Icon with Glow */}
          <div className="relative mb-6">
            <div 
              className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'scale-110' : ''
              }`}
              style={{
                background: `linear-gradient(135deg, ${project.gradient[0]}30, ${project.gradient[1]}30)`,
                boxShadow: isHovered ? `0 0 30px ${project.gradient[0]}50` : 'none'
              }}
            >
              <Icon 
                className="w-8 h-8 transition-colors duration-300"
                style={{ color: project.gradient[0] }}
              />
            </div>
            
            {/* Floating particles on hover */}
            {isHovered && (
              <>
                <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full animate-ping" style={{ background: project.gradient[0] }} />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-ping" style={{ background: project.gradient[1], animationDelay: '0.2s' }} />
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 
            className="font-cyber text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
            style={{ 
              backgroundImage: isHovered ? `linear-gradient(90deg, ${project.gradient[0]}, ${project.gradient[1]})` : 'none'
            }}
          >
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm mb-6 line-clamp-3">
            {project.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string, i: number) => (
              <span 
                key={i}
                className="px-3 py-1 text-xs rounded-full border transition-all duration-300"
                style={{ 
                  borderColor: `${project.gradient[0]}40`,
                  background: `${project.gradient[0]}10`,
                  color: project.gradient[0]
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center gap-2 text-sm font-cyber transition-all duration-300 group/btn"
              style={{ color: project.gradient[0] }}
            >
              <span>View Project</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4 text-gray-400" />
              </button>
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Shine Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(${135 + transform.rotateY * 2}deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// INTERACTIVE TERMINAL
// ============================================

const InteractiveTerminal = () => {
  const [commands, setCommands] = useState<{ text: string; type: 'input' | 'output' | 'error'; isTyping?: boolean }[]>([
    { text: 'Welcome to Muhammad Usman\'s Portfolio Terminal v2.0', type: 'output' },
    { text: 'Type "help" to see available commands', type: 'output' },
    { text: '', type: 'input', isTyping: true },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  const availableCommands = {
    help: 'Available commands: about, skills, projects, contact, clear, whoami, date, matrix, joke',
    about: 'Muhammad Usman - Frontend Developer passionate about creating immersive digital experiences.',
    skills: 'React.js • JavaScript • TypeScript • Tailwind CSS • Git • Bubble.io • Webflow • WordPress',
    projects: 'Check out my featured projects in the Projects section!',
    contact: 'Email: contact@muhammadusman.dev | Available for freelance work worldwide',
    whoami: 'guest@portfolio:~$ You are a visitor exploring my digital universe!',
    date: () => new Date().toLocaleString(),
    matrix: 'Wake up, Neo... 🕶️ The Matrix has you...',
    joke: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
    clear: 'CLEAR',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newCommands = [...commands];
    newCommands[newCommands.length - 1] = { text: `guest@portfolio:~$ ${input}`, type: 'input' };
    
    const cmd = input.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setCommands([{ text: '', type: 'input', isTyping: true }]);
    } else {
      const response = availableCommands[cmd as keyof typeof availableCommands];
      if (response) {
        newCommands.push({ 
          text: typeof response === 'function' ? response() : response, 
          type: 'output' 
        });
      } else {
        newCommands.push({ 
          text: `Command not found: ${input}. Type "help" for available commands.`, 
          type: 'error' 
        });
      }
      newCommands.push({ text: '', type: 'input', isTyping: true });
      setCommands(newCommands);
    }

    setHistory([...history, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Terminal Window */}
      <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-black/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-gray-400 text-sm font-mono">guest@portfolio — ~</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCommands([{ text: '', type: 'input', isTyping: true }])}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={terminalRef}
          className="p-4 h-64 overflow-y-auto font-mono text-sm"
        >
          {commands.map((cmd, i) => (
            <div key={i} className="mb-1">
              {cmd.type === 'input' ? (
                cmd.isTyping ? (
                  <form onSubmit={handleSubmit} className="flex items-center">
                    <span className="text-green-400 mr-2">guest@portfolio:~$</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-cyan-400 outline-none"
                      autoFocus
                      spellCheck={false}
                    />
                  </form>
                ) : (
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">guest@portfolio:~$</span>
                    <span className="text-cyan-400">{cmd.text.replace('guest@portfolio:~$ ', '')}</span>
                  </div>
                )
              ) : cmd.type === 'error' ? (
                <span className="text-red-400">{cmd.text}</span>
              ) : (
                <span className="text-gray-300">{cmd.text}</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Terminal Footer */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              bash
            </span>
            <span>UTF-8</span>
          </div>
          <div className="text-xs text-gray-500">
            {commands.filter(c => c.type === 'input' && !c.isTyping).length} commands executed
          </div>
        </div>
      </div>
      
      {/* Quick Commands */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {['about', 'skills', 'projects', 'contact', 'matrix'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setInput(cmd);
              setTimeout(() => {
                const form = document.querySelector('form');
                form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              }, 100);
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'terminal', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projects = [
    {
      title: 'PAK IT SYSTEMS',
      description: 'A platform connecting homeowners with skilled contractors offering competitive rates, while providing contractors with valuable leads and clients to grow their business.',
      tags: ['React', 'Tailwand', 'Shadcn'],
      icon: Globe,
      gradient: ['#00d4ff', '#a855f7'],
      liveLink: 'https://pakitsystems-usman.netlify.app/managedSecurity'
    },
    {
      title: 'Nutrition Coach',
      description: 'Developed a React website for Nutrition Coach with a dynamic app screenshot slider and a modern hero section, enhancing user engagement and brand trust.',
      tags: ['React'],
      icon: Sparkles,
      gradient: ['#00ff88', '#00d4ff'],
      liveLink: 'https://nutritioncoachofficial.com/'
    },
    {
      title: 'HMC - Help Me Compete',
      description: 'Built an AI-powered, prompt-driven recruitment marketing platform for small and mid-sized practices to compete with enterprise employers. It analyzes competitor benefits and candidate churn to generate tailored employer-branding and hiring strategies.',
      tags: ['Bubble.io', 'AI', 'Recruitment', 'No-Code'],
      icon: Box,
      gradient: ['#3b82f6', '#8b5cf6'],
      liveLink: 'https://helpmecompete.com/'
    },
    {
      title: 'Dynasty Fabrics',
      description: 'Built a modern e-commerce website for selling clothing, featuring product browsing, detailed listings, cart management, and a smooth checkout experience.',
      tags: ['Bubble.io', 'E-commerce','No-Code'],
      icon: Layout,
      gradient: ['#ec4899', '#f43f5e'],
      liveLink: 'https://dynastyfabrics-16638.bubbleapps.io/version-test'
    },
    {
      title: 'Xale',
      description: 'Built a modern e-commerce website for selling clothing, featuring product browsing, detailed listings, cart management, and a smooth checkout experience.',
      tags: ['Bubble.io', 'E-commerce', 'Clothing', 'No-Code'],
      icon: Layout,
      gradient: ['#fbbf24', '#f97316'],
      liveLink: 'https://dynastyfabrics-16638.bubbleapps.io/version-test'
    }
  ];

  const stats = [
    { value: '50+', label: 'Projects Completed', icon: Trophy },
    { value: '30+', label: 'Happy Clients', icon: Star },
    { value: '3+', label: 'Years Experience', icon: Rocket },
    { value: '100%', label: 'Client Satisfaction', icon: Zap },
  ];

  return (
    <div className="min-h-screen gradient-bg grid-bg relative overflow-x-hidden cursor-none md:cursor-none">
      <CustomCursor />
      <ScrollProgress />
      <BinaryRain />
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <Hexagon className="w-8 h-8 text-cyan-400" />
              <span className="font-cyber text-xl font-bold text-white">
                MU<span className="text-cyan-400">.</span>USMAN
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'home', label: 'Home' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'terminal', label: 'Terminal' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-cyber text-sm uppercase tracking-wider transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-cyan-400 neon-text-cyan' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Terminal Toggle */}
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="md:hidden p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
            >
              <Terminal className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="flex items-center gap-2">
                <Binary className="w-5 h-5 text-cyan-400" />
                <span className="font-cyber text-cyan-400 text-sm tracking-widest uppercase">
                  Frontend Developer
                </span>
              </div>
              
              <h1 className="font-cyber text-5xl md:text-7xl font-bold text-white leading-tight">
                MUHAMMAD
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 neon-text-cyan">
                  USMAN
                </span>
              </h1>

              <div className="h-10">
                <p className="text-xl text-gray-300 font-light">
                  <TypingEffect text="Building the future, one pixel at a time..." speed={60} />
                </p>
              </div>

              <p className="text-gray-400 text-lg max-w-lg">
                Passionate frontend developer crafting immersive digital experiences with cutting-edge technologies. 
                Specializing in React ecosystems and no-code solutions.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="btn-cyber rounded-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Projects
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-3 border border-purple-500 text-purple-400 font-cyber uppercase tracking-wider hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 rounded-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                      <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                      <div className="font-cyber text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-gray-400 text-xs">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Profile Image */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                  {[Code2, Cpu, Zap, Sparkles].map((Icon, i) => (
                    <div 
                      key={i}
                      className="absolute"
                      style={{
                        top: `${50 + 45 * Math.sin((i * Math.PI) / 2)}%`,
                        left: `${50 + 45 * Math.cos((i * Math.PI) / 2)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Icon className={`w-8 h-8 ${['text-cyan-400/50', 'text-purple-400/50', 'text-green-400/50', 'text-yellow-400/50'][i]}`} />
                    </div>
                  ))}
                </div>

                {/* Profile Image Container */}
                <div className="profile-glow relative">
                  <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-cyan-500/30 animate-pulse-glow">
                    <img 
                      src="/usman.jpg" 
                      alt="Muhammad Usman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-110 animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-125 animate-pulse" style={{ animationDuration: '4s' }} />
                  <div className="absolute inset-0 rounded-full border border-cyan-500/10 scale-150" />
                </div>

                {/* Floating Badges */}
                <div className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-cyan-400 font-cyber text-sm">Available for Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Skills Section - Skill Constellation */}
      <section id="skills" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="font-cyber text-cyan-400 text-sm tracking-widest uppercase">Expertise</span>
            </div>
            <h2 className="font-cyber text-4xl md:text-5xl font-bold text-white mb-4">
              SKILL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CONSTELLATION</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore my technical universe. Hover over nodes to discover connections and proficiency levels.
            </p>
          </div>

          {/* Skill Constellation Visualization */}
          <SkillConstellation />
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Projects Section - 3D Tilt Cards */}
      <section id="projects" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Layers className="w-6 h-6 text-cyan-400" />
              <span className="font-cyber text-cyan-400 text-sm tracking-widest uppercase">Portfolio</span>
            </div>
            <h2 className="font-cyber text-4xl md:text-5xl font-bold text-white mb-4">
              HOLOGRAPHIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">PROJECTS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tilt your mouse over the cards to experience the 3D holographic effect
            </p>
          </div>

          {/* Projects Grid with 3D Tilt */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <TiltProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Interactive Terminal Section */}
      <section id="terminal" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Terminal className="w-6 h-6 text-cyan-400" />
              <span className="font-cyber text-cyan-400 text-sm tracking-widest uppercase">Interactive</span>
            </div>
            <h2 className="font-cyber text-4xl md:text-5xl font-bold text-white mb-4">
              COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">TERMINAL</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Try typing commands like 'help', 'about', 'skills', 'projects', 'contact', or 'matrix'
            </p>
          </div>

          {/* Interactive Terminal */}
          <InteractiveTerminal />
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-cyan-400" />
              <span className="font-cyber text-cyan-400 text-sm tracking-widest uppercase">Get in Touch</span>
            </div>
            <h2 className="font-cyber text-4xl md:text-5xl font-bold text-white mb-4">
              LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CONNECT</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's create something amazing together
            </p>
          </div>

          {/* Contact Content */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="holo-card rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                <h3 className="font-cyber text-2xl font-bold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'contact@muhammadusman.dev', color: 'cyan' },
                    { icon: Globe, label: 'Location', value: 'Available Worldwide', color: 'purple' },
                    { icon: Zap, label: 'Availability', value: 'Open for Freelance', color: 'green' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const colorMap: Record<string, string> = {
                      cyan: 'from-cyan-500 to-blue-500',
                      purple: 'from-purple-500 to-pink-500',
                      green: 'from-green-500 to-emerald-500',
                    };
                    return (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[item.color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{item.label}</p>
                          <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">Follow me on</p>
                  <div className="flex gap-4">
                    {[Github, Linkedin, Twitter].map((Icon, i) => (
                      <a 
                        key={i}
                        href="#" 
                        className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all border border-white/10 hover:border-cyan-500/30"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="holo-card rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300">
              <h3 className="font-cyber text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-400 text-sm mb-2">Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all group-hover:border-cyan-500/50"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all group-hover:border-cyan-500/50"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-gray-400 text-sm mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all group-hover:border-cyan-500/50"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-gray-400 text-sm mb-2">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all resize-none group-hover:border-cyan-500/50"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full btn-cyber rounded-lg flex items-center justify-center gap-2 py-4"
                >
                  <Sparkles className="w-5 h-5" />
                  Send Message
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Hexagon className="w-6 h-6 text-cyan-400" />
              <span className="font-cyber text-lg font-bold text-white">
                MU<span className="text-cyan-400">.</span>USMAN
              </span>
            </div>
            
            <p className="text-gray-400 text-sm">
              © 2024 Muhammad Usman. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Built with</span>
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>+</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>+</span>
              <Zap className="w-4 h-4 text-green-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
