const got = require('got');
const Router = require('koa-router');

const ranking = new Router();
const rankingObj = {
    commonParams: `app=dqd&platform=&version=0&lang=zh-cn`,
    seasonUrl: `https://api.dongqiudi.com/data/v1/tab/seasons`,
    rankingUrl: `https://sport-data.dongqiudi.com/soccer/biz/data/ranking`,
    rankingDataUrl: `https://sport-data.dongqiudi.com/soccer/biz/data`
}

ranking.get('/getSeasons', async ctx => { //获取赛季列表
	try {
		const res = await got(`${rankingObj.seasonUrl}/${ctx.query.competitionId}?version=0`);
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

ranking.get('/getCateByType', async ctx => { //根据类型获取具体排名类别
	try {
        const { type, seasonId } = ctx.query;
		const res = await got(`${rankingObj.rankingUrl}/${type}?season_id=${seasonId}&${rankingObj.commonParams}`);
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

ranking.get('/getRankingByType', async ctx => { //根据类型获取具体排名数据
	try {
        const { type, seasonId, ranking } = ctx.query;
		const res = await got(`${rankingObj.rankingDataUrl}/${ranking}?type=${type}&season_id=${seasonId}&${rankingObj.commonParams}`);
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

module.exports = ranking;