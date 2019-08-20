var mongoose = require('mongoose');
require('../models/user_schema.js');
var User = mongoose.model('user');

var crypto = require('crypto');

function hashPW(pwd) { //单向加密
	return crypto.createHash('sha256').update(pwd).digest('base64');
};


//登录逻辑
exports.login = function(req, res) {
	User.findOne({
		account: req.body.account
	}, function(err, user) {
		var cb = {
			code: 1,
			msg: ""
		};
		if (user && user.pass === hashPW(req.body.pass)) {
			req.session.user = {
				account: user.account,
				name: user.name,
				age: user.age,
				job: user.job,
				email: user.email,
				avatar: user.avatar,
			};
			cb.code = 0;
		} else {
			cb.msg = '账号或密码错误！';
		};
		res.send(cb);
	})
};


//注册逻辑
// exports.reg=function(req,res){
// 	var newUser= new User({
// 		account:req.body.account,
// 		pass:hashPW(req.body.pass),
// 		name:'豆芽',
// 		email:'good62881@163.com',
// 		avatar:'/upload/avatar/avatar.jpg'
// 	});
// 	newUser.save((err,user)=>{
// 		var cb={code:1,msg:""};
// 		if (err) {
// 			cb.msg='错误！'
// 		}else{
// 			cb.code=0;
// 		}
// 		res.send(cb);
// 	});
// };


//更新用户信息
exports.editInfo = function(req, res) {
	var _info = {
		account: req.session.user.account,
		avatar: req.session.user.avatar,
		name: req.body.name,
		age: Number(req.body.age),
		job: req.body.job,
		email: req.body.email,
	};
	User.update({
		account: _info.account
	}, {
		$set: {
			name: _info.name,
			age: _info.age,
			job: _info.job,
			email: _info.email,
		}
	}, function(err) {
		var cb = {
			code: 1,
			msg: ""
		};
		if (err) {
			cb.msg = "修改失败！";
			res.send(cb);
			return
		};
		req.session.user = _info;
		cb.code = 0;
		res.send(cb);
	});
};



//修改密码
exports.editPass = function(req, res) {
	User.findOne({
		$and: [{
			account: req.session.user.account
		}, {
			pass: hashPW(req.body.pass)
		}]
	}, function(err, data) {
		var cb = {
			code: 1,
			msg: ""
		};
		if (err) {
			cb.msg = "修改失败！";
			res.send(cb);
		} else if (data) {
			if (hashPW(req.body.newPass) == data.pass) {
				cb.msg = "新密码不能与原密码相同！";
				res.send(cb);
				return
			};
			data.update({
				$set: {
					pass: hashPW(req.body.newPass)
				}
			}, function(err, data) {
				if (err) {
					cb.msg = "修改失败！";
					res.send(cb);
					return
				};
				req.session.destroy(function(){
					cb.code = 0;
					res.send(cb);
				});
			})
		} else {
			cb.msg = "原密码错误！";
			res.send(cb);
		}
	});
};



//头像文件处理
var fs = require('fs');
var multer = require('multer');
var multerConfig = {
	storage: multer.diskStorage({
		destination: '../nuxt/static/upload/avatar', //可以直接配置地址，如果地址不存在，会自动创建
		filename: function(req, file, cb) {
			var fileFormat = (file.originalname).split(".");
			cb(null, 'avatar_' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
		}
	}),
	limits: {
		fileSize: 100 * 1024,  //单位是字节，这里限制了100kb
		files: 1
	},
	fileFilter: function(req, file, cb) {
		if (file.mimetype.split("/")[0] == 'image') {
			cb(null, true);
		} else {
			cb(new Error(), false);
		}
	}
}
var upload = multer(multerConfig).single('file') //不要将multer作为全局使用,注意前端提交的表单名需要是file

//上传头像
exports.avatarUpload = function(req, res) {
	var cb = {
		code: 1,
		msg: ""
	};
	upload(req, res, function(err) {
		if (err) {
			cb.msg = "上传失败！";
			res.send(cb);
			return
		}
		var _url = '/upload/avatar/' + req.file.filename;
		User.update({
			account: req.session.user.account
		}, {
			$set: {
				avatar: _url
			}
		}, function(err) {
			if (err) {
				cb.msg = "上传失败！";
				res.send(cb);
				return
			};
			//删除掉原头像文件
			var _files = fs.readdirSync('../nuxt/static/upload/avatar');
			for (var i = _files.length - 1; i >= 0; i--) {
				if (/^avatar_/.test(_files[i]) && _files[i] != req.file.filename) {
					fs.unlinkSync('../nuxt/static/upload/avatar/' + _files[i]);
				}
			}

			req.session.user.avatar = _url;
			cb.code = 0;
			res.send(cb);
		});
	})

};