const got = require('got');
const Router = require('koa-router');
const config = require('./config');

const video = new Router();
const videoObj = {
    listUrl: 'https://www.dongqiudi.com/api/app/tabs/web/',
    pcTabs: 'https://www.dongqiudi.com/api/v3/archive/app/tabs/getlists',
    pcListUrl: 'https://www.dongqiudi.com/api/v3/archive/app/tabs/getlists?id=233&platform=android&version=204',
    pcTabList: 'https://www.dongqiudi.com/api/v3/archive/pc/video/getTabVideoList',
    hotVideo: 'https://www.dongqiudi.com/api/v3/archive/pc/video/gethotvideolist'
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

video.get('/getHotVideo', async ctx => { //首页推荐视频列表
    try {
        const res = await got(videoObj.pcListUrl);
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

video.get('/getTabVideoList', async ctx => { //视频页分类列表
    try {
        const res = await got(videoObj.pcTabList);
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

video.get('/getHotVideoList', async ctx => { //PC端热门视频
    try {
        const res = await got(videoObj.hotVideo);
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