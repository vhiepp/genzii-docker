
import { useContext, useEffect, useRef, useState } from "react";
import { StoryBar, Posts, SeeDetailPostsInPopup } from "../../components/components";

import { PostsAPI } from "../../apis/apis.js";

import styles from './Home.module.scss';
import classnames from 'classnames/bind';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ControllerPopupContext } from "../../contexts/controll-popup/ControllPopup.js";
const cn = classnames.bind(styles);
const postLoadingList = new Array(Math.floor(Math.random()*10) + 2).fill(0);

export default function Home() { 

    const popupContainerRef = useRef(null);
    const popupRef = useRef(null);


    const [exceptPosts, setExceptPosts] = useState("[]");
    const [postsList, setPostsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idPostsSeeDetail, setIdPostsSeeDetail] = useState(null);

    useEffect(() => {
        handleGetPosts();
    }, []);

    const handleGetPosts = async () => {
        console.log('Load posts');
        setLoading(true);
        let res = await PostsAPI.getPostsInTimeline(exceptPosts); 

        if (!res.error) {
            setLoading(false);
            setPostsList(pre => [...pre, ...res.data.posts]);
            setExceptPosts(res.data.except_posts);
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    } 

    const handleModifiedPostsLocal = async (type, id_posts) => {

        console.log('handleModifiedPosts');

        switch (type) {
            case 'heart':
                setPostsList(prev => { 

                    let new_prev = prev.map(posts => {
                        if (posts.id == id_posts) {
                            let total_short_new = null;
                            if (posts.is_heart) {
                                total_short_new = Number(posts.heart.total_short)!==NaN?(Number(posts.heart.total_short)-1):posts.heart.total_short
                            } else {
                                total_short_new = Number(posts.heart.total_short)!==NaN?(Number(posts.heart.total_short)+1):posts.heart.total_short
                            }

                            console.log({
                                ...posts,
                                is_heart: !posts.is_heart,
                                heart: {
                                    ...posts.heart,
                                    total_short: total_short_new
                                }
                            });
        
                            return {
                                ...posts,
                                is_heart: !posts.is_heart,
                                heart: {
                                    ...posts.heart,
                                    total_short: total_short_new
                                }
                            }
                        } else {
                            return posts;
                        }
                    });

                    return new_prev;
                });
                break; 
        }
    }

    
    useEffect(() => { 
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) { 
                setIdPostsSeeDetail(null);
            }
        }

        if (popupContainerRef && popupContainerRef.current) {
            console.log('add envent listener');
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

    return (
        <InfiniteScroll
            dataLength={postsList.length}
            next={handleGetPosts}
            hasMore={true}
            className={cn('scroll-bar')}
            style={{width: '100%', overflowX: 'hidden'}}
            height={"100vh"}
            scrollThreshold={0.8}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
                </p>
            }
        >
            <div className={cn('container-home-page')}>
                <StoryBar key={'123'}></StoryBar>
                <div className={cn('timeline')}>
                    {
                        postsList.map(posts => {
                            return <Posts key={posts.id} data={posts} func={{setIdPostsSeeDetail}}></Posts>
                        })
                    }
                    {
                        loading &&
                        postLoadingList.map(posts => {
                            return <Posts data={posts} key={posts.id}></Posts>
                        })
                    }
                </div> 
                <div ref={popupContainerRef} className={cn('popup', {'show': idPostsSeeDetail})}>
                    <div ref={popupRef} className={cn('container')}>
                        {
                            idPostsSeeDetail
                            &&
                            <SeeDetailPostsInPopup data={{idPostsSeeDetail}} func={{handleModifiedPostsLocal}}></SeeDetailPostsInPopup>
                        }
                    </div>
                </div>
            </div>
        </InfiniteScroll>
    );
}