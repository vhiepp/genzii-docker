
import { Link } from 'react-router-dom';

import { FollowAPI } from '../../../../apis/apis.js';

import styles from './Followings.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Followings({props, id_type_this, id_type_next, func}) {

    const handleDelete= async (id_user) => {
        let res = await FollowAPI.unfollow(id_user);
        
        if (!res.error) {
            props.is_following = false;
            func.handleBindingData(id_type_this, id_type_next, props);
            func.handleMoveItemDataToOther(id_type_this, null, props);
        }
    }

    return (
        <div className={cn('container-followings')} key={props.id}>
            <div className={cn('left')}>
                <Link to={`/user/${props.uid}`} className={cn('user-avatar')} >
                    <div className={cn('story-ring')}>
                        <div className={cn('inner-ring')}></div>
                    </div>
                    <div className={cn('avatar-frame')}>
                        <img src={props.current_avatar.url} alt='avatar'></img>
                    </div>
                </Link>
                <Link to={`/user/${props.uid}`} className={cn('user-name')}>{props.uid}</Link>
            </div>
            <div className={cn('right')}>
                <button className={cn('btn-delete', 'btn-base')} type="button" onClick={() => handleDelete(props.id)}>Huỷ theo dõi</button>
                {/* <button className={cn('btn-following', 'btn-base')} type="button">Đang theo dõi</button> */}
            </div>
        </div>
    );
}