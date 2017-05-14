/**
 * New node file
 */
var name = 'Schroedinger';
//var message = 'Hello ${name} how is your cat?'; //内插字符串不知道为啥没用
var message = ['Hello ', name, ', how is your cat?'].join('');
console.log(message);

var str1 = 'a',
str2 = 'b';

var str3 = `${str1}${str2}c`;

console.log( str3 );