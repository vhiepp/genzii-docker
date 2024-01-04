
import { axiosAppJson, Res } from '../../configs/index.js';

export default new class Follow {

    async getFollower(paginate = 8) {
        try {
            let res = await axiosAppJson.get(process.env.REACT_APP_API_FOLLOW_GET_FOLLOWER, {
                paginate: paginate
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FOLLOW_GET_FOLLOWER} -> failed in server!`, err);
        }
    }

    async getFollowing(paginate = 8) {
        try {
            let res = await axiosAppJson.get(process.env.REACT_APP_API_FOLLOW_GET_FOLLOWING, {
                paginate: paginate
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FOLLOW_GET_FOLLOWING} -> failed in server!`, err);
        }
    }

    async follow(id_user) {
        try {
            let res = await axiosAppJson.post(process.env.REACT_APP_API_FOLLOW_FOLLOW, {
                user_id: id_user
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FOLLOW_FOLLOW} -> failed in server!`, err);
        }
    }

    async unfollow(id_user) {
        try {
            let res = await axiosAppJson.delete(process.env.REACT_APP_API_FOLLOW_UNFOLLOW, {
                data: {user_id: id_user}
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_FOLLOW_UNFOLLOW} -> failed in server!`, err);
        }
    }
} 