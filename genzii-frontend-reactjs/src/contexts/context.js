
import ControllPopup from "./controll-popup/ControllPopup";
import ControllMode from "./controll-mode/ControllMode.js";
import UserGlobalContext from "./user-global/UserGlobalContext";


export default function Context({children}) {
    
    return (
        <ControllMode>
            <ControllPopup>
                <UserGlobalContext>
                    {children}
                </UserGlobalContext>
            </ControllPopup>
        </ControllMode>
    );
}