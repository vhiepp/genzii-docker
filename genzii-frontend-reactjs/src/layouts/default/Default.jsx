import React, { Children, cloneElement, isValidElement, Fragment, useRef, useEffect, useState } from "react";
import { SideBar } from "../../components/components.js";

import styles from './Default.module.scss';
import '../../assets/css/fix-infinite-scroll.css';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Default({ children }) {

    const scrollRef = useRef(null);
    const elementEndRef = useRef(null);


    const [locationElementEndState, setLocationElementEndState] = useState(0);


    const childrenModified = Children.map(children, child =>
        isValidElement(child) ? cloneElement(child, { locationElementEndState }) : child
    );

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current && elementEndRef.current) {
                const targetElementRect = elementEndRef.current.getBoundingClientRect();
                
                // Tính toán vị trí của targetElementRef so với cửa sổ trình duyệt
                const elementTopRelativeToWindow = targetElementRect.top;
                
                setLocationElementEndState(elementTopRelativeToWindow);
        
            }
        };
    
        if (scrollRef.current) {
            scrollRef.current.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <Fragment>
            <div className={cn('container-side-bar')}>
                <SideBar />
            </div>
            <div ref={scrollRef} className={cn('container-default-layout', 'scroll-bar')}>
                {childrenModified}
                <div ref={elementEndRef}></div>
            </div>
        </Fragment>
    );
}
