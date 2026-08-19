import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

const ThemeToggle = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });
    useEffect(() => {
        if(darkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return(
        <Button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Cambia tema"
        >
            {darkMode ? <MdSunny size={20}/> : <FaMoon size={20}/>}
        </Button>
    );
}
export default ThemeToggle;