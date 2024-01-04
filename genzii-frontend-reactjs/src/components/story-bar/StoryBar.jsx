import { useEffect, useRef, useState } from "react";
import { StoryAPI } from "../../apis/apis";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/scss/navigation';
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { SeeDetailStory, AddStory } from "../components.js";

import plushIMG from '../../assets/images/general/plus.png';


import styles from './StoryBar.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);
 

export default function StoryBar() {

    const popupContainerRef = useRef(null);
    const popupRef = useRef(null);

    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);

    const [userHaveStoryList, setUserHaveStoryList] = useState([]);

    const [idUserSelect, setIdUserSelect] = useState(null);

    const [showPopupAddStory, setShowPopupAddStory] = useState(false);

    useEffect(() => {
        handleGetUserHaveStory();
    }, []);

    const handleGetUserHaveStory = async () => {

        let res = await StoryAPI.getUserHaveStory();

        if (!res.error) {
            setUserHaveStoryList(prev => [...prev, ...res.data.data]);
        } else {
            console.log(res);
        }
    }

    useEffect(() => { 
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) { 
                setIdUserSelect(null);
                setShowPopupAddStory(false)
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

    return (
        <div className={cn('container-story-bar')}>
            <div className={cn('story-slide')}>
                <Swiper 
                    slidesPerView={7}
                    spaceBetween={30} 
                    onBeforeInit={(swiper) => { 
                        setTimeout(() => {
                            // Override prevEl & nextEl now that refs are defined
                            swiper.params.navigation.prevEl = navigationPrevRef.current
                            swiper.params.navigation.nextEl = navigationNextRef.current

                            // Re-init navigation
                            swiper.navigation.destroy()
                            swiper.navigation.init()
                            swiper.navigation.update()
                        })
                    }}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className={cn('swiper-frame')}
                >

                    <SwiperSlide className={cn('story-item', 'btn-add-story')} key={-1}
                        onClick={() => setShowPopupAddStory(true)}
                    >
                        <div className={cn('story-ring')}>
                            <div className={cn('inner-ring')}></div>
                        </div>
                        <div className={cn('story-frame')}>
                            <img src={plushIMG} alt='banner'></img>
                        </div>
                        <p className={cn('user-name')}>me</p>
                    </SwiperSlide> 

                    {
                        userHaveStoryList.map((user, i) => {
                            return (
                                <SwiperSlide className={cn('story-item')} key={user.id+i}
                                    onClick={() => setIdUserSelect(user.id)}
                                >
                                    <div className={cn('story-ring')}>
                                        <div className={cn('inner-ring')}></div>
                                    </div>
                                    <div className={cn('story-frame')}>
                                        <img src={user.current_avatar.url} alt='banner'></img>
                                    </div>
                                    <p className={cn('user-name')}>{user.uid}</p>
                                </SwiperSlide> 
                            )
                        })
                    }
                </Swiper>
            </div>

            <button ref={navigationNextRef} className={cn('btn-slide-next')}>
                <ion-icon name="chevron-forward-outline" alt="icon navigate"></ion-icon>
            </button>
            <button ref={navigationPrevRef} className={cn('btn-slide-prev')}>
                <ion-icon name="chevron-back-outline" alt="icon navigate"></ion-icon>
            </button>

            <div ref={popupContainerRef} className={cn('popup', {'show': (idUserSelect || showPopupAddStory)})}>
                <div ref={popupRef} className={cn('container')}>
                    {
                        idUserSelect
                        &&
                        <SeeDetailStory data={{idUserSelect}}></SeeDetailStory>
                    }
                    {
                        showPopupAddStory
                        &&
                        <AddStory func={{setShowPopupAddStory}}></AddStory>
                    }
                </div>
            </div> 
        </div>
    );
};