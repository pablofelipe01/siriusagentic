"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface NavSection {
  id: string;
  label: string;
}

interface NavHeaderProps {
  sections: NavSection[];
  activeSection?: string;
  onNavigate: (id: string) => void;
}

function NavHeader({ sections, activeSection, onNavigate }: NavHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit max-w-full rounded-full border-2 border-white/30 bg-black/50 backdrop-blur-md p-1 overflow-x-auto overflow-y-visible scrollbar-hide"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {sections.map(({ id, label }) => (
        <Tab
          key={id}
          setPosition={setPosition}
          onClick={() => onNavigate(id)}
          isActive={activeSection === id}
        >
          {label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  onClick,
  isActive,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<
    React.SetStateAction<{ left: number; width: number; opacity: number }>
  >;
  onClick: () => void;
  isActive?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer whitespace-nowrap flex-shrink-0 px-2 py-1.5 text-[9px] uppercase sm:px-2.5 sm:py-2 sm:text-[10px] md:px-3 md:text-xs lg:px-4 lg:text-sm xl:px-5 xl:py-3 xl:text-base transition-colors duration-300 ${
        isActive ? "text-white/90" : "text-white/70 hover:text-white/90"
      }`}
      style={{
        fontFamily: "Utile, Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.3px"
      }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-5 rounded-full sm:h-6 md:h-7 lg:h-9 xl:h-12"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
      }}
    />
  );
};

export default NavHeader;
