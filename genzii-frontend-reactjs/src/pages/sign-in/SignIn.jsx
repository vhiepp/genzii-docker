
import { Link, useNavigate } from 'react-router-dom';
import backgroundIMG from '../../assets/images/sign-in/background.png';

import { OAuthProvider, signInWithPopup, linkWithRedirect } from 'firebase/auth';
import { auth } from '../../configs/index.js';

import GoogleIcon from '../../assets/images/sign-in/icon-provider/google.png';
import MicrosoftIcon from '../../assets/images/sign-in/icon-provider/microsoft.png';
import GithubIcon from '../../assets/images/sign-in/icon-provider/github.png';

import { AuthenAPI } from '../../apis/apis';

import styles from './SignIn.module.scss';
import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
const cn = classnames.bind(styles);

const init_data_signin = {
    email: '',
    password: ''
};


export default function SignIn() {

    const navigate = useNavigate();

    const init_check_input_signin = {email: 1, password: 1};

    const [dataInputSignIn, setDataInputSignIn] = useState(init_data_signin);
    const [checkInputSignIn, setCheckInputSignIn] = useState(init_check_input_signin);

    useEffect(() => {
        checkSignined();
    }, [])

    const checkSignined = async () => {
        let res = await AuthenAPI.getMyProfile();

        if (!res.error) {
            navigate('/');
        }
    }

    const handleSignin = async () => {

        if (handleCheckBeforeSignin()) {
            let res = await AuthenAPI.signInWithApp(dataInputSignIn.email, dataInputSignIn.password);
            
            if (!res.error) {
                window.location.href = '/';
            } else {
                if (res.err_from_server) {
                    console.log('failed in server');
                } else {
                    console.log(res);
                }
            }
        }
    }

    const handleCheckBeforeSignin = () => {
        if (dataInputSignIn.email.trim() && dataInputSignIn.password.trim()) {
            setCheckInputSignIn(init_check_input_signin)
            return true;
        } else {
            setCheckInputSignIn(prev => {
                return {...prev, email: dataInputSignIn.email.trim()?1:0, password: dataInputSignIn.password.trim()?1:0}
            });
            return false;
        }
    }

    const handleSigninWithProvider = async (provider_name = 'google.com') => {
        const provider = new OAuthProvider(provider_name);
        const firebase_token = await signInWithPopup(auth, provider);
        let res = await AuthenAPI.signInWithFirebase(firebase_token.user);
        console.log(firebase_token.user);
        if (!res.error)
            window.location.href = '/';
        else
            window.location.reload(); 
    }

    return (
        <div className={cn('container-sign-in')}>
            <div className={cn('background-frame')}>
                <img src={backgroundIMG}></img>

            </div>
            <div className={cn('sign-in-area')}>
                <div className={cn('title')}>
                    <span>Đăng nhập</span>
                </div>
                <div className={cn('local')}>
                    <div className={cn('input')}>
                        <input type='email' name='email' placeholder='Tên đăng nhập'
                            onChange={(e) => setDataInputSignIn(prev => {
                                return {...prev, email: e.target.value}
                            })}
                        ></input>
                    </div>
                    <div className={cn('input')}>
                        <input type='password' name='password' placeholder='Mật khẩu'
                            onChange={(e) => setDataInputSignIn(prev => {
                                return {...prev, password: e.target.value}
                            })}
                        ></input>
                    </div>
                    <button className={cn('btn-sign-in', 'btn-gradient')}
                        onClick={() =>  handleSignin()}
                    >Đăng nhập</button>
                    <div className={cn('sign-up-bar')}>
                        <span className={cn('desc')}>Chưa có tài khoản? </span>
                        <Link className={cn('txt-link')} to="/sign-up">Đăng ký</Link>
                    </div>
                </div>
                <div className={cn('provider')}>
                    <span className={cn('desc')}>Hoặc</span>
                    <button className={cn('btn-sign-in', 'google')}
                        onClick={() => handleSigninWithProvider('google.com')}
                    >
                        <div className={cn('icon-provider-frame')}>
                            <img src={GoogleIcon} alt=''></img>
                        </div>
                        <span>Đăng nhập với Google</span>
                    </button>
                    <button className={cn('btn-sign-in', 'microsoft')}
                        onClick={() => handleSigninWithProvider('microsoft.com')}
                    >
                        <div className={cn('icon-provider-frame')}>
                            <img src={MicrosoftIcon} alt=''></img>
                        </div>
                        <span>Đăng nhập với Microsoft</span>
                    </button>
                    {/* <button className={cn('btn-sign-in', 'github')}
                        onClick={() => handleSigninWithProvider('github.com')}
                    >
                        <div className={cn('icon-provider-frame')}>
                            <img src={GithubIcon} alt=''></img>
                        </div>
                        <span>Đăng nhập với Github</span>
                    </button> */}
                </div>
            </div>
        </div>
    );
}