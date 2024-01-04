
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './Messages.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

const init_inbox_list = [
    {
        username: '_anhdun',
        avatar_url: 'https://picsum.photos/200',
        last_message: {
            user_id: 67182736,
            content: 'Bạn ăn cơm chưa'
        }
    },
    {
        username: 'linhcute.',
        avatar_url: 'https://picsum.photos/201',
        last_message: {
            user_id: 897623846,
            content: 'Ngày hôm qua đi qua gần bên kia trời mưa có gió ăn cơm ngon ngủ khoẻ :v'
        }
    },
    {
        username: 'tientien_tran',
        avatar_url: 'https://picsum.photos/202',
        last_message: {
            user_id: 218376487,
            content: 'Anh đẹp troai khoẻ hôn :>>'
        }
    },
];

const chat_content_init = {
    user: {
        username: 'li_dinnhcute.',
        avatar_url: 'https://picsum.photos/217',
        status_access: 'online'
    },
    messages: [
        {
            user_id: 176937,
            time: 1701190901651,
            content: 'Hi anh'
        },
        {
            user_id: 176937,
            time: 1701190986028,
            content: 'Anh ăn cơm chưa'
        },
        {
            user_id: 897623846,
            time: 1701190989999,
            content: 'hi em, a ăn cơm rồi á'
        },
        {
            user_id: 176937,
            time: 1701190999999,
            content: 'Anh tắm chưa á :>>'
        },
        {
            user_id: 897623846,
            time: 1701191000000,
            content: 'Anh mới tắm nãy ròi nè -.-'
        },
        {
            user_id: 176937,
            time: 1701191005555,
            content: 'Anh đẹp troai quá hà :>'
        },
        {
            user_id: 176937,
            time: 1701191021111,
            content: 'Yêu anh nhất trên đời :33'
        }
    ]
}

export default function Messages() {

    const [userInfo, setUserInfo] = useState({id: 897623846, username: 'nguyenducjr', avatar_url: 'https://picsum.photos/219'})

    const [inboxList, setInboxList] = useState(init_inbox_list);

    const [chatContent, setChatContent] = useState(chat_content_init);

    return (
        <div className={cn('container-message')}>
            <div className={cn('inbox')}>
                <div className={cn('header')}>
                    <div className={cn('head')}>
                        <span className={cn('head_left')}>Tìm kiếm</span> 
                    </div>
                    <div className={cn('search')}>
                        <div className={cn('input-cluster')}>
                            <ion-icon name="search"></ion-icon>
                            <input type='text' name='search' placeholder='Tìm kiếm'></input>
                        </div>
                    </div>
                </div>
                <div className={cn('box')}>
                    {
                        inboxList.map(inbox => {
                            return (
                                <div className={cn('box-item')}>
                                    <div className={cn('box-left')}>
                                        <Link to='/profile' className={cn('user-avatar')} >
                                            <div className={cn('story-ring')}>
                                                <div className={cn('inner-ring')}></div>
                                            </div>
                                            <div className={cn('user_frame')}>
                                                <img src={inbox.avatar_url} alt='avatar'></img>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className={cn('box-right')}>
                                        <Link to='/profile' className={cn('user-name')}>{inbox.username}</Link>
                                        <div className={cn('lastest-message-content')}>
                                            <span className={cn('subjects')}>{inbox.last_message.user_id==userInfo.id?'Bạn: ':''}</span>
                                            <span className={cn('message-content')}>{inbox.last_message.content}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={cn('chat')}>
                <div className={cn('chat_header')}>
                    <div className={cn('header-left')}>
                        <Link to='/profile' className={cn('user-avatar')} >
                            <div className={cn('story-ring')}>
                                <div className={cn('inner-ring')}></div>
                            </div>
                            <div className={cn('user-avatar_frame')}>
                                <img src={inboxList[0].avatar_url} alt='avatar'></img>
                            </div>
                        </Link>
                        <Link to='/profile' className={cn('user-name')}>{inboxList[0].username}</Link>
                        <div className={cn('dot-status-access', 'online')}>
                            <ion-icon name="ellipse"></ion-icon>
                        </div>
                    </div>

                    <div className={cn('header-right')}>
                        <ion-icon name="ellipsis-horizontal"></ion-icon>
                    </div>
                </div>
                <div className={cn('chat_view')}>
                    {
                        chatContent.messages.map(message => {
                            return (
                                <div className={cn('message')}>
                                    
                                </div>
                            )
                        })
                    }
                </div>
                <div className={cn('chat_bar')}>
                    <input className={cn('input-message')} type='text' placeholder='Nhập tin nhắn'></input>
                    <button  className={cn('btn-send')} type='button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 20 21" fill="none">
                            <path d="M18.6168 9.36915L18.6105 9.36641L1.92773 2.44688C1.78741 2.38815 1.63472 2.36512 1.48332 2.37984C1.33192 2.39456 1.18653 2.44659 1.06016 2.53126C0.926639 2.61874 0.816966 2.73805 0.741006 2.87845C0.665046 3.01885 0.625182 3.17592 0.625 3.33555V7.76094C0.625074 7.97917 0.701273 8.19053 0.840463 8.3586C0.979653 8.52666 1.17311 8.64091 1.3875 8.68165L10.4863 10.3641C10.5221 10.3708 10.5543 10.3899 10.5776 10.4179C10.6008 10.4459 10.6135 10.4812 10.6135 10.5176C10.6135 10.554 10.6008 10.5892 10.5776 10.6173C10.5543 10.6453 10.5221 10.6643 10.4863 10.6711L1.38789 12.3535C1.17356 12.3942 0.980114 12.5082 0.840862 12.6762C0.70161 12.8441 0.625273 13.0553 0.625 13.2734V17.6996C0.624896 17.852 0.662638 18.0021 0.734839 18.1364C0.80704 18.2706 0.91144 18.3848 1.03867 18.4688C1.19172 18.5704 1.37133 18.6248 1.55508 18.625C1.68282 18.6249 1.80925 18.5993 1.92695 18.5496L18.6094 11.6695L18.6168 11.666C18.8414 11.5695 19.0327 11.4093 19.1671 11.2052C19.3016 11.0011 19.3732 10.762 19.3732 10.5176C19.3732 10.2732 19.3016 10.0341 19.1671 9.82999C19.0327 9.62588 18.8414 9.46565 18.6168 9.36915Z" fill="url(#paint0_linear_27_63)"/>
                            <defs>
                            <linearGradient id="paint0_linear_27_63" x1="0.625" y1="20.9947" x2="22.5241" y2="17.8421" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#0072FF"/>
                            <stop offset="1" stop-color="#00C6FF"/>
                            </linearGradient>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}