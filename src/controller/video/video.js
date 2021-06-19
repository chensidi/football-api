const got = require('got');
const Router = require('koa-router');
const config = require('./config');

const video = new Router();
const videoObj = {
    listUrl: 'https://www.dongqiudi.com/api/app/tabs/web/'
}

video.post('/getVideoList', async ctx => { //联赛视频列表
    try {
        const { league, before, after } = ctx.request.body;
        let url = `${videoObj.listUrl}${config[league]}`;
        if (before && !after) {
            url = `${url}?before=${before}`;
        } else if (!before && after) {
            url = `${url}?after=${after}`;
        }
        const res = await got(url);
        ctx.body = {
            code: 200,
            data: JSON.parse(res.body)
        }
    } catch(err) {
		console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
	}
})

module.exports = video;