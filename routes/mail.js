var nodemailer =require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
  //将发送服务器端口号设置为465或587
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: 'Notice@shakugannoshana.me',
        //这里密码不是qq密码，是你设置的smtp密码
        //qq邮箱需要生成验证码
        pass: 'aprhugplomtehbef'
    }
});

exports.sendMail=function(mailOptions,req,res){
	transporter.sendMail(mailOptions, function(error, info){
		
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
};