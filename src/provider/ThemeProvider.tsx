"use client"
import { use, useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), [ ]);

    if (mounted) {
      return (
            <div className={theme}>
                {children}
            </div>
        )
    }
}