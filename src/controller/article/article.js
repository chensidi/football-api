const got = require('got');
const Router = require('koa-router');

const article = new Router();
const articleObj = {
    url: 'https://www.dongqiudi.com/api/v2/article/detail/',
	relatedUrl: 'https://www.dongqiudi.com/api/v2/article/relative/'
}

article.get('/getArticlePc', async ctx => { //PC文章详情
	try {
		const res = await got(articleObj.url + ctx.query.id);
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

article.get('/getRelatedArticle', async ctx => { //PC相关文章
	try {
		const {id, size = 10} = ctx.query;
		const res = await got(articleObj.relatedUrl + ctx.query.id + '?size=' + size);
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

module.exports = article;