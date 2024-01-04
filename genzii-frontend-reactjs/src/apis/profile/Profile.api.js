
import { axiosAppJson, Res } from '../../configs/index.js';


export default new class Profile {

    async getProfileWithIDInParams(user_id) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_PROFILE_GET_INFO}/${user_id}`);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP} -> failed in server!`, err);
        }
    }

    async getProfileWithID(user_id) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_PROFILE_GET_INFO}`, {
                id: user_id
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP} -> failed in server!`, err);
        }
    }

    async getProfileWithUID(user_uid) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_PROFILE_GET_INFO}`, {
                uid: user_uid
            }); 

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP} -> failed in server!`, err);
        }
    }

    async getProfileWithEmail(user_email) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_PROFILE_GET_INFO}`, {
                email: user_email
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_AUTHEN_LOGIN_APP} -> failed in server!`, err);
        }
    }

} 