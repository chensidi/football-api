const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');

function importPath(pathName) {
	return path.join(__dirname, 'src', pathName);
}

const routers = require(importPath('controller/index'));

const app = new Koa();

app.use(bodyParser())
app.use(routers.routes())
	.use(routers.allowedMethods())

app.listen(8089, () => {
	console.log('server start')
});
console.log('app start');