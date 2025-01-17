
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs'); 


var app = express();


// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));

//识别html模版
app.engine('html', ejs.__express);
app.set('view engine', 'html');

//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//静态文件
app.use(express.static('public'));
//使用虚拟目录
app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//直播页面
app.get('/live',routes.live);
//跳转查询页面
app.get('/jy',routes.jy);
//测试页面
app.get('/users', user.list);
//查询页面的查询
app.get('/search/:id/:pagecount',routes.search);
//图片展示页面
app.get('/photo',routes.photo);
//跳转注册页面
app.get('/registerpage',routes.registerpage);
//发送注册邮件
app.get('/registermail/:id/:password',routes.registermail);
//数据库登录页面
app.get('/zhiyuandata',routes.zhiyuandata);
//post请求 数据库插入数据
app.post('/zhiyuandata',routes.zhiyuaninputdata);
//博客页面跳转
app.get('/blog',routes.blog);
//博客查询
app.get('/blog/:blogid',routes.searchblog);

http.createServer(app).listen(app.get('port'), function(){	
  console.log('Express server listening on port ' + app.get('port'));
});
