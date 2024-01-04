

import { axiosAppJson, Res } from '../../configs/index.js';


export default new class General {

    async get(url) {
        try {
            let res = await axiosAppJson.get(url);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${url} -> failed in server!`, err);
        }
    }

    async post(url) {
        try {
            let res = await axiosAppJson.post(url);

            return res.data;

        } catch (err) {
            return Res.errFromServer(`${url} -> failed in server!`, err);
        }
    } 

} 