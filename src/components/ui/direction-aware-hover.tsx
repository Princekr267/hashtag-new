"use client";

import { useRef, useState, useEffect } from "react";

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

    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
        const checkIsDesktop = () => {
            const matches = typeof window !== "undefined" && window.innerWidth >= 1024;
            setIsDesktop(matches);
        };
        checkIsDesktop();
        window.addEventListener("resize", checkIsDesktop);
        return () => window.removeEventListener("resize", checkIsDesktop);
    }, []);

    const handleMouseEnter = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (!ref.current || !isDesktop) return;

        const dir = getDirection(event, ref.current);
        switch (dir) {
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
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isDesktop) return;
        setIsHovered(false);
        setDirection("initial");
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
                <div className="relative h-full w-full overflow-hidden">
                    {/* Hover darkening backdrop */}
                    {isDesktop && (
                        <div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/60 z-10 transition duration-500 pointer-events-none" />
                    )}

                    {/* Image Container */}
                    <div className="h-full w-full absolute inset-0 overflow-hidden">
                        <motion.img
                            alt="image"
                            variants={isDesktop ? variants : undefined}
                            initial="initial"
                            animate={isDesktop && isHovered ? direction : "initial"}
                            transition={{
                                duration: 0.35,
                                ease: "easeOut",
                            }}
                            className={cn(
                                "h-full w-full object-cover",
                                imageClassName
                            )}
                            width="1000"
                            height="1000"
                            src={imageUrl}
                        />
                    </div>

                    {/* Details & Content Container */}
                    <div
                        className={cn(
                            "text-white absolute inset-0 z-40 pointer-events-auto transition-opacity duration-300",
                            isDesktop ? "opacity-0 group-hover/card:opacity-100" : "opacity-100",
                            childrenClassName
                        )}
                    >
                        {children}
                    </div>
                </div>
            </AnimatePresence>
        </motion.div>
    );
};

const variants = {
    initial: {
        scale: 1.25,
        x: 0,
        y: 0,
    },
    top: {
        scale: 1.25,
        y: 20,
        x: 0,
    },
    bottom: {
        scale: 1.25,
        y: -20,
        x: 0,
    },
    left: {
        scale: 1.25,
        x: 20,
        y: 0,
    },
    right: {
        scale: 1.25,
        x: -20,
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
