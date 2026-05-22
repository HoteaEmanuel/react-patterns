import React, { createContext, useState,useContext } from "react"

type Theme = 'light' | 'dark' | 'system'


type ThemeProviderState= {
    theme:Theme;
    setTheme:(newTheme:Theme)=>void;
}

const ThemeContext=createContext<ThemeProviderState>({
    theme:'system',
    setTheme:()=>{}
});

export function ThemeProvider({ children} : { children: React.ReactNode}){
    const [theme, setTheme] = useState<Theme>('system');
    return <ThemeContext value={{theme,setTheme}}>{children}</ThemeContext>

}

