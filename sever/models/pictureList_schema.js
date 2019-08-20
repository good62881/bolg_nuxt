var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var pictureListSchema = new Schema({
	listId:{type:Number,required:true},
	date:{type:Date,default:Date.now}, 
	name:{type:String,required:true},
	cover:String,
	visible:{type:Boolean,default:true}
},{collection:'pictureList'});


mongoose.model('pictureList',pictureListSchema);
