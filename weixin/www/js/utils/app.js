window.app = {};
app.serverType=2;
var httpHead = window.location.href.split(':')[0];
var SERVER = httpHead+'://www.gyyxjqd.com/app/api/';

var appid = 'wx8e01b4f5c3623d37';
if (app.serverType==0) {
	SERVER = httpHead+'://www.gyyxjqd.com/app/api/';
	appid = 'wx8e01b4f5c3623d37';
}else if(app.serverType==1) {
	SERVER = httpHead+'://test.gyyxjqd.com/app/api/';
	appid = 'wx6f776c4a6e6d5ce5';
}else if(app.serverType==2) {
	SERVER = httpHead+'://192.168.1.126:3000/';
}
var logoImgUrl = SERVER.replace('api/','www/img/logo.png');
app.route = {
	ROUTE_GET_PERSONAL_DATA: SERVER + 'getPersonalInfo', //获取个人信息
	ROUTE_ENROLL_DATA: SERVER + 'enroll', //一阶课程报名
	ROUTE_SIGN_DATA: SERVER + 'sign', //签到
	ROUTE_GET_HOMEWORK_LIST: SERVER + 'getHomeworkList', //作业列表
	ROUTE_GET_CLASS_LIST: SERVER + 'getClassList', //获取课程列表
	ROUTE_GET_HOMEWORK_LIST_BY_OPENID: SERVER + 'getHomeworkListByOpenid', //作业列表
	ROUTE_GET_EXCELLENT_HOMEWORK_LIST: SERVER + 'getExcellentHomeworkList', //获取优秀作业列表
	ROUTE_GET_COURSE_LIST: SERVER + 'getCourseList' , //课程列表
	ROUTE_SUBMIT_HOMEWORK:SERVER + 'submitHomework', //提交作业
	ROUTE_COMMENT_HOMEWORK:SERVER + 'commentHomework', //留言
	ROUTE_GET_HOMEWORK_BY_ID:SERVER + 'getHomeworkById', //获取作业详情
	ROUTE_GET_HOMEWORK_TIP_DATA:SERVER + 'getHomeworkTipData', //提交作业
	ROUTE_GET_WX_CONFIG: SERVER + 'wxConfig', //获取微信配置
	ROUTE_PRAISE_HOMEWORK:SERVER + 'praiseHomework', //点赞作业
	ROUTE_SUBMIT_FEEDBACK: SERVER + 'submitFeedback',//提交意见反馈
	ROUTE_GET_ONE_SPECIAL_SOLDIER_TASK: SERVER + 'getOneSpecialSoldierTask',//获取单条特种兵作业
	ROUTE_ARTICLE_INFO: SERVER + 'articleInfo',//获取文章信息
	ROUTE_GET_COMMENT_ARTICLE_LIST: SERVER + 'getCommentArticleList',//获取评论列表
	ROUTE_GET_HOT_AVTIVITY_DETAILED: SERVER + 'getHotActivityDetailed',//热门活动详情
	ROUTE_SHARE_ENROLL: SERVER + 'shareEnroll',//热门活动分享报名
	ROUTE_ARTICLE_Jsp: SERVER + 'articleJsp',//获取文章的html页面
	ROUTE_GET_PLAN_SUMMARY: SERVER + 'getPlanSummary',//获取月、周、日计划,总结
	ROUTE_GET_RELEVANT_VIDEO: SERVER + 'relevantVideo',//获取推荐视频详情
	ROUTE_SHARE_INTRODUCE: SERVER + 'getIntroduceHtml5',
};

app.global = (function() {
	var ls = window.localStorage;
	var GLOBAL = "app_global";
	var global = {
		set: function(key, data) {
			var global = JSON.parse(ls[GLOBAL] || '{}');
			global[key] = data;
			ls[GLOBAL] = JSON.stringify(global);
		},
		add: function(key, data) {
			var global = JSON.parse(ls[GLOBAL] || '{}');
			global[key].push(data);
			ls[GLOBAL] = JSON.stringify(global);
		},
		get: function(key) {
			var global = JSON.parse(ls[GLOBAL] || '{}');
			return global[key];
		},
		getOnce: function(key) {
			var global = JSON.parse(ls[GLOBAL] || '{}');
			var ret = global[key];
			if (ret != null) {
				delete global[key];
			}
			ls[GLOBAL] = JSON.stringify(global);
			return ret;
		},
		clear: function(key) {
			var global = JSON.parse(ls[GLOBAL] || '{}');
			delete global[key];
			ls[GLOBAL] = JSON.stringify(global);
		}
	};
//	console.log('global:', ls[GLOBAL]);
	return global;
})();

app.router = (function() {
	var ls = window.localStorage;
	var HISTORY = "app_history";
	var TRANS_PARAM = "tans_param";
	var scrollTop = undefined;
	function getAbsolutePath(from, path) {
		if (from[0] === '/') {
			return from;
		}
		var parr = path.split('/').slice(0, -1);
		var farr = from.split('/');
		for (var i in farr) {
			var item = farr[i];
			if (item === '.') {
				continue;
			} else if (item === '..') {
				parr.pop();
			} else {
				parr.push(item);
			}
		}
		return parr.join('/');
	}
	var router = {
		showView: function(url, param, saved, getScrollTop) {
			scrollTop = undefined;
			var history = JSON.parse(ls[HISTORY] || '[]');
			history.push({
				href: window.location.href,
				path: window.location.pathname,
				saved: saved,
				scrollTop: getScrollTop ? getScrollTop() : $(document.body).scrollTop(),
				from: getAbsolutePath(url, window.location.pathname),
			});
			ls[HISTORY] = JSON.stringify(history);
			ls[TRANS_PARAM] = JSON.stringify(param||{});
			window.location.href = url;
		},
		pop: function(step, param) {
			var history = JSON.parse(ls[HISTORY] || '[]');
			if (!step) {
				step = 1;
			}
			var obj, len = history.length;
			obj = history[len - step];
			if (obj) {
				(step - 1) && history.splice(len - step, step - 1);
				ls[HISTORY] = JSON.stringify(history);
				window.location.href = obj.href;
			}
		},
		getSavedData: function() {
			var history = JSON.parse(ls[HISTORY] || '[]');
			var item = history[history.length - 1];
			if (!item) {
				console.log('save:', {});
				return {};
			}
			var path = window.location.pathname;
			if (item.path == path) {
				history.pop();
				ls[HISTORY] = JSON.stringify(history);
				scrollTop = item.scrollTop;
				this.from = item.from;
				this.isBack = true;
				console.log('save:', item.saved || {});
				return item.saved || {};
			} else {
				this.from = item.path;
				this.isBack = false;
				console.log('save:', item.saved || {});
				return {};
			}
		},
		resetScollerBar: function(setScrollTop) {
			if (scrollTop != undefined) {
				if (setScrollTop) {
					setScrollTop(scrollTop);
				} else {
					$(document.body).scrollTop(scrollTop);
				}
			}
		},
		getParameter: function() {
			var ret = {};
			window.location.search.substr(1).replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
				ret[decodeURIComponent(key)] = decodeURIComponent(value);
			});
			var param = JSON.parse(ls[TRANS_PARAM] || '{}');
			ls[TRANS_PARAM] = '{}';
			for (var key in ret) {
				param[key] = ret[key];
			}
			console.log('pass:', param);
			return param;
		},
		setBackParameter: function(data) {
			var param = JSON.parse(ls[TRANS_PARAM] || '{}');
			for (var key in data) {
				param[key] = data[key];
			}
			ls[TRANS_PARAM] = JSON.stringify(param);
		},
		clearHistory: function() {
			ls[HISTORY] = '[]';
		}
	};
	return router;
})();


app.utils = {
	get: function(opt) {
		var self = this;
		opt.type = "GET";
		if (!opt.dataType) { //默认返回数据时json，如果不是需要手动设置
			opt.dataType = 'json';
		}
		if (!opt.timeout) {
			opt.timeout = 30000;
		}

		opt.beforeSend = function(request) {
            request.setRequestHeader("apikey", "41a92c6e398afc79efd35252a630639b");
        };

		opt.data = JSON.stringify(opt.data);
		console.log('send:', opt.url, opt.data);
		var error = opt.error; //opt的error return true 终止传递
		opt.error = function(ret, type) {
			if (!error || !error(ret, type)) {
				self.showNetError(type);
				self.clearWait();
			}
		}
		var success = opt.success;
		opt.success = function(ret, type) {
			console.log('recv:', opt.url, ret);
			success(ret);
		}
		$.ajax(opt);
		return true;
	},
	post: function(opt) {
		var self = this;
		opt.type = "POST";

		opt.contentType = "text/plain; charset=utf-8";
		if (!opt.dataType) { //默认返回数据时json，如果不是需要手动设置
			opt.dataType = 'text';
		}
		if (!opt.timeout) {
			opt.timeout = 30000;
		}
	    var keyHex = CryptoJS.enc.Utf8.parse("SV#Y!jAz");
        var encrypted = CryptoJS.DES.encrypt(JSON.stringify(opt.data), keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        console.log('send:', opt.url, opt.data);
        opt.data = encrypted.toString();
//		console.log('send encrypt:', opt.url, opt.data);
		var error = opt.error; //opt的error return true 终止传递
		opt.error = function(ret, type) {
			console.log("error:", ret, type);
			if (!error || !error(ret, type)) {
				self.showNetError(type);
				self.clearWait();
			}
		}
		var success = opt.success;
		opt.success = function(ret, type) {
			var keyHex = CryptoJS.enc.Utf8.parse("SV#Y!jAz");
            	var decrypted = CryptoJS.DES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(ret)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
//          console.log('recv:', opt.url, ret);
			var result = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
			console.log('recv decrypted:', opt.url, result);
			success(result);
		}
		$.ajax(opt);
		return true;
	},
	showNetError: function(type) {
		if (type == "timeout") {
			this.showError("网络超时");
		} else if (type == "parsererror") {
			this.showError("数据解析错误");
		} else {
			this.showError("服务器异常");
		}
	},
	showError: function(text) {
		mui.toast(text);
	},
	setWait: function(text) {
		var el = $("#mask_container");
		if (el.length) {
			return;
		}
		var opts = {
			lines: 12, // 花瓣数目
			length: 10, // 花瓣长度
			width: 3, // 花瓣宽度
			radius: 10, // 花瓣距中心半径
			corners: 1, // 花瓣圆滑度 (0-1)
			rotate: 0, // 花瓣旋转角度
			direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
			color: '#FBDC9F', // 花瓣颜色
			speed: 1, // 花瓣旋转速度
			trail: 60, // 花瓣旋转时的拖影(百分比)
			shadow: false, // 花瓣是否显示阴影
			hwaccel: false, //spinner 是否启用硬件加速及高速旋转
			className: 'spinner', // spinner css 样式名称
			zIndex: 2e9, // spinner的z轴 (默认是2000000000)
			//      top: 'auto', // spinner 相对父容器Top定位 单位 px
			//      left: 'auto'// spinner 相对父容器Left定位 单位 px
		};
		this.spinner = new Spinner(opts);
		var el = $('<div id="mask_container""><div class="modal-backdrop"></div><div class="spinner-text-container">' + (text||'') + '</div></div>');
		$(document.body).append(el);
		this.spinner.spin(el[0]); //打开等待加载
	},
	clearWait: function() {
		var el = $("#mask_container");
		if (!el.length) {
			return;
		}
		el.remove();
		this.spinner.spin(); //关闭等待加载
	},
	getScrollTop: function(el) {
		var transform = el.css('transform');
		if (!transform) {
			transform = el.css('-webkit-transform');
		}
		if (!transform) {
			transform = el.css('-moz-transform');
		}
		if (!transform) {
			transform = el.css('-ms-transform');
		}
		if (!transform) {
			transform = el.css('-o-transform');
		}
		transform = transform||'';
		return parseInt(transform.replace(/px, 0px.*/, '').replace(/.*, /, ''))||0;
	}
};


app.weixin = (function() {
	wx.ready(function(){
		console.log('wx.ready');
		app.weixin.getWeixinConfigSuccessCallback && app.weixin.getWeixinConfigSuccessCallback();
	});
	wx.error(function(){
		console.log('wx.error');
		app.weixin.getWeixinConfigFromServer();
	});
	var weixin = {
		setWeixinMenuShare: function(url, data) {
			data = data||{};
			var urlStr = '';
			var arr = url.split('?');
			urlStr = encodeURIComponent(arr[0]+'?homeworkId='+data.homeworkId);
			//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
			wx.onMenuShareTimeline({
				title: data.title, // 分享标题
				link:'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
				imgUrl: logoImgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					// alert("shareurl:"+'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6f776c4a6e6d5ce5&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect');
//					alert("分享朋友成功1");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});

			//获取“分享给朋友”按钮点击状态及自定义分享内容接口
			wx.onMenuShareAppMessage({
				title: data.title, // 分享标题
				desc: data.desc, // 分享描述
				link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
				imgUrl: logoImgUrl, // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// alert("shareurl:"+'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6f776c4a6e6d5ce5&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect');
//					alert("分享朋友成功2");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});

			//获取“分享到QQ”按钮点击状态及自定义分享内容接口
			wx.onMenuShareQQ({
				title: data.title, // 分享标题
				desc: data.desc, // 分享描述
				link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
				imgUrl:logoImgUrl, // 分享图标
				success: function () {
				   // 用户确认分享后执行的回调函数
				//    alert("shareurl:"+'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6f776c4a6e6d5ce5&redirect_uri='+urlStr+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect');
//				   alert("分享朋友成功3");
				},
				cancel: function () {
				   // 用户取消分享后执行的回调函数
				}
			});
			wx.hideMenuItems({
			    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		registerWeixinConfig: function(url, success) {
			console.log("getWeixinConfig", url);
			app.weixin.getWeixinConfigSuccessCallback = success;
			app.weixin.getWeixinConfigFromServer = function() {
					app.utils.post({
					url: app.route.ROUTE_GET_WX_CONFIG,
					data: {url: url},
					success: app.weixin.getWeixinConfigFromServerSuccess
				});
			};
			var weixinConfig = app.global.get("weixinConfig");
			if (!weixinConfig) {
				console.log("getWeixinConfig from server");
				app.weixin.getWeixinConfigFromServer();
			} else {
				console.log("getWeixinConfig from local");
				app.weixin.doRegisterWeixinConfig(weixinConfig);
			}
		},
		doRegisterWeixinConfig: function(config) {
			console.log('config', config);
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: config.appId, // 必填，公众号的唯一标识
				timestamp: config.timestamp, // 必填，生成签名的时间戳
				nonceStr: config.nonceStr, // 必填，生成签名的随机串
				signature: config.signature,// 必填，签名，见附录1
				jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		},
		getWeixinConfigFromServerSuccess: function(data) {
			if (data.success === true && data.context) {
				app.global.set("weixinConfig", data.context);
				app.weixin.doRegisterWeixinConfig(data.context);
			} else {
				app.weixin.closeWindowOnError();
			}
		},
		closeWindowOnError: function() {
			mui.toast("获取微信配置失败，请稍后重试");
			setTimeout(function() {
				// wx.closeWindow();
			}, 3000);
		},
	};
	return weixin;
})();
