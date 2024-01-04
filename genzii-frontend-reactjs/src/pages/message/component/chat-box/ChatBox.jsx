import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { LoadingMini } from '../../../../components/components.js';

import { db } from '../../../../configs/index.js';
import { doc, collection, setDoc, query, onSnapshot, addDoc } from 'firebase/firestore';


import styles from './ChatBox.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);


export default function ChatBox(props) {

    const { setCompletedLoad } = props;

    const { id } = useParams();

    const [currentUser, setCurrentUser] = useState({});
    const [userChat, setUserChat] = useState({});
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState('');


    const fetchDataUser = async () => {
        setLoading(true);
        try {
            const [response1, response2] = await Promise.all([
                axios.get(`http://genzii.vhiep.com:8000/api/auth/profile`, { withCredentials: true }),
                axios.get(`http://genzii.vhiep.com:8000/api/user/${id}`, { withCredentials: true })
            ]);

            const cur_user = response1.data.data.profile;
            const rev_user = response2.data.data.profile;

            setCurrentUser(cur_user);
            setUserChat(rev_user);
            
            await fetchChatsOfCurrentUsers(cur_user, rev_user);

        } catch (error) {
            // console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserbyUid = (uid) => {
        axios.get(`http://genzii.vhiep.com:8000/api/user/${uid}`, {
            withCredentials: true  // Cho phép Axios sử dụng cookie
        })
            .then(response => {
                if (response.data.error === false) {
                    // console.log(response.data.data.profile);
                    setUserChat(response.data.data.profile);
                }
            })
            .catch(error => {
                // console.error('Error fetching data:', error);
            });
    }

    const fetchChatsOfCurrentUsers = async (cur_user, rev_user) => {
        try {
            if (cur_user && rev_user) {

                setLoading(true);
                const chatRoomUid = createChatRoomUid(cur_user.uid, rev_user.uid);

                const chatRef = query(collection(db, 'messages', chatRoomUid, "data"));

                const unsubscribe = onSnapshot(chatRef, (querySnapshot) => {
                    let chats_arr = [];
                    querySnapshot.forEach((doc) => {
                        const messageData = doc.data();
                        chats_arr.push({ id: doc.id, ...messageData });
                    });

                    chats_arr.sort((a, b) => b.timestamp - a.timestamp);
                    setChats(chats_arr);
                });
                setLoading(false);
                setCompletedLoad(true);

                return unsubscribe;
            } else {
                setChats([]);
            }
        } catch (error) {
            console.error('Error fetching units data:', error);
        }
    };

    function convertTimestampToTime(timestamp) {
        // Chuyển đổi timestamp từ Firestore thành đối tượng Date
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);

        // Lấy giờ và phút từ đối tượng Date
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Định dạng lại thành giờ:phút
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        return formattedTime;
    }

    function createChatRoomUid(uid1, uid2) {
        // So sánh hai uid
        const comparisonResult = uid1.localeCompare(uid2);

        // Nếu uid1 < uid2, trả về uid1--uid2, ngược lại trả về uid2--uid1
        return comparisonResult < 0 ? `${uid1}--${uid2}` : `${uid2}--${uid1}`;
    }

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                let mess_content = message;
                setMessage("");
    
                const currentTime = new Date();
                // const timestamp = currentTime.getTime();
    
                const chatRoomUid = createChatRoomUid(currentUser.uid, userChat.uid);
                // console.log(chatRoomUid);
    
                await addDoc(collection(db, "messages", `${chatRoomUid}`, "data"), {
                    from: currentUser.uid,
                    to: userChat.uid,
                    message: mess_content,
                    timestamp: currentTime
                });
    
                // Cập nhật tin nhắn cuối cùng phía người dùng hiện tại
                await setDoc(doc(db, "users", currentUser.uid, "chats", userChat.uid), {
                    from: currentUser.uid,
                    to: userChat.uid,
                    messages_id: chatRoomUid,
                    timestamp: currentTime,
                    last_message: mess_content
                });
    
                // Cập nhật tin nhắn cuối cùng phía người dùng còn lại
                await setDoc(doc(db, "users", userChat.uid, "chats", currentUser.uid), {
                    from: currentUser.uid,
                    to: userChat.uid,
                    messages_id: chatRoomUid,
                    timestamp: currentTime,
                    last_message: mess_content
                });  
    
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        setChats([]);
        fetchDataUser();
    }, [])

    return (
        <>
            {
                loading
                &&
                <div className={cn('loading-container')}>
                    <LoadingMini></LoadingMini>
                </div>
                ||
                <>
                    <div className={cn('Chat_content-title')}>
                        <div className={cn('Chat_content-title-left')}>
                            <div className={cn('avatar-frame')}>
                                <img src={userChat?.current_avatar?.url} alt="" />
                            </div>
                            <h3 className={cn('username')}>{userChat?.uid}</h3>
                        </div>
                        <i className={cn('bx bx-dots-horizontal-rounded')}></i>
                    </div>
                    <div className={cn('Chat_content-msg')}>
                        {
                            chats?.map((chat) => {
                                return (
                                    <div className={cn('Chat_content-msg-item', {'msg-send': chat.from !== id})} key={chat.id}>
                                        <div className={cn('msg-item-avt')}>
                                            <img src={chat.from === id ? userChat?.current_avatar?.url : currentUser?.current_avatar?.url} alt="" />
                                        </div>
                                        <div className={cn('msg-item-content')}>
                                            <p style={{maxWidth: '600px', overflow: 'hidden'}}>{chat.message}</p>
                                        </div>
                                        <ion-icon name="ellipse"></ion-icon>
                                        <span>{convertTimestampToTime(chat.timestamp)}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={cn('Chat_content-input')}>
                        <input type='text' placeholder='Nhập tin nhắn' value={message} 
                            onChange={(e) => { 
                                setMessage(e.target.value);
                            }}
                            onKeyDown={(e) => (e.key === 'Enter')?handleSendMessage():null}
                        />
                        <ion-icon name="send" onClick={() => handleSendMessage()}></ion-icon>
                    </div>
                </>
            }
        </>
    );
} 
