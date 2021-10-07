const got = require('got');
const Router = require('koa-router');
const config = require('../config')['matchMenuConfig'];

const match = new Router();
const commonQuery = `init=${config.init}&version=${config.version}&from=${config.from}`;
const matchObj = {
    matchUrl: `https://api.dongqiudi.com/data/tab/new`,
    situationUrl: `https://www.dongqiudi.com/mobile/match/situation`,
	lineupUrl: `https://www.dongqiudi.com/mobile/match/lineup`,
	analysisUrl: `https://www.dongqiudi.com/mobile/match/analysis`,
	highlightsUrl: `https://www.dongqiudi.com/mobile/match/highlights`,
	matchMenuPc: `https://www.dongqiudi.com/api/v2/config/match_menu?mark=gif&platform=www&version=713`,
	matchUrlPc: 'https://www.dongqiudi.com/api/data/tab/league/new/'
}

match.post('/getMatchMenu', async ctx => { //获取比赛菜单
    try {
        const { start, api } = ctx.request.body;
        const res = await got(`${api}?${commonQuery}&start=${start}`);
		ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.post('/getMatchList', async ctx => { //获取比赛列表
    try {
        const { type, time } = ctx.request.body;
        const res = await got(`${matchObj.matchUrl}/${type}?start=${time}&${commonQuery}`);
		ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.get('/getSituation', async ctx => { //获取赛况
    const { matchId } = ctx.query;
    try {
        const res = await got(`${matchObj.situationUrl}/${matchId}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.get('/getLineup', async ctx => { //获取阵容
    const { matchId } = ctx.query;
    try {
        const res = await got(`${matchObj.lineupUrl}/${matchId}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.get('/getAnalysis', async ctx => { //获取分析信息
    const { matchId } = ctx.query;
    try {
        const res = await got(`${matchObj.analysisUrl}/${matchId}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.get('/getHighlights', async ctx => { //获取集锦
    const { matchId } = ctx.query;
    try {
        const res = await got(`${matchObj.highlightsUrl}/${matchId}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.get('/getMatchMenuPc', async ctx => { //获取PC端比赛菜单
    try {
        const res = await got(`${matchObj.matchMenuPc}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

match.post('/getMatchListPc', async ctx => { //获取PC端比赛列表
    try {
		const { startTime, type } = ctx.request.body;
        const res = await got(`${matchObj.matchUrlPc}/${type}?start=${startTime}`);
        ctx.body = {
			code: 200,
			data: JSON.parse(res.body)
		}
    } catch (err) {
        console.log(err);
		ctx.body = {
			code: -1,
			data: err
		}
    }
})

module.exports = match;
