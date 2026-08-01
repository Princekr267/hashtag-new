"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    // Work only in laptop/desktop view (width >= 1024px and hover-capable)
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(min-width: 1024px) and (hover: hover)").matches
    ) {
      return;
    }

    const direction = getDirection(event, ref.current);
    console.log("direction", direction);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const handleMouseLeave = () => {
    setDirection("exit");
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      className={cn(
        "relative bg-transparent rounded-lg overflow-hidden group/card w-full h-full",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full overflow-hidden"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500 pointer-events-none" />
          <div className="h-full w-full absolute inset-0 overflow-hidden">
            <motion.img
              alt="image"
              variants={variants}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className={cn(
                "h-full w-full object-cover scale-[1.3]",
                imageClassName
              )}
              width="1000"
              height="1000"
              src={imageUrl}
            />
          </div>
          <motion.div
            variants={textVariants}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className={cn(
              "text-white absolute inset-0 z-40 pointer-events-auto",
              childrenClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const variants = {
  initial: {
    x: 0,
    y: 0,
  },
  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 10,
    x: 0,
  },
  bottom: {
    y: -10,
    x: 0,
  },
  left: {
    x: 10,
    y: 0,
  },
  right: {
    x: -10,
    y: 0,
  },
};

const textVariants = {
  initial: {
    opacity: 0,
  },
  exit: {
    opacity: 0,
  },
  top: {
    opacity: 1,
  },
  bottom: {
    opacity: 1,
  },
  left: {
    opacity: 1,
  },
  right: {
    opacity: 1,
  },
};
