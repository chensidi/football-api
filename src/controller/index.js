const Router = require('koa-router');
const home = require('./home/home');
const match = require('./match/match');
const ranking = require('./ranking/ranking');
const schedule = require('./schedule/schedule');

const router = new Router();
router.use('/api/home', home.routes(), home.allowedMethods());
router.use('/api/match', match.routes(), match.allowedMethods());
router.use('/api/ranking', ranking.routes(), ranking.allowedMethods());
router.use('/api/schedule', schedule.routes(), schedule.allowedMethods());

module.exports = router;