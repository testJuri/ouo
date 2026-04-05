import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { ContextMenu } from '@base-ui-components/react/context-menu';
import {
  FileText,
  Image,
  Video,
  Palette,
  Film,
  Sparkles,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

export type MenuItem = {
  id: number;
  type: string;
  label: string;
  icon: LucideIcon;
};

export type RadialMenuProps = {
  children?: React.ReactNode;
  menuItems?: MenuItem[];
  size?: number;
  iconSize?: number;
  bandWidth?: number;
  innerGap?: number;
  outerGap?: number;
  outerRingWidth?: number;
  onSelect?: (item: MenuItem, position: { x: number; y: number }) => void;
  shouldOpen?: (event: React.MouseEvent) => boolean;
};

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 1, type: 'image', label: '图片节点', icon: Image },
  { id: 2, type: 'video', label: '视频节点', icon: Video },
  { id: 3, type: 'text', label: '文本节点', icon: FileText },
  { id: 4, type: 'imageConfig', label: '文生图配置', icon: Palette },
  { id: 5, type: 'videoConfig', label: '视频配置', icon: Film },
  { id: 6, type: 'effectConfig', label: '效果配置', icon: Sparkles },
  { id: 7, type: 'templateEffect', label: '特效模板', icon: Wand2 },
];

type Point = { x: number; y: number };

const menuTransition: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 1,
};

const wedgeTransition: Transition = {
  duration: 0.05,
  ease: 'easeOut',
};

const FULL_CIRCLE = 360;
const START_ANGLE = -90;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(radius: number, angleDeg: number): Point {
  const rad = degToRad(angleDeg);
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

function slicePath(
  index: number,
  total: number,
  wedgeRadius: number,
  innerRadius: number
) {
  if (total <= 0) return '';

  if (total === 1) {
    return `
      M ${wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${-wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${wedgeRadius} 0
      M ${innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${-innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${innerRadius} 0
    `;
  }

  const anglePerSlice = FULL_CIRCLE / total;
  const midDeg = START_ANGLE + anglePerSlice * index;
  const halfSlice = anglePerSlice / 2;

  const startDeg = midDeg - halfSlice;
  const endDeg = midDeg + halfSlice;

  const outerStart = polarToCartesian(wedgeRadius, startDeg);
  const outerEnd = polarToCartesian(wedgeRadius, endDeg);
  const innerStart = polarToCartesian(innerRadius, startDeg);
  const innerEnd = polarToCartesian(innerRadius, endDeg);

  const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${wedgeRadius} ${wedgeRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
}

export function RadialMenu({
  children,
  menuItems = DEFAULT_MENU_ITEMS,
  size = 240,
  iconSize = 20,
  bandWidth = 50,
  innerGap = 8,
  outerGap = 8,
  outerRingWidth = 12,
  onSelect,
  shouldOpen,
}: RadialMenuProps) {
  const radius = size / 2;

  const outerRingOuterRadius = radius;
  const outerRingInnerRadius = outerRingOuterRadius - outerRingWidth;

  const wedgeOuterRadius = outerRingInnerRadius - outerGap;
  const wedgeInnerRadius = wedgeOuterRadius - bandWidth;

  const iconRingRadius = (wedgeOuterRadius + wedgeInnerRadius) / 2;

  const centerRadius = Math.max(wedgeInnerRadius - innerGap, 0);

  const slice = 360 / menuItems.length;

  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const clickPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const resetActive = () => setActiveIndex(null);

  const blockOpenRef = useRef(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    clickPositionRef.current = { x: event.clientX, y: event.clientY };

    const target = event.target as HTMLElement;
    const isOnNode = target.closest('.react-flow__node');

    if (shouldOpen && !shouldOpen(event)) {
      blockOpenRef.current = true;
      return;
    }

    if (isOnNode) {
      blockOpenRef.current = true;
      return;
    }

    blockOpenRef.current = false;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && blockOpenRef.current) {
      blockOpenRef.current = false;
      return;
    }
    setOpen(isOpen);
    if (!isOpen) resetActive();
  };

  return (
    <ContextMenu.Root open={open} onOpenChange={handleOpenChange}>
      <ContextMenu.Trigger
        render={(triggerProps) => {
          return (
            <div
              {...triggerProps}
              onContextMenu={(e) => {
                handleContextMenu(e);
                if (triggerProps.onContextMenu) {
                  triggerProps.onContextMenu(e);
                }
              }}
              className="select-none outline-none"
              style={{ width: '100%', height: '100%' }}
            >
              {children}
            </div>
          );
        }}
      />

      <AnimatePresence>
        {open && (
          <ContextMenu.Portal keepMounted>
            <ContextMenu.Positioner
              align="center"
              sideOffset={({ positioner }) => -positioner.height / 2}
              className="outline-none z-[9999]"
            >
              <ContextMenu.Popup
                style={{ width: size, height: size }}
                className="relative rounded-full overflow-hidden shadow-2xl outline-none"
                render={
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={menuTransition}
                  />
                }
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
                >
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const midDeg = START_ANGLE + slice * index;
                    const { x: iconX, y: iconY } = polarToCartesian(
                      iconRingRadius,
                      midDeg
                    );
                    const ICON_BOX = iconSize * 2;
                    const isActive = activeIndex === index;

                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => itemRefs.current[index]?.click()}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                          itemRefs.current[index]?.focus();
                        }}
                      >
                        {/* Outer ring slice */}
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            outerRingOuterRadius,
                            outerRingInnerRadius
                          )}
                          fill={isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'}
                          initial={false}
                          transition={wedgeTransition}
                        />
                        {/* Main wedge */}
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            wedgeOuterRadius,
                            wedgeInnerRadius
                          )}
                          fill={isActive ? 'var(--bg-tertiary)' : 'var(--bg-primary)'}
                          stroke="var(--border-color)"
                          strokeWidth={0.5}
                          initial={false}
                          transition={wedgeTransition}
                        />

                        <foreignObject
                          x={iconX - ICON_BOX / 2}
                          y={iconY - ICON_BOX / 2}
                          width={ICON_BOX}
                          height={ICON_BOX}
                        >
                          <ContextMenu.Item
                            ref={(el) => {
                              itemRefs.current[index] = el as HTMLElement | null;
                            }}
                            onFocus={() => setActiveIndex(index)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect?.(item, clickPositionRef.current);
                            }}
                            aria-label={item.label}
                            className="w-full h-full flex items-center justify-center rounded-full outline-none transition-colors"
                            style={{ color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                          >
                            <Icon size={iconSize} strokeWidth={1.5} />
                          </ContextMenu.Item>
                        </foreignObject>
                      </g>
                    );
                  })}

                  {/* Center circle */}
                  <circle
                    cx={0}
                    cy={0}
                    r={centerRadius}
                    fill="var(--bg-primary)"
                    stroke="var(--border-color)"
                    strokeWidth={1}
                  />
                  {/* Center dot */}
                  <circle cx={0} cy={0} r={3} fill="var(--text-tertiary)" />
                </svg>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        )}
      </AnimatePresence>
    </ContextMenu.Root>
  );
}

export default RadialMenu;
