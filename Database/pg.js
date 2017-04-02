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
max: 10, // max number of clients in the pool
idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

exports.query = querypagecount;

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

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
					console.log("查询");
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
					console.log("查询");
					 //call `done()` to release the client back to the pool
					  done();
					  callback(err,result);
					  console.log('pagecount');
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

//正则表达式来判断是否为正整数
function isNumber(value){
	var patrn=/^[0-9]*[1-9][0-9]*$/;
	if(patrn.exec(value)==null||value==""){
		return false;
	}else{
		return true;
	}
}




