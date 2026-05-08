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
      className="relative mx-auto flex w-fit rounded-full border-2 border-white/30 bg-black/50 backdrop-blur-md p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
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
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase mix-blend-difference md:px-5 md:py-3 md:text-base transition-colors duration-200 ${
        isActive ? "text-[#00A3FF]" : "text-white"
      }`}
      style={{ fontFamily: "Utile, Arial, sans-serif", fontWeight: 700, letterSpacing: "-0.5px" }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-white md:h-12"
    />
  );
};

export default NavHeader;
