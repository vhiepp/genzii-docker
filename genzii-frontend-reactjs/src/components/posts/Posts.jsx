
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PostsAPI } from '../../apis/apis.js';

import moment from 'moment';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './Posts.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Posts({data, func}) { 

    const [postsData, setPostsData] = useState(data);

    const handleHeartOrUnheartPosts = async () => {
        let res = await PostsAPI.heartOrUnheart(postsData.id);

        if (!res.error) {
            handleModifiedPostsLocal('heart');
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    }

    const handleModifiedPostsLocal = async (type) => {
        switch (type) {
            case 'heart':
                setPostsData(prev => { 

                    let total_short_new = null;
                    if (prev.is_heart) {
                        total_short_new = Number(prev.heart.total_short)!==NaN?(Number(prev.heart.total_short)-1):prev.heart.total_short
                    } else {
                        total_short_new = Number(prev.heart.total_short)!==NaN?(Number(prev.heart.total_short)+1):prev.heart.total_short
                    }

                    return {
                        ...prev,
                        is_heart: !prev.is_heart,
                        heart: {
                            ...prev.heart,
                            total_short: total_short_new
                        }
                    } 
                });
                break; 
        }
    } 

    return (
        postsData.created_at
        &&
        <div className={cn('container-posts')}>
            <div className={cn('head')}>
                <div className={cn('head_top')}>
                    <div className={cn('head_top__left')}>
                        <div className={cn('user')}>
                            <div className={cn('user_avatar')}>
                                <div className={cn('story-ring')}>
                                    <div className={cn('inner-ring')}></div>
                                </div>
                                <div className={cn('user_frame')}>
                                    <img src={postsData.author.current_avatar.url} alt='avatar'></img>
                                </div>
                            </div>
                            <Link to={`/user/${postsData.author.uid}`} className={cn('user_name')}>{postsData.author.uid}</Link>
                            {/* <Link to={'/profile/9ade0188-d748-4bd8-acbd-c48c84248439'} className={cn('user_name')}>thu_huong_thu</Link> */}
                        </div>
                        <div className={cn('dot-status-access', 'online')}>
                            <ion-icon name="ellipse"></ion-icon>
                        </div>
                        <p className={cn('time')}>vào lúc {moment.unix(postsData.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>
                        {/* <p className={cn('time')}>vào lúc 20.11.2023 18:30</p> */}
                    </div>
                    <div className={cn('head_top__right')}>
                        <ion-icon name="ellipsis-horizontal"></ion-icon>
                    </div>
                </div>
                <div className={cn('head_caption')}>
                    <p>{postsData.caption}</p>    
                </div>
            </div>
            <div className={cn('content')}>
                <div className={cn('pic-frame')}>
                    <img src={postsData.media[0].file_url} alt=''></img>
                </div>
            </div>
            <div className={cn('foot')}>
                <div className={cn('foot_left')}>
                    <div className={cn('heart-cluster', {'hearted': postsData.is_heart})} 
                        onClick={() => handleHeartOrUnheartPosts()}
                    >
                        {
                            postsData.is_heart
                            &&
                            <ion-icon name="heart"></ion-icon>
                            ||
                            <ion-icon name="heart-outline"></ion-icon>
                        }
                        <span>{postsData.heart.total_short}</span>
                    </div>
                    <div className={cn('comment-cluster')}
                        onClick={() => func.setIdPostsSeeDetail(postsData.id)}
                    >
                        <ion-icon name="chatbubble-outline"></ion-icon>
                        <span>{postsData.comment.total_short}</span>
                    </div>
                </div>
                <div className={cn('foot_right')}>
                    
                </div>
            </div>
        </div>
        ||
        <div className={cn('container-posts')}>
            <div className={cn('head')}>
                <div className={cn('head_top')}>
                    <div className={cn('head_top__left')}>
                        <div className={cn('user')}>
                            <div className={cn('user_avatar')}>
                                <Skeleton width='54px' height='54px' borderRadius='100%'/>
                            </div>
                            <Skeleton width='100px' height='25px'/>
                        </div> 
                        <Skeleton width='130px' height='25px'/>
                    </div>
                    <div className={cn('head_top__right')}>
                    </div>
                </div>
                <div className={cn('head_caption')}>
                    <Skeleton width='370px' height='25px'/>    
                    <Skeleton width='450px' height='25px'/>    
                </div>
            </div>
            <div className={cn('content')}>
                <div className={cn('pic-frame')}>
                    <Skeleton width='100%' height='681px'/>
                </div>
            </div>
            <div className={cn('foot')}>
                <div className={cn('foot_left')}>
                    <div className={cn('heart-cluster')}>
                        <Skeleton width='30px' height='30px'/>
                        <Skeleton width='50px' height='30px'/>
                    </div>
                    <div className={cn('comment-cluster')}>
                        <Skeleton width='30px' height='30px'/>
                        <Skeleton width='50px' height='30px'/>
                    </div>
                </div>
                <div className={cn('foot_right')}>
                    
                </div>
            </div>
        </div>
    );
};