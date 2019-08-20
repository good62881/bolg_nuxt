var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	account:{type:String,required:true,unique:true}, //管理员帐号
	pass:{type:String,required:true}, //密码
	name:{type:String,required:true}, //名字
	age:Number, //年龄
	job:String, //职业
	email:{type:String,required:true},  //email
	avatar:String,  //头像
},{collection:'user'});


mongoose.model('user',userSchema);
