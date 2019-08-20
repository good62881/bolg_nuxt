var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
	date:{type:Date,default:Date.now}, 
	src:{type:String,required:true},
	name:{type:String,required:true},
	des:String,
	visible:{type:Boolean,default:true},
	listId:{type:Number,required:true},
	formId:String
},{collection:'picture'});


mongoose.model('picture',pictureSchema);
