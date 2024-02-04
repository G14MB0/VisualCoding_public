import { useContext, useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { AppContext } from "../../provider/appProvider";



function useDarkSide() {
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === "dark" ? "light" : "dark";


    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);

    return [colorTheme, setTheme]
}



export default function Switcher() {
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    );
    const { isDark, setIsDark } = useContext(AppContext);


    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
        setIsDark(checked)
    };

    return (
        <>
            <DarkModeSwitch
                checked={darkSide}
                onChange={toggleDarkMode}
                size={20}
            />
        </>
    );
}
