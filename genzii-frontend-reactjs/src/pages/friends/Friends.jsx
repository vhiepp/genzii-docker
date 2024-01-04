
import { useEffect, useState } from 'react';
import { Invited, WasFriend, Follower, Following } from './components/index.js';


import { LoadingMini } from '../../components/components.js';

import styles from './Friends.module.scss';
import classnames from 'classnames/bind';
import { FollowAPI, FriendAPI, GeneralAPI } from '../../apis/apis.js';
const cn = classnames.bind(styles);

const init_friends_status = [
    {
        id: 'invited',
        name: 'Lời mời',
        number: 10,
        is_select: true
    },
    {
        id: 'friend',
        name: 'Bạn bè',
        number: 5,
        is_select: false
    },
    {
        id: 'follower',
        name: 'Theo dõi',
        number: 16,
        is_select: false
    },
    {
        id: 'following',
        name: 'Đang theo dõi',
        number: 29,
        is_select: false
    }
]; 

export default function Friends() {

    const [friendStatusList, setFriendsStatusList] = useState(init_friends_status);
    const [idFriendStatusSelected, setIdFriendStatusSelected] = useState('invited');

    const [dataLists, setDataLists] = useState({invited: [], friend: [], follower: [], following: []});
    const [detailsLists, setDetailsLists] = useState({invited: null, friend: null, follower: null, following: null});

    const [isLoadingMini, setIsLoadingMini] = useState(false);

    useEffect(() => {
        handleGetInitData();
    }, []);

    const handleGetInitData = async () => { 
        const [invited, friend, follower, following] = await Promise.all([
            FriendAPI.getInvited(),
            FriendAPI.getFriend(),
            FollowAPI.getFollower(),
            FollowAPI.getFollowing()
        ]);

        setDataLists({invited: invited.data.data, friend: friend.data.data, follower: follower.data.data, following: following.data.data});
        setDetailsLists({invited: invited.data, friend: friend.data, follower: follower.data, following: following.data});
    }

    useEffect(() => {
        handleSelectFriendStatus();
    }, [idFriendStatusSelected])
                                     
    const handleSelectFriendStatus = () => {
        setFriendsStatusList(prev => {
            return prev.map((item, i) => {
                return {...item, is_select: item.id == idFriendStatusSelected}
            })
        })
    } 

    const handleGetMoreDataList = async (url) => {

        setIsLoadingMini(true);

        let res = await GeneralAPI.get(url);

        if (res && !res.error) {
            setDataLists(prev => {
                prev[idFriendStatusSelected] = [...prev[idFriendStatusSelected], ...res.data.data];
                return {...prev};
            });
            setDetailsLists(prev => {
                let {data, ...other} = res.data;
                prev[idFriendStatusSelected] = {...other};
                return {...prev};
            });
        } else {
            if (res && res.err_from_server) {
                console.log('failed in server');
            } else {
                console.log(res);
            }
        }
        setIsLoadingMini(false);
    }  

    const handleMoveItemDataToOther = (id_status_prev, id_status_next, item_data) => {
        setDataLists(prev => {
            prev[id_status_prev] = prev[id_status_prev].filter(user => user.id != item_data.id);

            if (id_status_next) {
                let finded = prev[id_status_next].find(user => user.id != item_data.id);
                if (finded) {
                    let index = prev[id_status_next].indexOf(finded);
                    prev[id_status_next][index] = item_data;
                } else {
                    prev[id_status_next] = [item_data, ...prev[id_status_next]];
                }
            }

            return {...prev};
        });

        setDetailsLists(prev => {
            prev[id_status_prev].total--;
            if (id_status_next) prev[id_status_next].total++;
            return {...prev};
        });
    }

    const handleBindingData = (id_status_prev, id_status_next, item_data) => {
        setDataLists(prev => {
            if (id_status_next) {
                let finded = prev[id_status_prev].find(user => user.id != item_data.id);
                if (finded) {
                    let index = prev[id_status_next].indexOf(finded);
                    prev[id_status_next][index] = item_data;
                } else {
                    prev[id_status_next] = [item_data, ...prev[id_status_next]];
                }
            }

            if (id_status_next) {
                if (id_status_next) {
                    let finded = prev[id_status_next].find(user => user.id != item_data.id);
                    if (finded) {
                        let index = prev[id_status_next].indexOf(finded);
                        prev[id_status_next][index] = item_data;
                    } else {
                        prev[id_status_next] = [item_data, ...prev[id_status_next]];
                    }
                }
            }
            
            return {...prev};
        });

        // setDetailsLists(prev => {
        //     prev[id_status_prev].total--;
        //     if (id_status_next) prev[id_status_next].total++;
        //     return {...prev};
        // });
    }

    return (
        <div className={cn('container-friend')}>
            <div className={cn('select-bar')}>
                {
                    friendStatusList.map((item, i) => {
                        return (
                            <div key={i} className={cn('select-item', {'selected': item.is_select})}
                                onClick={() => setIdFriendStatusSelected(item.id)}
                            >
                                <span className={cn('name')}>{item.name}</span>
                                <div className={cn('number-tag')}>
                                    {   
                                        (detailsLists[item.id] && detailsLists[item.id].total >= 0)
                                        &&
                                        <span>{detailsLists[item.id].total>100?'99+':detailsLists[item.id].total}</span>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={cn('body')}>
                { 
                    dataLists[idFriendStatusSelected].map(item => {
                        switch (idFriendStatusSelected) {
                            case 'invited': return <Invited props={item} id_type_this={'invited'} id_type_next={'friend'} func={{handleMoveItemDataToOther}} key={item.id}></Invited>
                            case 'friend': return <WasFriend props={item} id_type_this={'friend'} id_type_next={null} func={{handleMoveItemDataToOther}}  key={item.id}></WasFriend>
                            case 'follower': return <Follower props={item} id_type_this={'follower'} id_type_next={'following'} func={{handleMoveItemDataToOther, handleBindingData}} key={item.id}></Follower>
                            case 'following': return <Following props={item} id_type_this={'following'} id_type_next={null} func={{handleMoveItemDataToOther, handleBindingData}} key={item.id}></Following>
                        }
                    })
                } 
            </div>
            <div className={cn('foot')}>
                {
                    isLoadingMini
                    &&
                    <LoadingMini></LoadingMini>
                    ||
                    (
                        (detailsLists[idFriendStatusSelected] && detailsLists[idFriendStatusSelected].next_page_url)
                        &&
                        <span className={cn('show-more-txt')} onClick={() => {
                            if (detailsLists[idFriendStatusSelected] && detailsLists[idFriendStatusSelected].next_page_url)
                                handleGetMoreDataList(detailsLists[idFriendStatusSelected].next_page_url)
                        }}>Hiển thị thêm</span>
                        ||
                        (
                            (detailsLists[idFriendStatusSelected] && detailsLists[idFriendStatusSelected].total)
                            &&
                            <span className={cn('the-end-txt')} >Đã hiển thị toàn bộ</span>
                            ||
                            <span className={cn('the-end-txt')} >Chưa có nội dung</span>
                        )
                    )
                }
            </div>
        </div>
    );
}