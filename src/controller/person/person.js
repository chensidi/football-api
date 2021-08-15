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
	let hornorData = getHornorData($('.hornor-list .cup'), $('.hornor-list .champion'), $('.hornor-list .during-time b'))
	let transfer = getTransfer($('.transfer'));
	let injured = getInjured($('.injured-item'));


	ctx.body = {
		code: 200,
		data: {
			basicInfo,
			chartInfo,
			desc,
			matchData,
			hornorData,
			transfer,
			injured
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

function getHornorData(imgs, names, bs) { //球员荣誉数据
	let imgArr = [];
	imgs.each(function(i) {
		imgArr.push(imgs[i].attribs.src);
	})

	let hornorNameArr = [], numArr = []
	names.each(function(i) {
		let txt = $$(names[i]).text()
		hornorNameArr.push(txt.split('X')[0].trim());
		numArr.push(txt.split('X')[1].trim())
	})


	let allYearsArr = [], yearArr = [];
	bs.each(function(i) {
		allYearsArr.push($$(this).text())
	})

	numArr.map(item => {
		yearArr.push(allYearsArr.splice(0, item));
	})

	let objArr = [];
	yearArr.map((item, i) => {
		objArr.push({
			name: hornorNameArr[i],
			img: imgArr[i],
			years: item
		})
	})

	return objArr;
}


function getTransfer(transfer) { //转会记录
	const transferArr = [];
	transfer.each(function(i) {
		const item = {};
		item.date = $$(transfer[i].children[0]).text(); //转会时间
		item.fromImg = transfer[i].children[1].children[0].children[0].attribs.src; //转出球队logo
		item.fromTeam = $$(transfer[i].children[1].children[0].children[1]).text(); //转出球队name
		item.toImg = transfer[i].children[1].children[4].children[0].attribs.src; //转入球队logo
		item.toTeam = $$(transfer[i].children[1].children[4].children[1]).text(); //转入球队name
		item.type = transfer[i].children[3].children[0].data.trim(); //转会方式
		//转会费
		if (transfer[i]?.children[3]?.children[1]?.children) {
			item.cost = transfer[i]?.children[3]?.children[1]?.children[0]?.data.replace(/（|）/g, '');
		} else {
			item.cost = false;
		}
		
		transferArr.push(item);
	})
	return transferArr;
}

function getInjured(injured) { //伤病记录
	const injuredArr = [];
	injured.each(function(i) {
		const item = {};
		item.team = injured[i].children[0].children[0].data; //球队名
		item.reason = injured[i].children[1].children[0].data; //伤病原因
		item.date = injured[i].children[2].children[0].data; //伤病时间

		injuredArr.push(item);
	})
	
	return injuredArr;
}

module.exports = person;