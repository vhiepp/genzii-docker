
import { axiosAppJson, axiosFromData, Res } from '../../configs/index.js';

export default new class Posts {

    async createPosts(formData) { // Error
        
        try {
            let res = await axiosFromData.post(process.env.REACT_APP_API_POSTS_CREATE_POSTS, {
                data: formData 
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    boundary: formData.boundary
                }
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_CREATE_POSTS} -> failed in server!`, err);
        }
    }

    async deletePosts(id_posts) {
        try {
            let res = await axiosAppJson.delete(process.env.REACT_APP_API_POSTS_DELETE_POSTS, {
                data: {post_id: id_posts}
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_DELETE_POSTS} -> failed in server!`, err);
        }
    }

    async getPostsInTimeline(except_posts) {
        try {
            let res = await axiosAppJson.post(process.env.REACT_APP_API_POSTS_GET_POST_IN_TIMELINE, {
                except_posts: except_posts
            });

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_GET_POST_IN_TIMELINE} -> failed in server!`, err);
        }
    }

    async getPostsOfUser(uid, page = 1) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_POSTS_GET_POST_OF_USER}/${uid}/posts?page=${page}`);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_GET_POST_OF_USER} -> failed in server!`, err);
        }
    }

    async getPostsById(id_posts) {
        try {
            let res = await axiosAppJson.get(`${process.env.REACT_APP_API_POSTS_GET_POST_BY_ID}/${id_posts}`);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_GET_POST_BY_ID} -> failed in server!`, err);
        }
    }

    async heartOrUnheart(id_posts) {
        try {
            let res = await axiosAppJson.post(`${process.env.REACT_APP_API_POSTS_HEART_OR_UNHEART}/${id_posts}/hearts`);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_POSTS_HEART_OR_UNHEART} -> failed in server!`, err);
        }
    }
 
} 