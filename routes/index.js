
/*
 * GET home page.

 */
//引入数据库包
var db=require('../Database/pg.js');

//发邮件用js文件
var registermail=require('../tool/mail.js');

//导入共同用的代码
var commontool=require('../tool/common.js');

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
	res.render('photo',{});
};

exports.registerpage=function(req,res){
	res.render('register',{title:'注册页面',message:'注册信息'});
};

//发送注册邮件
exports.registermail=function(req,res){
	console.log(req.params.id);
	console.log(req.params.password);
	if(!mailreg.test(req.params.id)){
		res.end("请输入正确的邮箱地址！");
	}
	//随机产生验证码
	var certificate=commontool.randomcertificate();
	//插入数据库注册信息和验证码
	db.registuser(req.params.id,req.params.password,certificate,function(err,result){
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
	//mailOptions.text='你好！测试验证码。';
	mailOptions.text=certificate;
	registermail.sendMail(mailOptions,req,res);
	res.end();
};

exports.zhiyuandata=function(req,res){
	//重定向 
	res.render('zhiyuandata');

};
//插入新的记录到数据库中
exports.zhiyuaninputdata=function(req,res){
	/*
	console.log(req.body.inputtitle);
	console.log(req.body.inputcili);
	*/
	var inputtitle=req.body.inputtitle;
	var inputcili=req.body.inputcili;
	if(inputtitle==undefined||inputtitle==null||inputtitle.Trim()==""){
		res.send('<a href="/">主页</a>&nbsp发送失败');
		return;
	}
	//TODO 磁力链接的格式验证
	if(inputcili==undefined||inputcili==null||inputcili.Trim()==""){
		res.send('<a href="/">主页</a>&nbsp发送失败');
		return;
	}
	/*
	console.log("body的内容");
	console.log(req.body);
	console.log("request的内容");
	console.log(req);
	console.log('post请求');
	*/
	db.zhiyuandata(inputtitle,inputcili,'jy');

	res.send('<a href="/">主页</a>&nbsp发送成功');
};

//博客页面跳转
exports.blog=function(req,res){
	db.searchblognew2(function(err,result){
		var blogtitle=result.rows[0].blogtitle;
		var blogintime=result.rows[0].blogintime;
		var blogIntroduction=result.rows[0].blogIntroduction;
		var blogcontent=[result.rows[0].blogcontent,'<img src="http://i1.piimg.com/593970/77dbf7a564b30a20s.jpg" alt="...">'].join('');
		console.log(result.rows[0].blogcontent);
		db.searchbloglist(function(err,result){
			console.log('输出的结果');
			//ES6内插字符串 符号用`
			var blogcc=`<div class="blog-post" name="blogcontent" id="blogcontent"><h2 class="blog-post-title">${blogtitle}</h2><p class="blog-post-meta">${blogintime} 作者<a href="#">Cbb</a></p><p>${blogIntroduction}</p><hr><p>${blogcontent}</p></div>`;
			//res.render('blog',{blogconnent:'<div class="blog-post" name="blogcontent" id="blogcontent"><h2 class="blog-post-title">博客标题</h2><p class="blog-post-meta">日期 作者<a href="#">Cbb</a></p><p>博客内容</p><hr><p>博客的内容</p></div>'});
			var sidecotentt='<ol class="list-unstyled" >';
			for(var i=0;i<result.rows.length;i++){
				var blogid=result.rows[i].blogid;
				console.log(result.rows);
				var blogtitle=result.rows[i].blogtitle;
				var sidecontenttt=`<li><a onclick="loadXMLDoc('/blog/${blogid}')">${blogtitle}</a></li>`;
				sidecotentt=[sidecotentt,sidecontenttt].join('');
			}
			sidecotentt=[sidecotentt,'</ol>'].join('');
			
			res.render('blog',{blogconnent:blogcc,sidecontent:sidecotentt});
		});
	});
};

//博客页面查询
exports.searchblog=function(req,res){
	var blogid=req.params.blogid;
	console.log('博客的ID为');
	console.log(blogid);
	db.searchblogbyblogid(blogid,function(err,result){
		console.log('博客查询的结果');
		console.log(result.rows);
		var blogtitle=result.rows[0].blogtitle;
		var blogintime=result.rows[0].blogintime;
		var blogIntroduction=result.rows[0].blogIntroduction;
		var blogcontent=[result.rows[0].blogcontent,'<img src="http://i1.piimg.com/593970/77dbf7a564b30a20s.jpg" alt="...">'].join('');
		//ES6内插字符串 符号用`
		var blogcc=`<div class="blog-post" name="blogcontent" id="blogcontent"><h2 class="blog-post-title">${blogtitle}</h2><p class="blog-post-meta">${blogintime} 作者<a href="#">Cbb</a></p><p>${blogIntroduction}</p><hr><p>${blogcontent}</p></div>`;
		res.send(blogcc);
	});
};

//正则替换去空格
String.prototype.Trim = function()  
{  
	return this.replace(/(^\s*)|(\s*$)/g, "");  
};  
String.prototype.LTrim = function()  
{  
	return this.replace(/(^\s*)/g, "");  
}; 
String.prototype.RTrim = function()  
{  
	return this.replace(/(\s*$)/g, "");  
};


