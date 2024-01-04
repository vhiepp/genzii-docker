

import { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AddPosts, LoadingMini, Popup, SeeDetailPostsInPopup } from '../components.js';

import { AuthenAPI, FollowAPI, StoryAPI } from '../../apis/apis.js';

import { ControllerModeContext } from '../../contexts/controll-mode/ControllMode.js';

import { UserInfoGlobal } from '../../contexts/user-global/UserGlobalContext.js';
import InfiniteScroll from 'react-infinite-scroll-component';

import trademark from '../../assets/images/trademark/Genzii.png';

import styles from './SideBar.module.scss';
import classnames from 'classnames/bind';
import { axiosAppJson } from '../../configs/index.js';
import { ControllerPopupContext } from '../../contexts/controll-popup/ControllPopup.js';
const cn = classnames.bind(styles);

const init_navigate_list = [
    {
        name: 'Thêm bài viết',
        url_path: '/add-posts',
        url_search: null, 
        is_select: false
    },
    {
        name: 'Trang chủ',
        url_path: '/',
        url_search: null,
        properties: {},
        is_select: false
    },
    {
        name: 'Tìm kiếm',
        url_path: null,
        url_search: null,
        properties: {},
        is_select: false
    },
    {
        name: 'Bạn bè',
        url_path: '/friends',
        url_search: null,
        properties: {},
        is_select: false
    },
    {
        name: 'Tin nhắn',
        url_path: '/messages',
        url_search: null,
        properties: {},
        is_select: false
    },
    {
        name: 'Thông báo',
        url_path: null,
        url_search: null,
        properties: {},
        is_select: false
    },
    {
        name: 'user',
        url_path: '/profile',
        url_search: null,
        properties: {},
        is_select: false
    }
]

let typingTimer;

export default function SideBar() {

    const navigate = useNavigate();

    const popupContainerRef = useRef(null);
    const popupRef = useRef(null);
    const [idPostsSeeDetail, setIdPostsSeeDetail] = useState(null);

    const {userInfoGlobal, setUserInfGlobal} = useContext(UserInfoGlobal);
    const {darkMode, setDarkMode} = useContext(ControllerModeContext);
    const {showPopupFullScreen, setShowPopupFullScreen} = useContext(ControllerPopupContext);

    const location = useLocation();
    const [navigateList, setNavigateList] = useState(init_navigate_list);


    const [showAddPostsPopup, setShowAddPostsPopup] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNotificationsPopup, setShowNotificationsPopup] = useState(false);

    const popupPartScreenRef = useRef(null);
    const navAddPostsRef = useRef(null);
    const navSearchRef = useRef(null);
    const navNotificationsRef = useRef(null);

    const dropdownOptionsRef = useRef(null);

    const [showDropdownOptions, setShowDropdownOptions] = useState(false);

    const [loadSearchApi, setLoadSearchApi] = useState(false);
    const [userSearchList, setUserSearchList] = useState([]);
    const [searchInfo, setSearchInfo] = useState({search_key: '', page: 1});
    
    const [newNotificationList, setNewNotificationList] = useState([]);
    const [oldNotificationList, setOldNotificationList] = useState({data: [], page: 1})
    const [loadingNewNotification, setLoadingNewNofitication] = useState(false);
    const [loadingOldNotification, setLoadingOldNofitication] = useState(false);

    const [haveStory, setHaveStory] = useState(false);
    

    useEffect(() => {
        handleSelectNavigate();
        setShowAddPostsPopup(false);
        setShowSearchPopup(false);
        setShowNotificationsPopup(false);
    }, [location]);

    useEffect(() => {
        handleGetStoryOfUser();
    }, []);

    const handleGetStoryOfUser = async () => {
        let res = await StoryAPI.getStoryByIdUser(userInfoGlobal?.profile.uid);

        if (!res.error) {
            setHaveStory(res.data.length>0?true:false);
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    }

    const handleSelectNavigate = () => {
        const path = location.pathname.split('/');

        setNavigateList(prev => {
            let newPrev = prev.map((item) => { 
                if (item.url_path == ('/' + path[1])) {
                    return { ...item, is_select: true };
                } else {
                    return { ...item, is_select: false };
                }
            })
            return newPrev;
        })
    }

    const handleGetSearch = async (e) => {
        if (!loadSearchApi && e.target.value.length > 1) { setLoadSearchApi(true); setUserSearchList([]) }
        if (loadSearchApi && e.target.value.length <= 1) {
            setLoadSearchApi(false);
        }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(async () => {
            if (e.target.value.length > 1) {
                console.log('search...');
                const res = await axiosAppJson.post('/search/user', {search_key: e.target.value}, {timeout: 60000});
                if (!res.data.data.error) {
                    console.log(res.data.data);
                    setSearchInfo({
                        search_key: e.target.value,
                        page: res.data.data.current_page < res.data.data.last_page ? res.data.data.current_page+1 : null
                    });
                    setUserSearchList(prev => [...res.data.data.data]);
                    setLoadSearchApi(false);
                }
            }
        }, 1200);
    }

    const handleGetSearchMore = async () => {
        console.log('search more');
        if (searchInfo.page && searchInfo.search_key) {
            const res = await axiosAppJson.post('/search/user', {search_key: searchInfo.search_key, page: searchInfo.page}, {timeout: 60000});
            if (!res.data.error && !loadSearchApi) {
                setSearchInfo(prev => ({
                    search_key: prev.search_key,
                    page: res.data.data.current_page < res.data.data.last_page ? res.data.data.current_page+1 : null
                }));
                setUserSearchList(prev => [...prev, ...res.data.data.data]);
            }
        }
    }

    const handleFollow = async (id_user, index) => {
        let res = await FollowAPI.follow(id_user);

        if (!res.error) {
            const userListTemp = [...userSearchList];
            userListTemp[index].is_following = true;
            setUserSearchList(userListTemp);
        }
    }

    const handleGetNewNotification = async () => {
        setLoadingNewNofitication(true)
        const res = await axiosAppJson.get('/notifications/new');
        
        if (!res.data.error) {
            setLoadingNewNofitication(false)
            setNewNotificationList(res.data.data);
        }
    };

    const handleGetOldNotification = async () => {
        if (oldNotificationList.page !== null) {
            setLoadingOldNofitication(true)
            const res = await axiosAppJson.get(`/notifications/old?page=${oldNotificationList.page}`);
            if (!res.data.error) {
                setLoadingOldNofitication(false)
                setOldNotificationList(prev => ({
                    data: [...prev.data, ...res.data.data.data],
                    page: res.data.data.current_page < res.data.data.last_page ? res.data.data.current_page+1 : null
                }));
            }
        }
    };

    const handleClickDetailNotification = async (notification) => {
        setShowNotificationsPopup(false);
        if (notification.status === 'not_seen') {
            await axiosAppJson.post('/notifications/seen', {notification_id: notification.id})
        }
        switch (notification.type) {
            case 'new_friend_request':
            case 'agreed_friend_request':
                navigate('/friends');
                break;
            case 'like_post':
            case 'comment_post':
                setIdPostsSeeDetail(notification.detail_data.post_id)
                break;

        }
    }

    const handleModifiedPostsLocal = async (type, id_posts) => {
        console.log('handleModifiedPosts');
    }

    // --------- handle out click for popup
    useEffect(() => { 
        document.addEventListener('click', handleClickOutside)
        return () => { document.removeEventListener('click', handleClickOutside) }
    }, [])

    useEffect(() => { 
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) { 
                setIdPostsSeeDetail(null);
            }
        }

        if (popupContainerRef && popupContainerRef.current) {
            popupContainerRef.current.addEventListener('click', handleClickOutside);
        }

        return () => { 
            try {
                popupContainerRef.current.removeEventListener('click', handleClickOutside)
            } catch (error) {
                console.log(error);
            }
         }
    }, []);

    const handleClickOutside = async (event) => {
        if (navSearchRef.current && navSearchRef.current.contains(event.target) || navNotificationsRef.current && navNotificationsRef.current.contains(event.target)) {
            
            if (navSearchRef.current.contains(event.target))
                setShowNotificationsPopup(false);

            if (navNotificationsRef.current.contains(event.target))
                setShowSearchPopup(false);
        } else {
            if (popupPartScreenRef.current && !popupPartScreenRef.current.contains(event.target)) { 
                setShowAddPostsPopup(false);
                setShowSearchPopup(false);
                setShowNotificationsPopup(false);
            }
        }

        if (dropdownOptionsRef && !dropdownOptionsRef.current.contains(event.target)) {
            setShowDropdownOptions(false);
        }
    };

    const hanldeSignout = async () => {
        let res = await AuthenAPI.signOut();

        if (!res.error) {
            setUserInfGlobal(null);
            window.location.href = '/sign-in';
        }
    }
    
    useEffect(() => {
        if (showSearchPopup || showNotificationsPopup) {
            const path = location.pathname.split('/');

            setNavigateList(prev => {
                let newPrev = prev.map((item) => { 
                    if (item.url_path == ('/' + path[1])) {
                        return { ...item, is_select: false};
                    } else {
                        return { ...item, is_select: false};
                    }
                })
                return newPrev;
            })

            if (showNotificationsPopup) {
                setOldNotificationList({data: [], page: 1});
                handleGetNewNotification();
                handleGetOldNotification();
            }
        } else {
            setOldNotificationList({data: [], page: 1});
            handleSelectNavigate();
        }
    }, [showAddPostsPopup, showSearchPopup, showNotificationsPopup]);

    return (
        <div className={cn('container-side-bar')}>
            <div className={cn('trademark')}>
                <div className={cn('trademart_frame')}>
                    <img src={trademark} alt="genzii" />
                </div>
            </div>
            <div className={cn('nav-list') + " button-my"}>
                <div ref={navAddPostsRef} className={cn('nav_item', 'btn-gradient')}
                    onClick={() => setShowAddPostsPopup(true)}
                >
                    <ion-icon name="add-outline"></ion-icon>
                    <span>Thêm bài viết</span>
                </div>
                <Link to={`${navigateList[1].url_path}`} className={cn('nav_item', 'nav_btn-non-bg', {'nav_btn-active': navigateList[1].is_select})}>
                    <ion-icon name="home-outline"></ion-icon>
                    <span>Trang chủ</span>
                </Link>
                <div ref={navSearchRef} className={cn('nav_item', 'nav_btn-non-bg', {'nav_btn-active': showSearchPopup})}
                    onClick={() => setShowSearchPopup(true)}
                >
                    <ion-icon name="search-outline"></ion-icon>
                    <span>Tìm kiếm</span>
                </div>
                <Link to={`${navigateList[3].url_path}`} className={cn('nav_item', 'nav_btn-non-bg', {'nav_btn-active': navigateList[3].is_select})}>
                    <ion-icon name="people-outline"></ion-icon>
                    <span>Bạn bè</span>
                </Link>
                <Link to={`${navigateList[4].url_path}`} className={cn('nav_item', 'nav_btn-non-bg', {'nav_btn-active': navigateList[4].is_select})}>
                    <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                    <span>Tin nhắn</span>
                </Link>
                <div ref={navNotificationsRef} className={cn('nav_item', 'nav_btn-non-bg', {'nav_btn-active': showNotificationsPopup})}
                    onClick={() => setShowNotificationsPopup(true)}
                >
                    <ion-icon name="heart-outline"></ion-icon>
                    <span>Thông báo</span>
                </div>
            </div>
            <div className={cn('options-user')}>
                {
                    userInfoGlobal
                    &&
                    <div className={cn('user', 'nav_btn-non-bg', {'nav_btn-active': navigateList[6].is_select})}>
                        <div className={cn('user_left')}>
                            <Link to='/profile' className={cn('user_avatar')} >
                                {
                                    haveStory
                                    &&
                                    <div className={cn('story-ring')}>
                                        <div className={cn('inner-ring')}></div>
                                    </div>
                                }
                                <div className={cn('user_frame')}>
                                    <img src={userInfoGlobal?.profile.current_avatar.url} alt='avatar'></img>
                                </div>
                            </Link>
                            <Link to='/profile' className={cn('user_name')}>{userInfoGlobal?.profile.uid}</Link>
                        </div>

                        <div className={cn('user_right')}>
                            <div ref={dropdownOptionsRef} className={cn('btn-options')}>
                                <ion-icon name="ellipsis-horizontal"
                                    onClick={() => setShowDropdownOptions(prev => !prev)}
                                ></ion-icon>

                                <div className={cn('dropdown-options', {'show': showDropdownOptions})}>
                                    <div className={cn('option-item')}
                                        onClick={() => {
                                            hanldeSignout();
                                        }}
                                    >
                                        <ion-icon name="log-out-outline"></ion-icon>
                                        <span>Đăng xuất</span>
                                    </div>
                                    <div className={cn('option-item')}
                                        onClick={() => setDarkMode(prev => !prev)}
                                    >
                                        <ion-icon name="contrast-outline"></ion-icon>
                                        <span>Chế độ sáng tối</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ||
                    <button type='button'>Đăng nhập</button>
                }
            </div>
            {
                showAddPostsPopup
                &&
                <div className={cn('popup-full-screen')}>
                    <div className={cn('btn-close', 'btn-none-bg')}
                        onClick={() => setShowAddPostsPopup(false)}
                    >
                        <ion-icon name="close"></ion-icon>
                    </div>
                    <AddPosts props={{setShowAddPostsPopup}}></AddPosts>
                </div>
            }

            {
                showSearchPopup
                &&
                <div className={cn('popup-part-container')}>
                    <div ref={popupPartScreenRef} className={cn('popup-search')}>
                        <div className={cn('head')}>
                            <span className={cn('head_left')}>Tìm kiếm</span>
                            <div className={cn('head_right')}
                                onClick={() => setShowSearchPopup(false)}
                            >
                                <ion-icon name="close"></ion-icon>
                            </div>
                        </div>
                        <div className={cn('search')}>
                            <div className={cn('input-cluster')}>
                                <ion-icon name="search"></ion-icon>
                                <input type='text' autoComplete='off' placeholder='Tìm kiếm' onChange={handleGetSearch} />
                            </div>
                        </div>
                        <div className={cn('body')} style={{overflow: 'hidden'}}>
                            {
                                userSearchList.length === 0 && !loadSearchApi && searchInfo.page === null && 
                                <small><i><p style={{textAlign: 'center'}}>Không tìm thấy</p></i></small>
                            }
                            {
                                loadSearchApi &&
                                <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                    <LoadingMini></LoadingMini>
                                </div>
                            }
                            {
                                userSearchList.length > 0 && !loadSearchApi &&
                                <InfiniteScroll
                                    dataLength={userSearchList.length}
                                    next={handleGetSearchMore}
                                    hasMore={!!searchInfo.page}
                                    className={cn('body')}
                                    loader={
                                        <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                            <LoadingMini/>
                                        </div>
                                    }
                                    height={"100%"}
                                    scrollThreshold={0.7}
                                    endMessage={
                                        <small><i><p style={{textAlign: 'center'}}>Đã hiển thị tất cả</p></i></small>
                                    }
                                >{
                                userSearchList.map((userInfo, index) => (
                                    <div className={cn('body-item')}>
                                        <div className={cn('body-item_left')}>
                                            <div className={cn('user-frame')}>
                                                <img src={userInfo?.current_avatar.url} onClick={() => navigate(`/user/${userInfo?.uid}`)} alt=''></img>
                                            </div>
                                            <Link to={`/user/${userInfo?.uid}`} className={cn('user-name')}>{userInfo?.uid}</Link>
                                        </div>
                                        <div className={cn('body-item_right')}>
                                            {
                                                userInfo?.is_following &&
                                                <button className={cn('btn-follow', 'btn-base')} type='button'>Đang theo dõi</button>
                                            }
                                            {
                                                !userInfo?.is_following &&
                                                <button className={cn('btn-follow', 'btn-gradient')} onClick={() => handleFollow(userInfo?.id, index)} type='button'>Theo dõi</button>
                                            }
                                        </div>
                                    </div>
                                ))}
                                </InfiniteScroll>
                            }
                        </div>
                    </div>
                </div>
            }
            {
                showNotificationsPopup
                &&
                <div className={cn('popup-part-container')}>
                    <div ref={popupPartScreenRef} className={cn('popup-notifications')}>
                        <div className={cn('head')}>
                            <span className={cn('head_left')}>Thông báo</span>
                            <div className={cn('head_right')} 
                                onClick={() =>  setShowNotificationsPopup(false)}
                            >
                                <ion-icon name="close"></ion-icon>
                            </div>
                        </div>
                        <div className={cn('body')}>
                            <InfiniteScroll
                                dataLength={oldNotificationList.data.length}
                                next={handleGetOldNotification}
                                hasMore={oldNotificationList.page !== null}
                                className={cn('body')}
                                // loader={
                                //     <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                //         <LoadingMini/>
                                //     </div>
                                // }
                                height={"100%"}
                                scrollThreshold={0.9}
                                endMessage={
                                    oldNotificationList.data.length > 0 ?
                                    <small><i><p style={{textAlign: 'center'}}>Đã hiển thị tất cả</p></i></small> :
                                    <small><i><p style={{textAlign: 'center'}}>Không có thông báo</p></i></small>
                                }
                            >
                                <div className={cn('recently')}>
                                    <span className={cn('title')}>Gần đây</span>
                                    {
                                        loadingNewNotification &&
                                        <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                            <LoadingMini></LoadingMini>
                                        </div>
                                    }
                                    {
                                        !loadingNewNotification && newNotificationList.length === 0 &&
                                        <small><i><p style={{textAlign: 'center'}}>Không có thông báo</p></i></small>
                                    }
                                    {
                                        !loadingNewNotification && newNotificationList.length > 0 &&
                                        newNotificationList.map((notification) => (
                                            <div className={cn('body-item')} onClick={() => handleClickDetailNotification(notification)}>
                                                <div className={cn('body-item_left')}>
                                                    <div className={cn('user-frame')}>
                                                        <img src={notification.done_by_user?.current_avatar.url} alt=''></img>
                                                    </div> 
                                                    <Link className={cn('user-name')} to={`/user/${notification.done_by_user?.uid}`}>{notification.done_by_user?.uid}</Link>
                                                    <p className={cn('content')} style={{cursor: 'pointer'}}>{notification.message}</p>
                                                    {
                                                        notification.status === 'not_seen' &&
                                                        <div className={cn('dot-see')}>
                                                            <ion-icon name="ellipse"></ion-icon>
                                                        </div>
                                                    }
                                                </div> 
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                                <div className={cn('before')}>
                                    <span className={cn('title')}>Trước đó</span>
                                    {
                                        oldNotificationList.data.length > 0 &&
                                        oldNotificationList.data.map((notification) => (
                                            <div className={cn('body-item')} onClick={() => handleClickDetailNotification(notification)}>
                                                <div className={cn('body-item_left')}>
                                                    <div className={cn('user-frame')}>
                                                        <img src={notification.done_by_user?.current_avatar.url} alt=''></img>
                                                    </div> 
                                                    <Link className={cn('user-name')} to={`/user/${notification.done_by_user?.uid}`}>{notification.done_by_user?.uid}</Link>
                                                    <p className={cn('content')} style={{cursor: 'pointer'}}>{notification.message}</p>
                                                    {
                                                        notification.status === 'not_seen' &&
                                                        <div className={cn('dot-see')}>
                                                            <ion-icon name="ellipse"></ion-icon>
                                                        </div>
                                                    }
                                                </div> 
                                            </div>
                                        ))
                                    }
                                    {
                                        loadingOldNotification &&
                                        <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                            <LoadingMini></LoadingMini>
                                        </div>
                                    }
                                </div>
                            </InfiniteScroll>
                            
                        </div>
                    </div>
                </div>
            }
            {
                <div ref={popupContainerRef} className={cn('popup', {'show': idPostsSeeDetail})}>
                    <div ref={popupRef} className={cn('container')}>
                        {
                            idPostsSeeDetail
                            &&
                            <SeeDetailPostsInPopup data={{idPostsSeeDetail}} func={{handleModifiedPostsLocal}}></SeeDetailPostsInPopup>
                        }
                    </div>
                </div>
            }
        </div>
    );
}; 