
import { Link } from 'react-router-dom';

import { FriendAPI } from '../../../../apis/apis.js';

import styles from './WasFriends.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function WasFriends({props, id_type_this, id_type_next, func}) { 

    const handleDelete= async (id_user) => {
        let res = await FriendAPI.unfriend(id_user);
        
        if (!res.error)
            func.handleMoveItemDataToOther(id_type_this, id_type_next, props);
    }

    return (
        <div className={cn('container-was-friends')} key={props.id}>
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
                <button className={cn('btn-delete', 'btn-base')} type="button" onClick={() => handleDelete(props.id)}>Huỷ kết bạn</button>
                {/* <button className={cn('btn-was-friends', 'btn-base')} type="button">Bạn bè</button> */}
            </div>
        </div>
    );
}