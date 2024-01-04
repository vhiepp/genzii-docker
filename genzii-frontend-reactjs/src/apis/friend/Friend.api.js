
import { axiosAppJson, Res } from '../../configs/index.js';


export default new class Friend {

    async sendInvitationFriend(id_user) {
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_FRIEND_SEND_INVITATION}`, {
                user_id: id_user
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_SEND_INVITATION} -> failed in server!`, err);
        }
    }

    async cancelInvitationFriend(id_user) {
        try {
            let res = await axiosAppJson.delete(`${process.env.REACT_APP_API_FRIEND_CANCEL_SEND_INVITATION}`, {
                data: {user_is_requested_id: id_user}
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_CANCEL_SEND_INVITATION} -> failed in server!`, err);
        }
    }
    
    async unfriend(id_user) {
        try {
            let res = await axiosAppJson.delete(`${process.env.REACT_APP_API_FRIEND_DELETE_FRIEND}`, {
                data: {user_id: id_user}
            });

            return res.data;
        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_DELETE_FRIEND} -> failed in server!`, err);
        }
    }

    async getInvited(paginate = 8) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_FRIEND_GET_INVITED}`, {
                paginate: paginate
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_GET_INVITED} -> failed in server!`, err);
        }
    }

    async agreeInvited(user_invited_id) { 
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_FRIEND_AGREE_INVITE}`, {
                user_request_id: user_invited_id
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_AGREE_INVITE} -> failed in server!`, err);
        }
    }

    async disagreeInvited(user_invited_id) {
        try {
            let res = await axiosAppJson.delete(`${process.env.REACT_APP_API_FRIEND_DISAGREE_INVITE}`, {
                data: {user_request_id: user_invited_id}
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_DISAGREE_INVITE} -> failed in server!`, err);
        }
    } 

    async getFriend(paginate = 8) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_FRIEND_GET_FRIEND}`, {
                paginate: paginate
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FRIEND_GET_FRIEND} -> failed in server!`, err);
        }
    }

} 