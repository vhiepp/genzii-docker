
import { createContext, useState } from "react";

const ControllerPopupContext = createContext();

export { ControllerPopupContext }

export default function ControllPopup({children}) {

    const [showPopupFullScreen, setShowPopupFullScreen] = useState(false);

    return (
        <ControllerPopupContext.Provider value={{showPopupFullScreen, setShowPopupFullScreen}}> 
            {children}
        </ControllerPopupContext.Provider>
    )
}