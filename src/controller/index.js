const Router = require('koa-router');
const home = require('./home/home');
const match = require('./match/match');
const ranking = require('./ranking/ranking');
const schedule = require('./schedule/schedule');
const video = require('./video/video');
const person = require('./person/person');
const test = require('./api');
const article = require('./article/article')

const router = new Router();
router.use('/api/home', home.routes(), home.allowedMethods());
router.use('/api/match', match.routes(), match.allowedMethods());
router.use('/api/ranking', ranking.routes(), ranking.allowedMethods());
router.use('/api/schedule', schedule.routes(), schedule.allowedMethods());
router.use('/api/video', video.routes(), video.allowedMethods());
router.use('/api/person', person.routes(), person.allowedMethods());
router.use('/api/test', test.routes(), test.allowedMethods());
router.use('/api/article', article.routes(), article.allowedMethods());

module.exports = router;