
/*
 * GET home page.

 */
//引入数据库包
var db=require('../Database/pg.js');



exports.index = function(req, res){
	
  res.render('home', { title: 'Express' });
};

exports.live=function(req,res){
	res.render('live',{title:'live'});
};

exports.jy=function(req,res){
	db.query(1,1,function (err,result){
		res.render('jysearch',{title:'极影爱好者查询',datas:result.rows});
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
		res.write(JSON.stringify("details"));
		res.write("</td><td>");
		var strlink=result.rows[i].link.split('&amp;');
		res.write(JSON.stringify(strlink[0]));
		res.write("</td><td>...</td><td>...</td></tr>");	
		}
		console.log('查询结果');
		res.end();
	});

	
};