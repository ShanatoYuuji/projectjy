/**
 * New node file
 */
var nodemailer =require('nodemailer');
var smtpTransport=require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    host: "smtp.gmail.com",
    //将发送服务器端口号设置为465或587
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: 'c1273099082@gmail.com',
        //这里密码不是qq密码，是你设置的smtp密码
        //qq邮箱需要生成验证码
        pass: 'wchpwdyzcegfwohl'
    }
});


//setup e-mail data with unicode symbols
var mailOptions = {
    from: 'c1273099082@gmail.com', // 发件地址
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