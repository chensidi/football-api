const Router = require('koa-router');
const home = require('./home/home');
const match = require('./match/match');

const router = new Router();
router.use('/api/home', home.routes(), home.allowedMethods());
router.use('/api/match', match.routes(), match.allowedMethods());

module.exports = router;