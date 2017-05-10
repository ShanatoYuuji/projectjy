/**
 * New node file
 */


exports.randomcertificate=randomcertificate;

//输出随机的4位验证码
function randomcertificate(){
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var certification="测试验证码为：";
	for(var i=0;i<4;i++){
		var id=Math.ceil(Math.random()*35);
		certification+=chars[id];
	}
	return certification;
}