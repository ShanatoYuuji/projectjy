/**
 * New node file
 */
//连接postgresql
var pg=require('pg');

//create a config to configure both pooling behavior
//and client options
//note: all config is optional and the environment variables
//will be read if the config is not present
var config = {
user: 'postgres', //env var: PGUSER
database: 'postgres', //env var: PGDATABASE
password: '123zzz', //env var: PGPASSWORD
host: 'localhost', // Server hosting the postgres database
port: 5432, //env var: PGPORT
max: 100, // max number of clients in the pool
idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

exports.query = querypagecount;
exports.registuser=registuser;
exports.zhiyuandata=zhiyuandata;
exports.searchblognew2=searchblognew2;
exports.searchbloglist=searchbloglist;
exports.searchblogbyblogid=searchblogbyblogid;

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

//分页查询jy数据库
function querypagecount(keyword,pagecount,callback){
	//判断查询内容
	if(keyword==null){
		return;
	}
	//判断pagecount是否为数字
	if(pagecount==null||!isNumber(pagecount)){
		return ;
	}
	var keywordsql='%'+keyword+'%';
	var pagecountsql=50*pagecount;
		pool.connect(function(err, client, done) {
			if(err) {
			 return console.error('error fetching client from pool', err);
			}
			if(pagecount<=1){
				client.query("select title,details,link from jiying where title LIKE $1::text order by id limit 50", [keywordsql], function(err, result) {
					 //call `done()` to release the client back to the pool
					 done();
					 callback(err,result);
					 if(err) {
					   return console.error('error running query', err);
					 }
					 return result;
					 //output: 1
					});
				
			}else{
				client.query("select title,link from jiying where title LIKE $1::text AND id>(select MAX(id) from (select id from jiying where title LIKE $1::text order by id limit $2::int)b ) order by id limit 50", [keywordsql,pagecountsql], function(err, result) {
					 //call `done()` to release the client back to the pool
					  done();
					  callback(err,result);
					 if(err) {
					   return console.error('error running query', err);
					 }
					 return result;
					 //output: 1
					});
			}
			});
	
	
	pool.on('error', function (err, client) {
		// if an error is encountered by a client while it sits idle in the pool
		// the pool itself will emit an error event with both the error and
		// the client which emitted the original error
		// this is a rare occurrence but can happen if there is a network partition
		// between your application and the database, the database restarts, etc.
		// and so you might want to handle it and at least log it out
		console.error('idle client error', err.message, err.stack);
		});
}

//用户名注册插入
function registuser(userid,password,certificatecode,callback){
	pool.connect(function(err, client, done) {
		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }
		  client.query('insert into useronshiori(usermail,userpassword,usercreatetime,usercertificate) values($1::text,$2::text,now(),$3::text)', [userid,password,certificatecode], function(err, result) {
		    //call `done()` to release the client back to the pool
		    done();
		    if(err) {
		      return console.error('error running query', err);
		    }
		    console.log(result);
		    //output: 1
		    return result;
		  });
		});

		pool.on('error', function (err, client) {
		  // if an error is encountered by a client while it sits idle in the pool
		  // the pool itself will emit an error event with both the error and
		  // the client which emitted the original error
		  // this is a rare occurrence but can happen if there is a network partition
		  // between your application and the database, the database restarts, etc.
		  // and so you might want to handle it and at least log it out
		  console.error('idle client error', err.message, err.stack);
		});
}

var maxid;
//插入新记录到数据库
function zhiyuandata(titile,link,author){
	
		//var maxid=searchmaxid();
		//consolemaxid(searchemaxidd());
		searchmaxid(function(){
			//将查询出来的id回调插入
			maxid=maxid+1;
			pool.query('insert into jiying(id,title,date,link,author) values($1::int,$2::text,now(),$3::text,$4::text)',[maxid,titile,link,author]);
		});
}

//查询记录中最大的id
//最好不要显示调用
function searchmaxid(callback){
	 pool.query('SELECT max(id) from jiying;',function(err,result){
		 if(err) {
		      return console.error('error running query', err);
		    }
		 maxid=result.rows[0].max;
		 callback();
	 });
	
	   /*
	pool.connect(function(err, client, done) {
		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }
		  client.query('SELECT max(id) from jiying;',  function(err, result) {
		    //call `done()` to release the client back to the pool
		    done();

		    if(err) {
		      return console.error('error running query', err);
		    }
		    //console.log(result.rows[0].max);
		    //最大的id
		    maxid=result.rows[0].max;
		    callback();
		    return result.rows[0].max;
		  });
		});
		*/

		pool.on('error', function (err, client) {
		  // if an error is encountered by a client while it sits idle in the pool
		  // the pool itself will emit an error event with both the error and
		  // the client which emitted the original error
		  // this is a rare occurrence but can happen if there is a network partition
		  // between your application and the database, the database restarts, etc.
		  // and so you might want to handle it and at least log it out
		  console.error('idle client error', err.message, err.stack);
		});
}
 
 //查询博客表返回最新的2条
 function searchblognew2(callback){
	 pool.query('select blogauthor,blogauthroid,blogtitle,"blogIntroduction",blogcontent,blogintime,blogedittime from blog order by blogid DESC limit 2;',function(err,result){
		 if(err) {
		      return console.error('error running query', err);
		    }
		 callback(err,result);
		 return result;
	 });
 }

 //查询博客列表
 function searchbloglist(callback){
	 pool.query('select blogid,blogtitle,blogintime from blog order by blogid desc;',function(err,result){
		if(err){
			return console.err('error running qurey',err);
		}
		callback(err,result);
		return result;
	 });
 }
 
 //查询指定ID的博客
 function searchblogbyblogid(blogid,callback){
	 pool.query('select  blogauthor,blogauthroid,blogtitle,"blogIntroduction",blogcontent,blogintime,blogedittime from blog where blogid =$1::int',[blogid],function(err,result){
		 if(err){
				return console.log('error running qurey',err);
			}
			callback(err,result);
			return result;
	 });
 }
 
//正则表达式来判断是否为正整数
function isNumber(value){
	var patrn=/^[0-9]*[1-9][0-9]*$/;
	if(patrn.exec(value)==null||value==""){
		return false;
	}else{
		return true;
	}
}




