
import { axiosAppJson, Res } from '../../configs/index.js';


export default new class Story {

    async getUserHaveStory() {
        try {
            let res = await axiosAppJson.get(process.env.REACT_APP_API_STORY_GET_USER_HAVE_STORY);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_STORY_GET_USER_HAVE_STORY} -> failed in server!`, err);
        }
    }

    async getStoryByIdUser(id_user) {
        try {
            let res = await axiosAppJson.get(process.env.REACT_APP_API_STORY_GET_STORYS_BY_USER + '/' + id_user + '/stories');

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${process.env.REACT_APP_API_STORY_GET_STORYS_BY_USER} -> failed in server!`, err);
        }
    }

    
} 