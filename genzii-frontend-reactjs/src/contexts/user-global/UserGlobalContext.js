
import { createContext, useEffect, useState } from "react";
import { AuthenAPI } from "../../apis/apis";

const UserInfoGlobal = createContext();

export { UserInfoGlobal }; 

export default function UserGlobalContext({children}) {

    const [userInfoGlobal, setUserInfGlobal] = useState(null);

    useEffect(() => {
        if (window.location.href.split('/')[3] != 'sign-in') {
            handleGetMyProfile();
            setInterval(() => handleGetMyProfile(), 300000);
        }
    }, []);

    const handleGetMyProfile = async () => {
        let res = await AuthenAPI.getMyProfile();

        if (!res.error) {
            setUserInfGlobal(res.data);
        } else {
           window.location.href = '/sign-in';
        }
    }

    return (
        <UserInfoGlobal.Provider value={{userInfoGlobal, setUserInfGlobal}}>
            {
                ((window.location.href.split('/')[3] == 'sign-in') || userInfoGlobal)
                &&
                children
            }
        </UserInfoGlobal.Provider>
    );
}