
/*
 * GET home page.
 */

exports.index = function(req, res){
	
  res.render('home', { title: 'Express' });
};

exports.live=function(req,res){
	res.render('live',{title:'live'});
};

exports.jy=function(req,res){
	res.render('jysearch',{title:'极影爱好者查询'});
};