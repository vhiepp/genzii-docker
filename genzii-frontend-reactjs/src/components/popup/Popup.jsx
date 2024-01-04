
import { useContext, useEffect, useRef } from 'react';

import { ControllerPopupContext } from '../../contexts/controll-popup/ControllPopup.js';

import styles from './Popup.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Popup({func ,children}) { 

    const {showPopupFullScreen, setShowPopupFullScreen} = useContext(ControllerPopupContext);
    
    const popupContainerRef = useRef(null);
    const popupRef = useRef(null);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) { 
            setShowPopupFullScreen(false);
        }
    }
    
    useEffect(() => { 
        popupContainerRef.current.addEventListener('click', handleClickOutside)
        return () => { 
            try {
                popupContainerRef.current.removeEventListener('click', handleClickOutside)
            } catch (error) {
                console.log(error);
            }
         }
    }, [])

    return (
        <div ref={popupContainerRef} className={cn('container-popup', {'show': showPopupFullScreen})}>
            <div ref={popupRef} className={cn('popup')}>
                {children}
            </div>
        </div>
    )
}