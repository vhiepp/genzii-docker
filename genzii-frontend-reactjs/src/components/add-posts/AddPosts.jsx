
import { Fragment, useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';

import moment from 'moment';

import Cropper from 'react-easy-crop';
import getCroppedImg from '../../extensions/crop-image/cropImage.js';

import successIMG from '../../assets/images/general/success.png';


import styles from './AddPosts.module.scss';
import classnames from 'classnames/bind';
import { UserInfoGlobal } from '../../contexts/user-global/UserGlobalContext.js';
const cn = classnames.bind(styles);


export default function AddPosts({props}) {

    const now_time = Date.now(); 

    const inputAddImageRef = useRef(null);

    const {userInfoGlobal} = useContext(UserInfoGlobal);

    const [imagePosts, setImagePosts] = useState({url: '', file: null});
    const [captionInput, setCaptionInput] = useState('');
    const [rulePost, setRulePost] = useState('all'); // public, friends, myself

    const [editImagePosts, setEditImagePosts] = useState(false);

    const [createPostsSuccess, setCreatePostsSuccess] = useState(false);

    const handleSelectImagePosts = (file) => { 
        setImagePosts({
            url: URL.createObjectURL(file),
            file: file
        }); 
    }

    const [imageCropParameters, setImageCropParameters] = useState({
        crop: { x: 0, y: 0 },
        rotation: 0,
        zoom: 1,
        cropped_area_percent: null,
        cropped_area_pixels: null,
    });

    const handleWriteImageCropParameters = (parameters, propertie) => { 

        switch (propertie) {
            case 'crop_change': 
                setImageCropParameters(prev => { return {...prev, crop: parameters}});
                break;
            case 'rotation_change':
                setImageCropParameters(prev => { return {...prev, rotation: parameters}});
                break;
            case 'zoom_change':
                setImageCropParameters(prev => { return {...prev, zoom: parameters}});
                break;
            case 'crop_complete':
                setImageCropParameters(prev => { return {...prev, cropped_area_percent: parameters[0], cropped_area_pixels: parameters[1]}});
                break;
        }
    }

    const handleCropImagePosts = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imagePosts.url,
                imageCropParameters.cropped_area_pixels,
                imageCropParameters.rotation
            );

            const blob = await fetch(croppedImage).then(response => response.blob());
            const file = new File([blob], 'image-posts.jpg', { type: blob.type });
            
            handleSelectImagePosts(file);
            setEditImagePosts(false);
        } catch (e) {
            console.error(e)
        }
    }  

    const handleUploadPosts = async () => { 

        var form = new FormData();
        form.append('caption', captionInput.trim());
        form.append('limit', rulePost);
        form.append('media', imagePosts.file);
 
        
        const res = await axios({
            method: 'post',
            url: process.env.REACT_APP_DOMAIN_BACKEND+process.env.REACT_APP_API_POSTS_CREATE_POSTS,
            data: form,
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.error) {
            setCreatePostsSuccess(true);
        } else {
            console.log(res);
        }
        // setCreatePostsSuccess(true);
    }

    const [countDown, setCountDown] = useState(5);

    useEffect(() => {

        let intervalId;

        if (createPostsSuccess) {
            intervalId = setInterval(async () => {
                setCountDown(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        props.setShowAddPostsPopup(false);
                        window.location.reload();
                        return prev;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);

    }, [createPostsSuccess]);


    return (
        !createPostsSuccess
        &&
        <div className={cn('container-add-posts')}>
            <div className={cn('title-bar')}>
                <span className={cn('title')}>Thêm bài viết mới</span>
            </div>
            <div className={cn('body')}>
                <div className={cn('body_left')}>
                    {
                        imagePosts.url !== ''
                        &&
                        (
                            !editImagePosts
                            &&
                            <div className={cn('image-posts-frame')}>
                                <img src={imagePosts.url} alt=''></img>
                                <div className={cn('cover-del-image-posts')}>
                                    <div className={cn('btn-del-image-posts')}>
                                        <ion-icon name="trash"
                                            onClick={() => setImagePosts({url: '', file: null})}
                                        ></ion-icon>
                                        <ion-icon name="create"
                                            onClick={() => setEditImagePosts(true)}
                                        ></ion-icon> 
                                    </div>
                                </div>
                            </div>
                            ||
                            <div className={cn('edit-image-area')}>
                                <Cropper
                                    image={imagePosts.url}
                                    crop={imageCropParameters.crop}
                                    rotation={imageCropParameters.rotation}
                                    zoom={imageCropParameters.zoom}
                                    aspect={3 / 4} // aspect ratio
                                    onCropChange={(e) => handleWriteImageCropParameters(e, 'crop_change')} 
                                    onRotationChange={(e) => handleWriteImageCropParameters(e, 'rotation_change')}
                                    onCropComplete={(...e) => handleWriteImageCropParameters(e, 'crop_complete')}
                                    onZoomChange={(e) => handleWriteImageCropParameters(e, 'zoom_change')}
                                />
                                <button className={cn('btn-save')} type='button'
                                    onClick={() => handleCropImagePosts()}
                                >Hoàn tất</button>
                            </div>
                        )
                        ||
                        <Fragment>
                            <div className={cn('icon-add-image-frame')}>
                                <ion-icon name="image-outline"></ion-icon>
                            </div>
                            <label htmlFor="input_add_image" className={cn('btn-add-image', 'btn-base')} type='button'
                                onClick={() => inputAddImageRef.onClick}
                            >
                                <ion-icon name="add"></ion-icon>
                                <span>Thêm ảnh</span>
                            </label>
                            <input id="input_add_image" ref={inputAddImageRef} className={cn('input-add-image-controll')} name="posts" type="file" accept=".jpg, .png"
                                onChange={(e) => {handleSelectImagePosts(e.target.files[0])}}
                                value={imagePosts.file || ''}
                            ></input>
                        </Fragment>
                    }
                </div>
                <div className={cn('body_right')}>
                    <div className={cn('top')}>
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
                        <div className={cn('caption-are')}>
                            <textarea className={cn('scroll-bar')} name='caption' type='text' placeholder='Thêm mô tả cho bài viết...' resize='false'
                                value={captionInput}
                                onChange={(e) => setCaptionInput(e.target.value)}
                            ></textarea>
                        </div>
                        <div className={cn('rule-area')}>
                            <h4 className={cn('rule_title')}>Hiển thị với</h4>
                            <div className={cn('rule_list')}>
                                <div className={cn('rule_list__item')}
                                    onClick={() => setRulePost('all')}
                                >
                                    <div className={cn('item_name')}>
                                        <ion-icon name="earth-outline"></ion-icon>
                                        <span>Mọi người</span>
                                    </div>
                                    <div className={cn('item_btn')}>
                                        <div className={`my-radio-check-box ${rulePost=='all'?'on':'off'}`}>
                                            <div className='ring'>
                                                <div className='inner-ring'></div>
                                            </div>
                                            <div className='checked'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn('rule_list__item')}
                                    onClick={() => setRulePost('friends')}
                                >
                                    <div className={cn('item_name')}>
                                        <ion-icon name="people-outline"></ion-icon>
                                        <span>Bạn bè</span>
                                    </div>
                                    <div className={cn('item_btn')}>
                                        <div className={`my-radio-check-box ${rulePost=='friends'?'on':'off'}`}>
                                            <div className='ring'>
                                                <div className='inner-ring'></div>
                                            </div>
                                            <div className='checked'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn('rule_list__item')}
                                    onClick={() => setRulePost('only_me')}
                                >
                                    <div className={cn('item_name')}>
                                        <ion-icon name="lock-closed-outline"></ion-icon>
                                        <span>Chỉ mình tôi</span>
                                    </div>
                                    <div className={cn('item_btn')}>
                                        <div className={`my-radio-check-box ${rulePost=='only_me'?'on':'off'}`}>
                                            <div className='ring'>
                                                <div className='inner-ring'></div>
                                            </div>
                                            <div className='checked'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cn('bottom')}>
                        <button className={cn('btn-cancel', 'btn-base')} type='button'
                            onClick={() => props.setShowAddPostsPopup(false)}
                        >Huỷ</button>
                        <button className={cn('btn-post', 'btn-gradient')} type='button'
                            onClick={() => {
                                handleUploadPosts();
                            }}
                        >Đăng bài viết</button>
                    </div>
                </div>
            </div>
        </div>
        ||
        <div className={cn('container-add-posts', 'success')}>
            <div className={cn('content')}>
                <div className={cn('pic-frame')}>
                    <img src={successIMG} alt=''></img>
                </div>
                <h3>Đăng bài thành công</h3>
                <p>Sẽ đóng trong {countDown}s nữa</p>
            </div>
        </div>
    );
}