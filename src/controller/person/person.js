const Router = require('koa-router');
const cheerio  = require('cheerio');
const axios  = require('axios')

const $$ = cheerio.load;
const person = new Router();

const personUrl = `https://www.dongqiudi.com/player`;

person.get('/getPersonInfo', async (ctx) => {
	const res = await axios.get(`${personUrl}/${ctx.query.id}.html`);
	const $ = cheerio.load(res.data);
	let basicInfo = getBasicData($('.player-info'));
	let chartInfo = getChartInfo(Array.from($('.box_chart .item')))
	ctx.body = {
		code: 200,
		data: {
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
	let arr = [];
	charts.forEach(chart => {
		let [label, value] = [$$(chart).text().match(/(.+?)(\d+)/)[1], $$(chart).text().match(/(.+?)(\d+)/)[2]];
		arr.push({label, value})
	})
	return arr;
}

function getBasicData(dom) { //基础信息
	let [
		name,
		enName,
		personImgUrl,
		countryImgUrl,
		clubImgUrl,
		otherInfo,
	] = [
		dom.find('.china-name').text(),
		dom.find('.en-name').text(),
		dom.find('.player-photo').attr('src'),
		dom.find('.nation').attr('src'),
		dom.find('.team-icon').attr('src'),
		getBasicInfo(Array.from(dom.find('ul li'))),
	]
	return {
		name,
		enName,
		personImgUrl,
		countryImgUrl,
		clubImgUrl,
		otherInfo
	}
}

module.exports = person;