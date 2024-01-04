

import { useEffect, useState, useRef } from 'react';
import { StoryAPI } from '../../apis/apis';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import 'swiper/scss/navigation'
// import required modules
import { Pagination, Navigation } from "swiper/modules";

import styles from './SeeDetailStory.module.scss';
import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
const cn = classnames.bind(styles);

export default function SeeDetailStory({data}) {

    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);

    const [storyList, setStoryList] = useState([]);


    const [indexStorySelect, setIndexStorySelect] = useState(0);

    useEffect(() => {
        handleGetStoryOfUserList();
    }, [])

    const handleGetStoryOfUserList = async () => {
        let res = await StoryAPI.getStoryByIdUser(data.idUserSelect);

        if (!res.error) {
            setStoryList(res.data)
        } else {
            console.log(res);
        }
    } 

    return (
        <div className={cn('container-see-detail-story')}>


            <button ref={navigationPrevRef} className={cn('btn-prev', {'transparent': (indexStorySelect == 0)})}
                onClick={() => setIndexStorySelect(prev => {
                    if (prev - 1 >= 0)
                        return prev - 1;
                    return prev; 
                })}
            >
                <ion-icon name="chevron-back-outline" alt="icon navigate"></ion-icon>
            </button> 

            <div className={cn('container')}>
                <div className={cn('head')}>
                    <span className={cn('title')}>Xem tin</span>    
                </div>
                <div className={cn('story')}>
                    {
                        storyList?.length
                        &&
                        <div className={cn('story_head')}>
                            <div className={cn('left')}>
                                <div className={cn('user-area')}>
                                    <Link to={`/user/${storyList[0].author.uid}`} className={cn('user-avatar')} >
                                        <div className={cn('story-ring')}>
                                            <div className={cn('inner-ring')}></div>
                                        </div>
                                        <div className={cn('avatar-frame')}>
                                            <img src={storyList[0].author.current_avatar.url} alt='avatar'></img>
                                        </div>
                                    </Link>
                                    <div className={cn('user-name')}>{storyList[0].author.uid}</div>
                                    {/* <span  className={cn('separator')}><ion-icon name="ellipse"></ion-icon></span> */}
                                    {/* <span className={cn('time')}>{moment.unix(Math.floor(now_time / 1000)).format('DD-MM-YYYY HH:mm')}</span> */}
                                </div>
                            </div>
                            <div className={cn('right')}>
                            </div>
                        </div>
                    }
                    {
                        storyList?.length
                        &&
                        <video key={indexStorySelect+Math.random()} controls autoPlay={true}>
                            <source src={storyList[indexStorySelect]?.media?.file_url} type="video/mp4" />
                        </video>
                    } 
                </div> 
            </div>
            
            <button ref={navigationNextRef} className={cn('btn-next', {'transparent': (indexStorySelect == storyList.length -1)})}
                onClick={() => setIndexStorySelect(prev => {
                    if (prev + 1 < storyList.length)
                        return prev + 1;
                    return prev; 
                })}
            >
                <ion-icon name="chevron-forward-outline" alt="icon navigate"></ion-icon>
            </button>
        </div>
    );
}