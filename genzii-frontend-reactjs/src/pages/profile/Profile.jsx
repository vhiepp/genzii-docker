
import { useEffect, useState, useContext, useRef } from "react";

import { AuthenAPI, PostsAPI, StoryAPI } from '../../apis/apis.js';

import { SeeDetailPostsInPopup, SeeDetailStory } from '../../components/components.js';

import { ControllerPopupContext } from '../../contexts/controll-popup/ControllPopup.js';
import { LoadingMini, Popup } from "../../components/components.js";
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './Profile.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Profile() {

    const popupContainerRef = useRef(null);
    const popupRef = useRef(null);

    const {showPopupFullScreen, setShowPopupFullScreen} = useContext(ControllerPopupContext);

    const [userInfo, setUserInfo] = useState(null);
    const [postsListOfUser, setPostsListOfUser] = useState([]);
    const [storyListOfUser, setStoryListOfUser] = useState([]);
    const [page, setPage] = useState(1);

    const [idPostsSeeDetail, setIdPostsSeeDetail] = useState(null);
    const [showPopupDetailsStory, setShowPopupDetailsStory] = useState(false);
    
    useEffect(() => { 
        handleGetProfile();
    }, []);

    const handleGetProfile = async () => {
        let res = await AuthenAPI.getMyProfile();

        if (!res.error) {
            setUserInfo(res.data);
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    } 

    useEffect(() => { 
        if (userInfo) {
            handleGetPostsOfUser();
            handleGetStoryOfUser();
        }
    }, [userInfo]);

    const handleGetPostsOfUser = async () => {
        if (page) {
            console.log("load post for user");
            let res = await PostsAPI.getPostsOfUser(userInfo.profile.uid, page);
            if (!res.error) {
                if (res.data.current_page === res.data.last_page) {
                    setPage(null);
                } else {
                    setPage(res.data.current_page + 1);
                }
                setPostsListOfUser(pre => [...pre, ...res.data.data]);
            } else {
                if (res.err_from_server) {
                    console.log('failed in server');
                } else {
                    console.log(res);
                }
            }
        }
    }

    const handleGetStoryOfUser = async () => {
        let res = await StoryAPI.getStoryByIdUser(userInfo.profile.uid);

        if (!res.error) {
            setStoryListOfUser(res.data);
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    }

    const handleModifiedPostsLocal = (id_posts, data, type) => { 
        switch (type) {
            case 'delete_posts':
                setPostsListOfUser(prev => {
                    return prev.filter(posts => posts.id != id_posts);
                });
                setUserInfo(prev => {
                    prev.posts.total_short--;
                    return prev;
                });
            break;
        }
    }

    useEffect(() => { 
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) { 
                setShowPopupDetailsStory(false);
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

    console.log(userInfo);

    return (
        <InfiniteScroll
            dataLength={postsListOfUser.length}
            next={handleGetPostsOfUser}
            hasMore={page !== null}
            className={cn('scroll-bar')}
            style={{overflowX: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
            height={"100vh"}
            loader={(
                <div className={cn('loading')}>
                    <LoadingMini></LoadingMini>
                </div>
            )}
            endMessage={
                (postsListOfUser.length > 0 &&
                <small><i><p style={{textAlign: 'center', marginBottom: '50px'}}>Đã hiển thị hết bài viết</p></i></small>)
                ||
                (<small><i><p style={{textAlign: 'center', marginBottom: '50px'}}>Không có bài viết để hiển thị</p></i></small>)
            }
        >
            {
                !userInfo
                &&
                <div className={cn('loading')} style={{marginTop: '100px'}}>
                    <LoadingMini></LoadingMini>
                </div>
                ||
                <div className={cn('container-profile')}>
                    <div className={cn('head')}>
                        <div className={cn('main-head')}>
                            <div className={cn('main-head_left')}>
                                <div className={cn('user-avatar')} 
                                    onClick={() => storyListOfUser?.length?setShowPopupDetailsStory(true):null}
                                >
                                    {
                                        storyListOfUser?.length > 0
                                        &&
                                        <div className={cn('story-ring')}>
                                            <div className={cn('inner-ring')}></div>
                                        </div>
                                    }
                                    <div className={cn('user_frame')}>
                                        <img src={userInfo.profile.current_avatar.url} alt='avatar'></img>
                                    </div>
                                </div>
                                <div className={cn('user-name')}>
                                    <span className={cn('user-name_main')}>{userInfo.profile.uid}</span>
                                    <span className={cn('user-name_nickname')}>{userInfo.profile.full_name}</span>
                                </div>
                            </div>
                            <div className={cn('main-head_right')}> </div>
                        </div>
                        <div className={cn('sub-head')}>
                            <div className={cn('statistical-bar')}>
                                <div className={cn('statistical_item')}>
                                    <span className={cn('number')}>{userInfo.posts.total_short}</span>
                                    <span className={cn('desc')}>bài viết</span>
                                </div>
                                <div className={cn('statistical_item')}>
                                    <span className={cn('number')}>{userInfo.followers.total_short}</span>
                                    <span className={cn('desc')}>người theo dõi</span>
                                </div>
                                <div className={cn('statistical_item')}>
                                    <span className={cn('number')}>{userInfo.following.total_short}</span>
                                    <span className={cn('desc')}>đang theo dõi</span>
                                </div>
                            </div>
                            <div className={cn('desc-myself')}>
                                <span className={cn('content')}>{userInfo.profile.email}</span>
                                {/* <span className={cn('content')}>Mỗi ngày đều là ngày hạnh phúc</span> */}
                            </div>
                        </div>
                    </div>
                    <div className={cn('body')}>
                        <span className={cn('body_title')}>Bài viết</span>
                        <div className={cn('body_container')}>
                            {
                                postsListOfUser.map(posts => {
                                    return (
                                        <div className={cn('item')} key={posts.id}
                                            onClick={() => {
                                                setIdPostsSeeDetail(posts.id);
                                                setShowPopupFullScreen(true);
                                            }}
                                        >
                                            <div className={cn('pic-frame')}>
                                                <img src={posts.media[0].file_url} alt=""></img>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        showPopupFullScreen
                        &&
                        <Popup>
                            <SeeDetailPostsInPopup data={{idPostsSeeDetail}} func={{handleModifiedPostsLocal}}></SeeDetailPostsInPopup>
                        </Popup>
                    }
                </div>
            }
            <div ref={popupContainerRef} className={cn('popup', {'show': showPopupDetailsStory})}>
                <div ref={popupRef} className={cn('container')}>
                    {
                        showPopupDetailsStory
                        &&
                        <SeeDetailStory data={{idUserSelect: userInfo.profile.uid}}></SeeDetailStory>
                    } 
                </div>
            </div>
        </InfiniteScroll>
    );
}