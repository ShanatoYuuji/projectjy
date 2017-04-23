
/*
 * GET home page.

 */
//引入数据库包
var db=require('../Database/pg.js');

var registermail=require('./mail.js');

//判断邮箱用正则表达式
var mailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;


exports.index = function(req, res){
	
  res.render('home', { title: 'Express' });
};

exports.live=function(req,res){
	res.render('live',{title:'live'});
};

exports.jy=function(req,res){
	db.query(1,1,function (err,result){
		res.render('jysearch',{title:'极影爱好者查询',datas:result.rows});
		//res.render('jysearch',{title:'极影爱好者查询'});
		
	});
	
};

exports.search=function(req,res){
	console.log(req.params.id);
	console.log(req.params.pagecount);
	var id=req.params.id;
	var pagecount=req.params.pagecount;
	console.log(id);
	console.log(pagecount);
	db.query(id,pagecount,function (err,result){
		if(result==null||result==undefined||result.rowCount==null||result.rowCount==undefined||result.rowCount<1){
			res.end();
			return ;
		}
		for(var i = 0; i < result.rowCount; i++) {
		res.write("<tr><td class=\"info\">");
		res.write(JSON.stringify(result.rows[i].title));
		res.write("</td><td>");
		//res.write(JSON.stringify(result.rows[i].details));
		res.write(result.rows[i].details);
		//res.write(JSON.stringify("details"));
		res.write("</td><td>");
		var strlink=result.rows[i].link.split('&amp;');
		res.write(JSON.stringify(strlink[0]));
		res.write("</td><td>...</td><td>...</td></tr>");	
		}
		console.log('查询结果');
		res.end();
	});

	
};

exports.photo=function(req,res){
	res.render('photo');
};

exports.registerpage=function(req,res){
	res.render('register',{title:'注册页面',message:'注册信息'});
};

exports.registermail=function(req,res){
	console.log(req.params.id);
	console.log(req.params.password);
	if(!mailreg.test(req.params.id)){
		res.end("请输入正确的邮箱地址！");
	}
	//插入数据库注册信息和验证码
	db.registuser(req.params.id,req.params.password,"测试验证码",function(err,result){
		console.log(result);
	});
	var mailOptions = {
		    from: 'Notice@shakugannoshana.me', // 发件地址
		    to:'railgun@shakugannoshana.me', // 收件列表
		    subject: '来自shiori的注册邮件', // 标题
		    //text和html两者只支持一种
		    text: '你好！测试验证码。', 
		    //html: '<b>Hello world ?</b>' // html 内容
		};
	mailOptions.to=req.params.id;
	mailOptions.text='你好！测试验证码。';
	registermail.sendMail(mailOptions,req,res);
	res.end();
};



