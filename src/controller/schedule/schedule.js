const got = require('got');
const Router = require('koa-router');

const schedule = new Router();
const scheduleObj = {
    commonParams: `app=dqd&version=714&platform=ios&from=msite_com`,
    scheduleUrl: `https://sport-data.dongqiudi.com/soccer/biz/data/schedule`,
    rankingUrl: `https://sport-data.dongqiudi.com/soccer/biz/data/ranking`,
    rankingDataUrl: `https://sport-data.dongqiudi.com/soccer/biz/data`
}

schedule.post('/getSchedule', async ctx => { //获取赛季赛程
	try {
        const { seasonId, roundId, gameWeek } = ctx.request.body;
        let realUrl = `${scheduleObj.scheduleUrl}?season_id=${seasonId}&${scheduleObj.commonParams}`;
        if (roundId && gameWeek) {
            realUrl = `${scheduleObj.scheduleUrl}?season_id=${seasonId}&round_id=${roundId}&gameweek=${gameWeek}&${scheduleObj.commonParams}`
        }
		const res = await got(realUrl);
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

module.exports = schedule;