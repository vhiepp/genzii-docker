// Import thêm `useEffect` và `useState` từ React
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';

import { LoadingMini } from '../../components/components.js';
import ChatBox from './component/chat-box/ChatBox.jsx';

import { db } from '../../configs/index.js';
import { collection, query, onSnapshot } from 'firebase/firestore';


import styles from './Message.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

let userChatList = {};

export default function Message() {
    
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState({});
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    const [completedLoad, setCompletedLoad] = useState(false);

    const fetchDataUser = async () => {
        setLoading(true); 

        await axios.get(`http://genzii.vhiep.com:8000/api/auth/profile`, { withCredentials: true })
            .then(responses => {
                const cur_user = responses.data.data.profile;
                setCurrentUser(cur_user);
                fetchChatsOfCurrentUser(cur_user);
            })
            .catch(error => {
            });

        setLoading(false);
    }

    const getUserbyUid = (uid) => {
        // Giữ nguyên phần này
    }
    
    const fetchChatsOfCurrentUser = (cur_user) => {
        
        try {
            if (cur_user) {
                const chatRef = query(collection(db, 'users', cur_user.uid, "chats"));

                const unsubscribe = onSnapshot(chatRef, callBack);

                return unsubscribe;
            }
        } catch (error) {
            // console.error('Error fetching units data:', error);
        }
    };

    const callBack = async (querySnapshot) => {
        let chats_arr = [];
        let id_arr = [];
        await querySnapshot.forEach((doc) => {
            if (!userChatList?.[doc.id]) {
                id_arr.push(doc.id);
            }
        });
        if (id_arr.length > 0) {
            const resProfile = await axios.post(`http://genzii.vhiep.com:8000/api/user/profile`, {
                uid: id_arr,
                group: true
            },{ withCredentials: true });
            userChatList = {...userChatList, ...resProfile.data.data};
        }
        
        console.log(userChatList);
        querySnapshot.forEach(async (doc) => {
            chats_arr.push({ id: doc.id, ...doc.data(), avt: userChatList?.[doc.id]?.current_avatar.url });
        });

        chats_arr.sort((a, b) => b.timestamp - a.timestamp);
        setChats(chats_arr);
    }

    useEffect(() => {
        fetchDataUser();
    }, [completedLoad])

    return (
        <div className={cn("Chat")}>
            <div className={cn('Chat_nav')}>
                <h2>Tin nhắn</h2>
                <div className={cn('Chat_nav-searchbox')}>
                    <ion-icon name="search"></ion-icon>
                    <input type='text' placeholder='Tìm kiếm' />
                </div>
                <div className={cn('Chat_nav-message-container')}>
                    {
                        loading
                        &&
                        <div className={cn('loading-container')}>
                            <LoadingMini></LoadingMini>
                        </div>
                        ||
                        chats.map((chat, index) => (
                            <Link
                                key={index}
                                className={cn('nav_message-item', {'msg-active': location.pathname.includes(chat.id)})}
                                to={chat.id}
                            >
                                <div className={cn('nav_message-item-img')}>
                                    <img src={chat.avt} alt={chat.id} />
                                </div>
                                <div className={cn('nav_message-item-msg')}>
                                    <h3>{chat.id}</h3>
                                    <span>{currentUser.uid === chat.from ? "Bạn: " + chat.last_message : chat.last_message}</span>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
            <div className={cn('Chat_content')}>
                <Routes>
                    <Route path=':id' element={<ChatBox key={location.pathname} setCompletedLoad={setCompletedLoad}/>} />
                </Routes>
            </div>
        </div>
    );
} 
