
import { axiosAppJson, Res } from '../../configs/index.js';


export default new class Comment {

    async getComments(id_posts, url, exCommentList) {
        try {

            let res;

            if (url) {
                res = await axiosAppJson.get(url + "&exIds=" + JSON.stringify(exCommentList));
            } else {
                res = await axiosAppJson.get(`${process.env.REACT_APP_API_POSTS_GET_COMMENTS}/${id_posts}/comments`);
            }

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_GET_COMMENTS} -> failed in server!`, err);
        }
    }

    async createComment(id_posts, content) {
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_POSTS_GET_COMMENTS}/${id_posts}/comments`, {
                content: content
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_GET_COMMENTS} -> failed in server!`, err);
        }
    }
} 