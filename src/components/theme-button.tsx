"use client"
import React from 'react'
import { useTheme } from "next-themes";
import { Button } from './ui/button';

import {SunMoon} from "lucide-react"
const ThemeButton = () => {
    const { theme, setTheme } = useTheme();
    // const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <Button
            size={"sm"}
            variant={"ghost"}
            className='mr-2'
            onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")}>
            <SunMoon />
        </Button>
    )
}

export default ThemeButton