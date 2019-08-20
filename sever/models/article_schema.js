var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	date:{type:Date,default:Date.now},
	update:Date,
	name:{type:String,required:true},  
	class:{type:Number,required:true},  //文章类别  1--文章  2--代码
	tags: [], 
	visible:{type:Boolean,default:true}, 
	content:{type:String,required:true}
},{collection:'article'});


mongoose.model('article',articleSchema);
