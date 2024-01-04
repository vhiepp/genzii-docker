
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { FollowAPI, FriendAPI, PostsAPI, ProfileAPI } from '../../apis/apis.js';

import { SeeDetailPostsInPopup } from '../../components/components.js';

import { ControllerPopupContext } from '../../contexts/controll-popup/ControllPopup.js';
import { LoadingMini, Popup } from "../../components/components.js";
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './User.module.scss';
import classnames from 'classnames/bind';
import { UserInfoGlobal } from "../../contexts/user-global/UserGlobalContext.js";
const cn = classnames.bind(styles);

export default function User() {

    const {showPopupFullScreen, setShowPopupFullScreen} = useContext(ControllerPopupContext);

    const url_app = useLocation();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [postsListOfUser, setPostsListOfUser] = useState([]);
    const [page, setPage] = useState(1);

    const [idPostsSeeDetail, setIdPostsSeeDetail] = useState(null);
    const {userInfoGlobal, setUserInfGlobal} = useContext(UserInfoGlobal);
    
    useEffect(() => { 
        if (userInfoGlobal && userInfoGlobal?.profile.uid === url_app.pathname.split('/')[2]) {
            navigate('/profile')
        }
        setUserInfo(null);
        handleGetProfile(url_app.pathname.split('/')[2]);
        setPage(1);
        setPostsListOfUser([])
    }, [url_app]);

    const handleGetProfile = async (user_uid) => {
        let res = await ProfileAPI.getProfileWithIDInParams(user_uid);

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
            handleGetPostsOfUser()
        }
    }, [userInfo]);

    const handleGetPostsOfUser = async () => {
        if (page) {
            console.log("load post for user");
            let res = await PostsAPI.getPostsOfUser(userInfo?.profile.uid, page);
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

    const handleDeleteFriend= async () => {
        let res = await FriendAPI.unfriend(userInfo?.profile.id);
        
        if (!res.error) {
            setUserInfo(prev => {
                return {...prev, is_send_invitaton: false}
            });
            handleModifiedUserInfoLocal('unfriend');
        }
    }

    const handleSendInvitation= async () => {
        let res = await FriendAPI.sendInvitationFriend(userInfo?.profile.id);
        
        if (!res.error) {
            setUserInfo(prev => {
                return {...prev, is_send_invitaton: false}
            });
            handleModifiedUserInfoLocal('invitation');
        }
    }

    const handleCancelInvitation= async () => {
        let res = await FriendAPI.cancelInvitationFriend(userInfo?.profile.id);

        if (!res.error) {
            setUserInfo(prev => {
                return {...prev, is_send_invitaton: false}
            });
            handleModifiedUserInfoLocal('cancel_invitation');
        }
    }

    const handleUnfollow= async () => {
        let res = await FollowAPI.unfollow(userInfo?.profile.id);
        
        if (!res.error) {
            setUserInfo(prev => {
                return {...prev, is_following: false}
            });
            handleModifiedUserInfoLocal('unfollow');
        }
    }

    const handleFollow = async () => {
        let res = await FollowAPI.follow(userInfo?.profile.id);

        if (!res.error) { 
            setUserInfo(prev => {
                return {...prev, is_following: true}
            });
            handleModifiedUserInfoLocal('follow');
        }
    }

    const handleModifiedUserInfoLocal = async (type) => {
        switch (type) {
            case 'invitation':
                setUserInfo(prev => { return {...prev, is_send_invitation: true} });
                break;
            case 'cancel_invitation':
                setUserInfo(prev => { return {...prev, is_send_invitation: false} });
                break;
            case 'unfriend':
                setUserInfo(prev => { return {...prev, is_friend: false} });
                break;
            case 'follow':
                setUserInfo(prev => { return {...prev, is_following: true} });
                break;
            case 'unfollow':
                setUserInfo(prev => { return {...prev, is_following: false} });
                break;
        }
    }


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
        >{
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
                            <div className={cn('user-avatar')} >
                                <div className={cn('story-ring')}>
                                    <div className={cn('inner-ring')}></div>
                                </div>
                                <div className={cn('user_frame')}>
                                    <img src={userInfo?.profile.current_avatar.url} alt='avatar'></img>
                                </div>
                            </div>
                            <div className={cn('user-name')}>
                                <span className={cn('user-name_main')}>{userInfo?.profile.uid}</span>
                                <span className={cn('user-name_nickname')}>{userInfo?.profile.full_name}</span>
                            </div>
                        </div>
                        <div className={cn('main-head_right')}>
                            {
                                userInfo?.is_friend
                                &&
                                <button className={cn('btn-del-friend', 'btn-base')} type="button"
                                    onClick={() => handleDeleteFriend()}
                                >Huỷ kết bạn</button>
                                ||
                                userInfo?.is_send_invitation
                                &&
                                <button type="button" className={cn('btn-cancel-invitation', 'btn-base')} 
                                    onClick={() => handleCancelInvitation()}
                                >Huỷ lời mời</button>
                                ||
                                <button className={cn('btn-add-friend', 'btn-base')} type="button"
                                    onClick={() => handleSendInvitation()}
                                >
                                    <ion-icon name="person-add-outline"></ion-icon>
                                </button>
                            }
                            <button className={cn('btn-chat', 'btn-base')} onClick={() => navigate(`/messages/${userInfo?.profile.uid}`)} type="button">Nhắn tin</button>
                            {
                                userInfo?.is_following
                                &&
                                <button className={cn('btn-follow', 'btn-base')} type="button"
                                    onClick={() => handleUnfollow()}
                                >Bỏ theo dõi</button>
                                ||
                                <button className={cn('btn-follow', 'btn-gradient')} type="button"
                                    onClick={() => handleFollow()}
                                >Theo dõi</button>
                            }
                        </div>
                    </div>
                    <div className={cn('sub-head')}>
                        <div className={cn('statistical-bar')}>
                            <div className={cn('statistical_item')}>
                                <span className={cn('number')}>{userInfo?.posts.total_short}</span>
                                <span className={cn('desc')}>bài viết</span>
                            </div>
                            <div className={cn('statistical_item')}>
                                <span className={cn('number')}>{userInfo?.followers.total_short}</span>
                                <span className={cn('desc')}>người theo dõi</span>
                            </div>
                            <div className={cn('statistical_item')}>
                                <span className={cn('number')}>{userInfo?.following.total_short}</span>
                                <span className={cn('desc')}>đang theo dõi</span>
                            </div>
                        </div>
                        <div className={cn('desc-myself')}>
                            <span className={cn('content')}>{userInfo?.profile.email}</span>
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
                        <SeeDetailPostsInPopup data={{idPostsSeeDetail}}></SeeDetailPostsInPopup>
                    </Popup>
                }
            </div>}
        </InfiniteScroll>
    );
}