const got = require('got');
const Router = require('koa-router');
const config = require('../config');

const match = new Router();
const commonQuery = `mark=${config.mark}&version=${config.version}&from=${config.from}`;
const matchObj = {
    matchUrl: `https://api.dongqiudi.com/data/tab/new`,
    situationUrl: `https://www.dongqiudi.com/mobile/match/situation`,
}

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

module.exports = match;
