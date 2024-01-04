
import { axiosAppJson, Res } from '../../configs/index.js';

class Authen { 
    async signInWithApp(email, password) {

        console.log(email);
        console.log(password);
        
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP}`, {
                email: email,
                password: password
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP} -> failed in server!`, err);
        }
    }

    async signInWithFirebase(firebase_access_token) {
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_AUTHEN_LOGIN_FIREBASE}`, {
                firebase_access_token: firebase_access_token
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_FIREBASE} -> failed in server!`, err);
        }
    }

    async getMyProfile() {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_AUTHEN_GET_PROFILE}`);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_GET_PROFILE} -> failed in server!`, err);
        }
    }

    async signOut() {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_AUTHEN_SIGN_OUT}`);

            return res.data;

        } catch (err) {
            return {
                err: true,
                err_from_server: true,
                status: `${process.env.REACT_APP_API_AUTHEN_SIGN_OUT} -> failed in server!`,
                message: err
            }
        }
    }
}

export default new Authen;