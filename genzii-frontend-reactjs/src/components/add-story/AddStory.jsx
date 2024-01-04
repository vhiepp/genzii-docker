

import { useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

import { StoryAPI } from '../../apis/apis';

import { UserInfoGlobal } from '../../contexts/user-global/UserGlobalContext.js';

import successIMG from '../../assets/images/general/success.png';


import styles from './AddStory.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

const role_init = [
    {
        id: 'all',
        html: '<ion-icon name="earth-outline"></ion-icon></ion-icon><span>Mọi người</span>',
    },
    {
        id: 'friends',
        html: '<ion-icon name="people-outline"></ion-icon><span>Bạn bè</span>',
    },
    {
        id: 'only_me',
        html: '<ion-icon name="lock-closed-outline"></ion-icon><span>Chỉ mình tôi</span>',
    },
]

export default function AddStory({func}) {  

    const now_time = Date.now();
    
    const {userInfoGlobal, setUserInfGlobal} = useContext(UserInfoGlobal);

    const inputAddVideoRef = useRef(null);

    const [dataVideoUpload, setDataVideoUpload] = useState({file: null, url: ''});

    const [roleList, setRoleList] = useState(role_init);
    const [indexRoleSelect, setIndexRoleSelect] = useState(0);
    const [showDropdownRole, setShowDropdownRole] = useState(false);

    const [createStorySuccess, setCreateStorySuccess] = useState(false);

    const [countDown, setCountDown] = useState(3);


    const handleSelectVideoPosts = (file) => {
        setDataVideoUpload({
            file: file,
            url: URL.createObjectURL(file)
        });
    }

    const handleUploadStory = async () => {
        var form = new FormData();
        form.append('limit', roleList[indexRoleSelect].id); 
        form.append('media', dataVideoUpload.file);
 
        
        const res = await axios({
            method: 'post',
            url: process.env.REACT_APP_DOMAIN_BACKEND+process.env.REACT_APP_API_STORY_CREATE_STORY,
            data: form,
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.error) {
            setCreateStorySuccess(true);
        } else {
            console.log(res);
        }
    }

    useEffect(() => {

        let intervalId;

        if (createStorySuccess) {
            intervalId = setInterval(() => {
                setCountDown(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        func.setShowPopupAddStory(false);
                        return prev;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);

    }, [createStorySuccess]);

    return (
        !createStorySuccess
        &&
        <div className={cn('container-add-story')}>
            <div className={cn('head')}>
                <span className={cn('title')}>Thêm tin mới</span>    
            </div>
            <div className={cn('body')}>
                <div className={cn('user-area')}>
                    <div className={cn('user-avatar')} >
                        <div className={cn('story-ring')}>
                            <div className={cn('inner-ring')}></div>
                        </div>
                        <div className={cn('avatar-frame')}>
                            <img src={userInfoGlobal.profile.current_avatar.url} alt='avatar'></img>
                        </div>
                    </div>
                    <div className={cn('user-name')}>{userInfoGlobal.profile.uid}</div>
                    <span  className={cn('separator')}><ion-icon name="ellipse"></ion-icon></span>
                    <span className={cn('time')}>{moment.unix(Math.floor(now_time / 1000)).format('DD-MM-YYYY HH:mm')}</span>
                </div>
                <div className={cn('add-story')}>
                    {
                        dataVideoUpload.file
                        &&
                        <div className={cn('story')}>
                            <video key={dataVideoUpload.url} width="500" height="666" controls autoPlay={true}>
                                <source src={dataVideoUpload.url} type="video/mp4" />
                            </video>
                            <div className={cn('cover-del-image-posts')}>
                                <div className={cn('btn-del')}
                                    onClick={() => setDataVideoUpload({file: null, url: null})}
                                >
                                    <ion-icon name="trash"></ion-icon>
                                </div>
                            </div>
                        </div>
                        ||
                        <div className={cn('story')}>
                            <div className={cn('icon-add-image-frame')}>
                                <ion-icon name="play-outline"></ion-icon>
                            </div>
                            <label htmlFor="input_add_image" className={cn('btn-add-image', 'btn-base')} type='button'
                                onClick={() => inputAddVideoRef.onClick}
                            >
                                <ion-icon name="add"></ion-icon>
                                <span>Thêm video</span>
                            </label>
                            <input id="input_add_image" ref={inputAddVideoRef} className={cn('input-add-image-controll')} name="posts" type="file" accept=".mp4"
                                onChange={(e) => {handleSelectVideoPosts(e.target.files[0])}}
                                value={dataVideoUpload.file || ''}
                            ></input>
                        </div> 
                    }
                </div>
                <div className={cn('options')}>
                    <span className={cn('title')}>Hiển thị với</span>
                    <div className={cn('btn-option')}
                        onClick={() => setShowDropdownRole(prev => !prev)}
                    >
                        <div className={cn('left')}
                            dangerouslySetInnerHTML={{ __html: roleList[indexRoleSelect].html }}
                        >
                            
                        </div>
                        <div className={cn('right')}>
                            {
                                showDropdownRole
                                &&
                                <ion-icon name="chevron-up"></ion-icon>
                                ||
                                <ion-icon name="chevron-down"></ion-icon>
                            }
                        </div>
                        {
                            showDropdownRole
                            &&
                            <div className={cn('dropdown')}>
                                {
                                    roleList.map((role, index) => {
                                        return (
                                            <div className={cn('item')} dangerouslySetInnerHTML={{ __html: role.html }}
                                                onClick={() => setIndexRoleSelect(index)}
                                            ></div>
                                        );
                                    })
                                } 
                            </div>
                        }
                    </div>
                </div>
                <div className={cn('button-bar')}>
                    <button type="button" className={cn('btn-cancel', 'btn-base')}
                        onClick={() => func.setShowPopupAddStory(false)}
                    >Huỷ</button>
                    <button type="button" className={cn('btn-submit', 'btn-gradient')}
                        onClick={() => handleUploadStory()}
                    >Đăng tin</button>
                </div>
            </div>
        </div>
        ||
        <div className={cn('container-add-story', 'success')}>
            <div className={cn('container')}>
                <div className={cn('pic-frame')}>
                    <img src={successIMG} alt=''></img>
                </div>
                <div className={cn('content')}>
                    <h3>Đăng story thành công</h3>
                    <p>Sẽ đóng trong {countDown}s nữa</p>
                </div>
            </div>
        </div>
    );
}