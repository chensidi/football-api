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
	let chartInfo = getChartInfo(Array.from($('.box_chart .item')));
	let desc = getDescInfo(Array.from($('.des .list')));
	basicInfo.average = $('.average b').text();
	let matchData = getMatchData(($('.total-con-wrap')));

	ctx.body = {
		code: 200,
		data: {
			basicInfo,
			chartInfo,
			desc,
			matchData
		}
	}
})

const infoAttr = [
	'club', 'country', 'height', 'position', 'age', 'weight', 'number', 'birthday', 'useFoot'
]
function getBasicInfo(lis) {
	let obj = {};
	lis.forEach((li, i) => {
		obj[infoAttr[i]] = $$(li).text().match(/：(.+)/)?.[1];
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

function getDescInfo(lists) {
	let $2 = $$(lists[0]);
	let useFootImg = 'https://www.dongqiudi.com' + $2('img').attr('src');
	$2 = $$(lists[1]);
	let countryKnown = $2('.rank_f').length;
	$2 = $$(lists[2]);
	let uselessFoot = $2('.rank_f').length;
	$2 = $$(lists[3]);
	let showSkill = $2('.rank_f').length;
	return {
		useFootImg,
		countryKnown,
		uselessFoot,
		showSkill
	}
}

function getMatchData(matchDom) {
	let arr = []
	matchDom.find('p span').each(function() {
		arr.push($$(this).text())
	})
	let arr1 = [];
	while (arr.length) {
		arr1.push(arr.splice(0, 9));
	}
	return arr1;
}

module.exports = person;