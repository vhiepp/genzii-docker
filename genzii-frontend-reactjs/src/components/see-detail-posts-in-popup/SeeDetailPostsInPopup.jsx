
import { useEffect, useState } from 'react';

import { CommentAPI, PostsAPI } from '../../apis/apis.js';

import InfiniteScroll from "react-infinite-scroll-component";

import moment from 'moment';

import styles from './SeeDetailPostsInPopup.module.scss';
import classnames from 'classnames/bind';
import { LoadingMini } from '../components.js';
const cn = classnames.bind(styles);

export default function SeeDetailPostsInPopup({data, func}) { 

    const [dataPosts, setDataPosts] = useState(null);
    
    const [commentsListOfPosts, setCommentsListOfPosts] = useState([]);
    const [paginateComment, setPaginateComment] = useState(null);
    
    const [commentInput, setCommentInput] = useState('');
    const [exCommentList, setExcommentList] = useState([]);

    const [loadingCreateComment, setLoadingCreateComment] = useState(false);

    useEffect(() => {
        handleGetPostsDetail();
    }, []);

    useEffect(() => {
        if (dataPosts)
            handleGetCommentsForPosts();
    }, [dataPosts]);

    const handleGetPostsDetail = async () => {
        let res = await PostsAPI.getPostsById(data.idPostsSeeDetail);

        if (!res.error) {
            setDataPosts(res.data);
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    }

    const handleGetCommentsForPosts = async () => {

        console.log('handle get comments for posts');

        let url = null;
        if (paginateComment && paginateComment.next_page_url)
            url = paginateComment.next_page_url;

        let res = await CommentAPI.getComments(dataPosts.id, url, exCommentList);

        if (!res.error) {
            setCommentsListOfPosts(prev => [...prev, ...res.data.data]);
            setPaginateComment(prev => {
                let {data, ...other} = res.data;
                return {...other};
            });
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }

    }

    const handleComment = async () => {
        setLoadingCreateComment(true);
        let res = await CommentAPI.createComment(dataPosts.id, commentInput.trim());

        if (!res.error) {
            // handleGetCommentsForPosts();
            setLoadingCreateComment(false);
            // handleModifiedPostsLocal('comment');
            setCommentsListOfPosts(prev => [res.data, ...prev]);
            setCommentInput('');
            setExcommentList(prev => [...prev, res.data.id])
        } else {
            if (res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
    }

    const handleHeartOrUnheartPosts = async () => {
        let res = await PostsAPI.heartOrUnheart(dataPosts.id);

        if (!res.error) {
            handleModifiedPostsLocal('heart');
            // if (func?.handleModifiedPostsLocal)
            //     func.handleModifiedPostsLocal('heart', dataPosts.id);
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
                setDataPosts(prev => { 

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
            case 'comment':
                setCommentsListOfPosts(prev => [...prev]);
                break; 
        }
    }  

    return (
        dataPosts
        &&
        <div className={cn('container-see-posts')}>
            <div className={cn('body')}>
                <div className={cn('body_left')}>
                    <div className={cn('image-posts-frame')}>
                        <img src={dataPosts.media[0].file_url} alt=''></img>
                    </div>
                </div>
                <div className={cn('body_right')}>
                    <div className={cn('top')}>
                        <div className={cn('user-area')}>
                            <div className={cn('user-avatar')} >
                                <div className={cn('story-ring')}>
                                    <div className={cn('inner-ring')}></div>
                                </div>
                                <div className={cn('avatar-frame')}>
                                    <img src={dataPosts.author?.current_avatar.url} alt='avatar'></img>
                                </div>
                            </div>
                            <div className={cn('user-name')}>{dataPosts.author?.uid}</div>
                            <span  className={cn('separator')}><ion-icon name="ellipse"></ion-icon></span>
                            <span className={cn('time')}>{moment.unix(dataPosts.created_at).format('DD-MM-YYYY HH:mm')}</span>
                        </div>
                        <div className={cn('caption')}>
                            <p>{dataPosts.caption}</p>
                        </div> 
                        <div className={cn('button-bar')}>
                            <div className={cn('heart-cluster', {'hearted': dataPosts.is_heart})}
                                onClick={() => handleHeartOrUnheartPosts()}
                            >
                                {
                                    dataPosts.is_heart
                                    &&
                                    <ion-icon name="heart"></ion-icon>
                                    ||
                                    <ion-icon name="heart-outline"></ion-icon>
                                }
                                <span>{dataPosts.heart.total_short}</span>
                            </div>
                            <div className={cn('comment-cluster')}>
                                <ion-icon name="chatbubble-outline"></ion-icon>
                                <span>{dataPosts.comment.total_short}</span>
                            </div>
                        </div>
                    </div>

                    <div className={cn('comment-container')}>
                        <InfiniteScroll  
                            className={cn('ifininity-scroll', 'scroll-bar')}
                            dataLength={commentsListOfPosts.length} //This is important field to render the next data 
                            next={() => handleGetCommentsForPosts()}
                            height={'100%'}
                            loader={
                                <div className={cn('loading')} style={{display: 'flex', justifyContent: 'center'}}>
                                    <LoadingMini/>
                                </div>
                            }
                            // next={() => (paginateComment && paginateComment.next_page_url===null)?null:handleGetCommentsForPosts()}
                            hasMore={paginateComment && paginateComment.next_page_url!=null}
                            scrollThreshold={0.6}
                            inverse={true}
                        >
                            {
                                commentsListOfPosts
                                &&
                                commentsListOfPosts.map((comment) => {
                                    return (
                                        <div className={cn('comment-item')} key={comment.id + Math.random()}>
                                            <div className={cn('avatar-frame')}>
                                                <img src={comment.author?.current_avatar.url} alt=''></img>
                                            </div>
                                            <div className={cn('content')}>
                                                <div className={cn('left')}>
                                                    <div className={cn('user-name')}>{comment.author?.uid}</div>
                                                    <p className={cn('time')}>{moment.unix(comment.created_at).format('DD-MM-YYYY')}</p>
                                                    {/* <p className={cn('time')}>{moment.unix(comment.created_at).format('DD-MM-YYYY HH:mm:ss')}</p> */}
                                                </div>
                                                <div className={cn('right')}>
                                                    <span className={cn('cmt')}>{comment.content}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            } 
                        </InfiniteScroll>
                    </div>
                    <div className={cn('comment-bar')}> 
                        <div className={cn('input-cluster')}>
                            <input type='text' placeholder='Nhập bình luận'
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            ></input>
                        </div>
                        <button type='button' className={cn('btn-comment')}
                            onClick={() => {
                                if (!loadingCreateComment && commentInput.trim())
                                    handleComment();
                            }}
                        >
                            {/* <ion-icon name="send"></ion-icon> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
                                <path d="M18.6168 8.86915L18.6105 8.86641L1.92773 1.94688C1.78741 1.88815 1.63472 1.86512 1.48332 1.87984C1.33192 1.89456 1.18653 1.94659 1.06016 2.03126C0.926639 2.11874 0.816966 2.23805 0.741006 2.37845C0.665046 2.51885 0.625182 2.67592 0.625 2.83555V7.26094C0.625074 7.47917 0.701273 7.69053 0.840463 7.8586C0.979653 8.02666 1.17311 8.14091 1.3875 8.18165L10.4863 9.86407C10.5221 9.87085 10.5543 9.88989 10.5776 9.91792C10.6008 9.94594 10.6135 9.98119 10.6135 10.0176C10.6135 10.054 10.6008 10.0892 10.5776 10.1173C10.5543 10.1453 10.5221 10.1643 10.4863 10.1711L1.38789 11.8535C1.17356 11.8942 0.980114 12.0082 0.840862 12.1762C0.70161 12.3441 0.625273 12.5553 0.625 12.7734V17.1996C0.624896 17.352 0.662638 17.5021 0.734839 17.6364C0.80704 17.7706 0.91144 17.8848 1.03867 17.9688C1.19172 18.0704 1.37133 18.1248 1.55508 18.125C1.68282 18.1249 1.80925 18.0993 1.92695 18.0496L18.6094 11.1695L18.6168 11.166C18.8414 11.0695 19.0327 10.9093 19.1671 10.7052C19.3016 10.5011 19.3732 10.262 19.3732 10.0176C19.3732 9.77317 19.3016 9.53411 19.1671 9.32999C19.0327 9.12588 18.8414 8.96565 18.6168 8.86915Z" fill="url(#paint0_linear_53_230)"/>
                                <defs>
                                <linearGradient id="paint0_linear_53_230" x1="0.625" y1="20.4947" x2="22.5241" y2="17.3421" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#0072FF"/>
                                    <stop offset="1" stop-color="#00C6FF"/>
                                </linearGradient>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}