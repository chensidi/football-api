const got = require('got');
const Router = require('koa-router');
const cheerio  = require('cheerio');
const axios  = require('axios')

const $$ = cheerio.load;
const api = new Router();

api.get('/getHomeData', async ctx => { //首页数据
	const { query } = ctx;
	try {
		const res = await got(query.url);
		ctx.body = {
			code: 200,
			body: JSON.parse(res.body)
		}
	} catch(err) {
		console.log(err);
		ctx.body = {
			code: -1,
			body: err
		}
	}
})

api.post('/postman', async ctx => {
	console.log(5)
	const body = ctx.request.body;
	console.log(body);
})

api.get('/getWebData', async (ctx) => {
	const res = await axios.get('https://www.dongqiudi.com/player/50146726.html');
	const $ = cheerio.load(res.data);
	let basicInfo = getBasicData($('.info-left'));
	let chartInfo = getChartInfo(Array.from($('.box_chart .item')))
	console.log(basicInfo)
	console.log(chartInfo)
	ctx.body = {
		code: 200,
		body: {
			basicInfo,
			chartInfo
		}
	}
})

const infoAttr = [
	'club', 'country', 'height', 'position', 'age', 'weight', 'number', 'birthday', 'useFoot'
]
function getBasicInfo(lis) {
	let obj = {};
	lis.forEach((li, i) => {
		obj[infoAttr[i]] = $$(li).text().match(/：(.+)/)[1];
	})
	return obj;
}

function getChartInfo(charts) {
	let map = new Map();
	charts.forEach(chart => {
		let [k, v] = [$$(chart).text().match(/(.+?)(\d+)/)[1], $$(chart).text().match(/(.+?)(\d+)/)[2]];
		map.set(k, v);
	})
	return Array.from(map);
}

function getBasicData(dom) { //基础信息
	let [
		name,
		enName,
		countryImgUrl,
		clubImgUrl,
		otherInfo,
	] = [
		dom.find('.china-name').text(),
		dom.find('.en-name').text(),
		dom.find('.nation').attr('src'),
		dom.find('.team-icon').attr('src'),
		getBasicInfo(Array.from(dom.find('ul li'))),
	]
	return {
		name,
		enName,
		countryImgUrl,
		clubImgUrl,
		otherInfo
	}
}

module.exports = api;