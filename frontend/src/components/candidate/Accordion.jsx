import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

const AccordionContext = createContext(undefined);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within an Accordion");
    }
    return context;
};

export const Accordion = ({
    children,
    defaultOpen,
    allowMultiple = false,
    className = "",
}) => {
    const [activeItems, setActiveItems] = useState(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id) => {
        setActiveItems((prev) => {
            if (allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
            } else {
                return prev.includes(id) ? [] : [id];
            }
        });
    };

    const isItemActive = (id) => activeItems.includes(id);

    return (
        <AccordionContext.Provider
            value={{ activeItems, toggleItem, isItemActive }}
        >
            <div className={`space-y-4 ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
};

export const AccordionItem = ({
    id,
    children,
    className = "",
}) => {
    return (
        <div className={cn("overflow-hidden glass-card glass-card-hover border border-white/5", className)}>
            {children}
        </div>
    );
};

export const AccordionHeader = ({
    itemId,
    children,
    className = "",
    icon,
    iconPosition = "right",
}) => {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    const defaultIcon = (
        <ChevronDown 
            className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", {
                "rotate-180 text-primary-400": isActive,
            })}
        />
    );

    const handleClick = () => {
        toggleItem(itemId);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-full px-6 py-4 text-left focus:outline-none transition-all flex items-center justify-between cursor-pointer",
                isActive && "bg-white/5",
                className
            )}
        >
            <div className="flex items-center space-x-3 w-full">
                {iconPosition === "left" && (icon || defaultIcon)}
                <div className="flex-1">{children}</div>
            </div>
            {iconPosition === "right" && (icon || defaultIcon)}
        </button>
    );
};

export const AccordionContent = ({
    itemId,
    children,
    className = "",
}) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div
            className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}
        >
            <div className={cn("px-6 pb-6 pt-2 border-t border-white/5 bg-white/2", className)}>
                {children}
            </div>
        </div>
    );
};
