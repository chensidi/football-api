const got = require('got');
const Router = require('koa-router');

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

module.exports = api;