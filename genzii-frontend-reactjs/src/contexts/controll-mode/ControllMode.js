
import { createContext, useEffect, useState } from "react";

const ControllerModeContext = createContext();

export { ControllerModeContext }

export default function ControllMode({children}) {

    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('dark-mode'))==null?false:JSON.parse(localStorage.getItem('dark-mode')));

    useEffect(() => {
        const data_location = localStorage.getItem('dark-mode');
        console.log(data_location);
        console.log(darkMode);
        if (data_location == null) {
            localStorage.setItem('dark-mode', darkMode);
        } else {
            localStorage.setItem('dark-mode', JSON.parse(darkMode)?true:false);
        }
    }, [darkMode])

    return (
        <ControllerModeContext.Provider value={{darkMode, setDarkMode}}> 
            {children}
        </ControllerModeContext.Provider>
    )
}