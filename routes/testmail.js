/**
 * New node file
 */
var nodemailer =require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: 'Notice@shakugannoshana.me',
        //这里密码不是qq密码，是你设置的smtp密码
        //qq邮箱需要生成验证码
        pass: 'aprhugplomtehbef'
    }
});

//setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Notice@shakugannoshana.me', // 发件地址
    to: '491128833@qq.com', // 收件列表
    subject: 'Hello sir', // 标题
    //text和html两者只支持一种
    text: 'Hello world ?', // 标题
   // html: '<b>Hello world ?</b>' // html 内容
};

//send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});