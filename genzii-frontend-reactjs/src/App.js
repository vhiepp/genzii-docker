
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import routers from './routes/router.js';
import { Popup } from './components/components.js';

import { ControllerModeContext } from './contexts/controll-mode/ControllMode.js';

export default function App() { 

    const {darkMode} = useContext(ControllerModeContext); 

    return (
        <div className={`container-app ${darkMode?'dark-mode':'light-mode'}`}>
            <BrowserRouter>
                <Routes>
                        {
                            routers.map((router, i) => {
                                return (
                                    <Route
                                        key={i}
                                        path={router.path}
                                        element={
                                            <router.layout>
                                                <router.component></router.component>
                                            </router.layout>
                                        }
                                        exact
                                    ></Route>
                                )
                            })
                        }
                </Routes>
            </BrowserRouter> 
        </div>
    )
}