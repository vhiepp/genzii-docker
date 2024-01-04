
import { Link } from 'react-router-dom';

import { FollowAPI } from '../../../../apis/apis.js';

import styles from './Followers.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Followers({props, id_type_this, id_type_next, func}) {

    const handleFollow = async (id_user) => {
        let res = await FollowAPI.follow(id_user);

        if (!res.error) {
            props.is_following = true;
            func.handleBindingData(id_type_this, id_type_next, props);
        }
    }

    return (
        <div className={cn('container-followers')} key={props.id}>
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
                {
                    props.is_following
                    &&
                    <button className={cn('btn-not-action', 'btn-base')} type="button">Đã theo dõi</button>
                    ||
                    <button className={cn('btn-gradient')} type="button" onClick={() => handleFollow(props.id)}>Theo dõi</button>
                }
            </div>
        </div>
    );
}