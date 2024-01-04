
import { Link } from 'react-router-dom';

import { FriendAPI } from '../../../../apis/apis';

import styles from './Invations.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function Invations({props, id_type_this, id_type_next, func}) {

    const handleAgree = async (id_user) => {
        let res = await FriendAPI.agreeInvited(id_user);

        if (!res.error)
            func.handleMoveItemDataToOther(id_type_this, id_type_next, props);
    }

    const handleDisagree= async (id_user) => {
        let res = await FriendAPI.disagreeInvited(id_user);

        if (!res.error) {
            func.handleMoveItemDataToOther(id_type_this, null, props);
        }
    }

    return (
        <div className={cn('container-invations')} key={props.id}>
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
                <button className={cn('btn-delete', 'btn-base')} type="button" onClick={() => handleDisagree(props.id)}>Xoá</button>
                <button className={cn('btn-accept', 'btn-gradient')} type="button" onClick={() => handleAgree(props.id)}>Chấp nhận</button>
            </div>
        </div>
    );
}