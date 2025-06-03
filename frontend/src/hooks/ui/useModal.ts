import { useState, useCallback } from "react";

export function useModal<T extends string | null = null>() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<T>(null as T);

    const open = useCallback((newMode: T) => {
        setMode(newMode);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    return { isOpen, mode, open, close };
}