const got = require('got');
const Router = require('koa-router');
const config = require('../config')['homeMenuConfig'];

const home = new Router();
const commonQuery = `mark=${config.mark}&version=${config.version}&from=${config.from}`
const homeObj = {
	menuUrl: `https://api.dongqiudi.com/app/global/2/iphone.json?${commonQuery}`, //首页菜单配置
	tabsUrl: `https://api.dongqiudi.com/app/tabs/iphone`, //tabs详情list
	pageUrl: `https://api.dongqiudi.com/app/tabs/iphone`
}

home.get('/getHomeMenu', async ctx => { //首页菜单数据
	try {
		const res = await got(homeObj.menuUrl);
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

home.post('/getContentListByTab', async ctx => { //根据getHomeMenu接口得到的tabid，获取列表数据
	try {
		const { tabId } = ctx.request.body;
		const res = await got(`${homeObj.tabsUrl}/${tabId}.json?${commonQuery}`);
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

home.post('/getPageData', async ctx => { //分页
	try {
		const { tabId, after, page } = ctx.request.body;
		const res = await got(`${homeObj.pageUrl}/${tabId}.json?${commonQuery}&after=${after}&page=${page}&from=tab_${tabId}`);
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

home.get('/refresh', async ctx => { //刷新
	const tabId = ctx.query.tabId;
	const res = await got(`${homeObj.tabsUrl}/${tabId}.json?${commonQuery}&action=fresh&from=tab_${tabId}`)
	ctx.body = {
		code: 200,
		data: JSON.parse(res.body)
	}
})


module.exports = home;