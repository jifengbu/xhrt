'use strict';

const {SERVER,DOWNLOAD_SERVER, WEBSOCKET_CHAT_SERVER} = CONSTANTS;

module.exports = {
    //登录
    ROUTE_CHECK_JS_UPDATE: SERVER+'versionUpdate',//检测js更新
    ROUTE_LOGIN: SERVER+'login',//登录
    ROUTE_SEND_VERIFICATION_CODE: SERVER+'sendVerificationCode',//发送验证码
    ROUTE_REGISTER: SERVER+'register',//注册
    ROUTE_FIND_PWD: SERVER+'findPwd',//忘记密码确认
    ROUTE_UP_DATEPWD: SERVER+'updatePwd',//忘记密码提交更新
    //聊天(websocket)
    ROUTE_WS_CHAT: WEBSOCKET_CHAT_SERVER+'websocket',//聊天的websocket地址
    //首页
    ROUTE_GET_HOME_PAGE_DATA: SERVER+'getHomePageData',//拉取首页数据
    ROUTE_DO_LIKE: SERVER+'doLike',//点赞
    ROUTE_DO_COLLECTION: SERVER+'doCollection',//收藏
    ROUTE_DO_SHARE: SERVER+'doShare',//分享
    //搜索
    ROUTE_GET_SEARCH_DATA: SERVER+'getSearchData',//进入搜索页面拉取搜索数据
    ROUTE_SEARCH: SERVER+'searchAll',//首页总体搜索
    ROUTE_SEARCH_VIDEO: SERVER+'searchVideo',//学习场搜索视频
    ROUTE_SEARCH_QUESTION: SERVER+'searchQuestion', //搜索问答
    ROUTE_SEARCH_ROOM: SERVER+'searchRoom', //搜索特种交流房间
    //个人中心
    ROUTE_SUBMIT_GETMYTASKRECORD: SERVER+'getMyTaskRecord',//获取我的任务记录
    ROUTE_SUBMIT_GETMYPROFIT: SERVER+'getMyProfit',//获取代理商收益
    ROUTE_SUBMIT_GETMYNEWS: SERVER+'getNews',//获取消息
    ROUTE_SUBMIT_DELNEWS: SERVER+'delNews',//删除消息
    ROUTE_SUBMIT_GETMYCOLLECTION: SERVER+'getMyCollection',//获取收藏
    ROUTE_SUBMIT_DELETEMYCOLLECTION: SERVER+'delMyCollectVedio',//删除收藏
    ROUTE_GET_PERSONAL_INFO: SERVER+'getPersonalInfo',//获取个人信息
    ROUTE_UPDATE_FILE: SERVER+'uploadFile',//上传文件
    ROUTE_UPDATE_MULTI_FILES: SERVER+'uploadFiles',//上传多个文件
    ROUTE_UPDATE_PERSONAL_INFO: SERVER+'updatePersnalInfo',//更新个人信息
    ROUTE_SUBMIT_GETMYLEARNINGRECORD: SERVER+'getMyLearningRecord',//获取学习记录
    ROUTE_SUBMIT_DELMYLEARNINGRECORD: SERVER+'delMyLearningRecord',//删除学习记录
    ROUTE_SUBMIT_FEEDBACK: SERVER+'submitFeedback',//提交信息反馈
    ROUTE_CHANGE_MESSAGE_STATE: SERVER+'changeMyNewsState',//修改信息阅读状态
    ROUTE_BIND_ACCOUNT_SCORE: SERVER+'bindAccount',//绑定帐户
    ROUTE_GET_INTEGRAL_DETAIL: SERVER+'getIntegralDetail',//每日积分明细
    //学习场
    ROUTE_GET_PRIZES: SERVER+'getPrizes',//点击抽奖接口
    ROUTE_GET_VIDEO_LIST: SERVER+'getVideoList',//获取学习场视频列表
    ROUTE_GET_REWARD_LIST: SERVER+'getRewardList',//跳转到抽奖接口
    ROUTE_MY_AWARD_RECORDS: SERVER+'myAwardRecords',//我的获奖记录
    ROUTE_SUBMIT_RECEIVEING_INFO: SERVER+'submitReceivingInfo',//获奖后提交个人信息
    ROUTE_GET_INTEGRAL_GOODS: SERVER+'getIntegralGoods',//拉取积分兑换数据
    ROUTE_EXCHANGE: SERVER+'exchange',//积分兑换
    ROUTE_RELEVANT_VIDEO: SERVER+'relevantVideo',//推荐案例、相关视频
    ROUTE_GET_WIN_COIN_GOODS: SERVER+'getWinCoinGoods',//拉取赢销币购买列表
    ROUTE_CREATE_WIN_CONIN_ORDER: SERVER+'createWinCoinOrder',//赢销币购买--生成订单
    ROUTE_GET_COMMENT: SERVER+'getComment',//获取评论
    ROUTE_WATCH_VIDEO: SERVER+'watchVideo',//看完一个视频 获得积分
    ROUTE_SUBMIT_SON_COMMENT: SERVER+'submitSonComment',//提交评论的回复
    ROUTE_GET_SON_COMMENT: SERVER+'getSonComment',//获取评论的回复
    ROUTE_SUBMIT_COMMENT: SERVER+'submitComment',//提交评论
    ROUTE_GET_TASK_INTEGRATION: SERVER+'getTaskIntegration',//获取各任务以及相应的积分
    ROUTE_UPDATECLICKS: SERVER+'updateClicks',//添加视频的点击量（在点击播放的时候执行该接口）
    ROUTE_GET_VIDEO_INFO_BYID: SERVER+'getVideoInfoById',//点击播放视频页面获取视频信息
    ROUTE_CHECK_ALIPAY_ISSUCCESS: SERVER+'checkAlipayIsSuccess',//验证支付宝支付是否成功
    //训练场
    ROUTE_GET_TRAINING_INFO: SERVER+'getTrainingInfo',//获取所有训练项目信息
    ROUTE_SEND_MESSAGE: SERVER+'sendMessage',//训练场中：发送信息
    ROUTE_UPDATE_MESSAGE: SERVER+'updateMessage',//训练场中：刷新交流信息
    ROUTE_SEND_PROP: SERVER+'sendProp',//训练场中：送道具
    ROUTE_SUBMIT_SCORE: SERVER+'submitScore',//提交打分信息
    ROUTE_GET_VIRTUAL_INFO: SERVER+'getVirtualInfo',//自我训练场获取虚拟人物和虚拟评论
    ROUTE_GET_ALIPAY_INFO: SERVER+'getaliPayInfo',//前端获取支付宝认证信息
    ROUTE_GET_WXPAY_INFO: SERVER+'perpay',//前端获取微信支付信息
    //自定义训练场
    ROUTE_APPLY_ROOM: SERVER+'applyRoom',//自定义场房间申请
    ROUTE_GET_ROOM_LIST: SERVER+'getCustomRoomList',//获取自定义房间列表
    ROUTE_SUBMIT_ONLINE_PERSON: SERVER+'onLinePeopleNum',//提交房间在线人数
    ROUTE_SUBMIT_DELETE_ROOM: SERVER+'delRoom',//删除房间
    ROUTE_GET_MY_ROOM_LIST: SERVER+'getCustomRoomListByUserId',//获取我的房间
    //网页地址
    ROUTE_USER_PROTOCOL: SERVER+'protocolJsp',//用户协议
    ROUTE_SOFTWARE_LICENSE: SERVER+'agreementJsp',//获取软件许可协议
    ROUTE_ABOUT_PAGE: SERVER+'aboutJsp', //关于
    ROUTE_GAME_RULE_PAGE: SERVER+'checkoutRulesJsp', //游戏规则
    ROUTE_GET_PUBLISHER_RULES_PAGE: SERVER+'getPublisherRules', //发布求救包／急救包规则
    //下载更新
    ROUTE_VERSION_INFO_URL: DOWNLOAD_SERVER+'json/version.json',//版本信息地址
    ROUTE_JS_ANDROID_URL: DOWNLOAD_SERVER+'jsAndroid/jsandroid.zip',//android jsbundle 包地址
    ROUTE_JS_IOS_URL: DOWNLOAD_SERVER+'jsIos/jsios.zip',//ios jsbundle 包地址
    ROUTE_APK_URL: DOWNLOAD_SERVER+'apk/yxjqd.apk', //apk地址
    //商场
    ROUTE_GET_GOODS_INFO: SERVER+'getGoodsInfo', //获取商城首页数据
    ROUTE_SEARCH_GOODS: SERVER+'searchGoods', //商城首页搜索
    ROUTE_GET_GOODS_DETAIL: SERVER+'getGoodsDetail', //获取商品详情
    ROUTE_GET_SHOP_INFO: SERVER+'getshopInfo', //获取商家信息
    ROUTE_GET_GOODS_COMMENT: SERVER+'getGoodsComment', //获取商品评论
    ROUTE_MERCHANDISING: SERVER+'merchandising', //购买商品/选择商品
    ROUTE_PLACE_ORDER: SERVER+'placeOrder', //下订单
    ROUTE_ORDER_DATA: SERVER+'orderData', //下订单页面获取数据
    ROUTE_GET_MY_ADDR: SERVER+'getMyAddr', //获取个人地址信息
    ROUTE_SUBMIT_MY_ADDR: SERVER+'submitMyAddr', //提交个人地址信息
    ROUTE_GET_MY_ORDER: SERVER+'getMyOrder', //获取我的订单信息
    ROUTE_GET_ORDER_DETAIL: SERVER+'getOrderDetail', //获取订单详情
    ROUTE_DEL_ORDER: SERVER+'delOrder', //删除订单
    ROUTE_SUBMIT_GOODS_COMMENT: SERVER+'submitGoodsComment', //提交评论
    ROUTE_END_ORDER: SERVER+'endOrder', //确认收货
    ROUTE_ALIPAY_CONFIRM: SERVER+'aliPayConfirm', //阿里支付确认
    ROUTE_WECHATPAY_CONFIRM: SERVER+'wechatPayConfirm', //微信支付确认
    //实战场
    ROUTE_GET_KITS: SERVER+'getKits', //实战场获取需求数据
    ROUTE_GET_CASE: SERVER+'getCase', //实战场获取案例数据
    ROUTE_GET_ITEM_KIT: SERVER+'getItemKit', //获取item急救包详情
    ROUTE_GET_ITEM_KIT_COMMENT: SERVER+'getItemKitComment', //获取item急救包评论
    ROUTE_REPLAY_ITEM_KIT: SERVER+'replayItemKit', //回复item急救包评论
    ROUTE_GET_SONKIDS_COMMENT: SERVER+'getSonKidsComment', //获取评论的回复
    ROUTE_SUBMIT_SONKIDS_COMMENT: SERVER+'submitSonKidsComment', //提交评论的回复
    ROUTE_CASE_SCHEME: SERVER+'getCaseScheme', //对每个case获取网友方案
    ROUTE_PARISE_KITS: SERVER+'praiseKits', //急救包点赞
    ROUTE_GET_SCORE_DETAIL: SERVER+'getScoreDetail', //实战场获取分数详情
    ROUTE_SUBMIT_SCHEME_SCORE: SERVER+'submitSchemeScore',//提交打分信息
    ROUTE_GET_CASE_SCHEME_DETAIL: SERVER+'getCaseSchemeDetail', //方案详情
    ROUTE_SUBMIT_KIT: SERVER+'submitKit', //报名提交方案
    ROUTE_PUBLISHER_KID: SERVER+'publisherKid', //发布求救包
    ROUTE_PUBLISHER_KIT: SERVER+'publisherKit', //发布急救包
    ROUTE_GET_PUBLISHER_RULES: SERVER+'getPublisherRules', //发布规则
    ROUTE_GET_MY_AID_DETAIL: SERVER+'getMyAidDetail', //个人中心——急救包详情
    ROUTE_MY_KID: SERVER+'myKid', //我的急救包
    ROUTE_REMUNERATION_ADD: SERVER+'RemunerationAdd', //打赏赢销币接口
    ROUTE_MY_JOIN_KIT: SERVER+'myJoinKit', //求救包管理（参与的）
    ROUTE_GET_AID_MANAGE_LIST: SERVER+'getAidManageList', //急救包管理(个人中心进)
    //新增接口
    ROUTE_GET_PACKAGE_LIST: SERVER+'getPackageList', //	获取套餐列表
    ROUTE_GET_PACKAGE_ITEM: SERVER+'getPackageItem', //	获取套餐item的详情
    // 我是代理商
    ROUTE_GET_STUIEST: SERVER+'getStduiest', //	代理商-学习管理（员工学习列表）
    ROUTE_GET_STUIEST_ITEM: SERVER+'getStduiestItem', //	代理商-学习管理（员工学习列表-详情）
    ROUTE_BUSINESS_SCHOOL_LIST: SERVER+'businessSchoolList', //商学院列表
    ROUTE_BUSINESS_SCHOOL_ITEM: SERVER+'businessSchoolItem', //商学院详情
    ROUTE_APPLICATION_FOR_CASH: SERVER+'applicationForCash', //申请提现
    ROUTE_CASH_RECORD: SERVER+'cashRecord', //提现记录
    ROUTE_GET_MY_PROFIT: SERVER+'getMyProfit', //代理商收益
    ROUTE_MY_INVIATION_CODE_DETAIL: SERVER+'myInvitationCodeDetail', //代理商获邀请码使用详情
    // 我的套餐
    ROUTE_TRAINING_CONSUMPTION: SERVER+'trainingConsumption', //消費一次训练场
    // 直播
    ROUTE_GET_PLAYBACK_LIST: SERVER+'playBackInfo', //获取回播列表
    ROUTE_APPOINTMENT_LIVE: SERVER+'appointmentLive', //手机端特种兵直播预约
    ROUTE_LAUNCH_LIVE: SERVER+'launchLive', //手机端发起和特种兵的直播
    //优秀作业
    ROUTE_GET_COURSE_LIST: SERVER+'getCourseList', //获取课程列表
    ROUTE_GET_HOME_WORK_LIST: SERVER+'getHomeworkList', //获取作业列表
    ROUTE_GET_EXCELLENT_HOME_WORK_LIST: SERVER+'getExcellentHomeworkList', //获取优秀作业列表
    ROUTE_GET_HOME_WORK_TIP_DATA: SERVER+'getHomeworkTipData', //获取作业提示信息
    //特种兵
    ROUTE_SPECIAL_SOLDIER_VERIFICATION: SERVER+'specialSoldierVerification', //特种兵验证
    ROUTE_GET_SPECIAL_SOLDIER_DATA: SERVER+'getSpecialSoldierData', //获取特种兵首页获取数据
    ROUTE_SUBMIT_DAY_SUMMARY: SERVER+'submitDaySummary', //提交日总结
    ROUTE_GET_DAY_SUMMARY: SERVER+'getDaySummary', //获取日总结
    ROUTE_SUBMIT_WEEK_SUMMARY: SERVER+'submitWeekSummary', //提交周总结
    ROUTE_GET_WEEK_SUMMARY: SERVER+'getWeekSummary', //获取周总结
    ROUTE_ADD_MONTH_PLAN: SERVER+'addMonthPlan', //月计划增加条目
    ROUTE_EDIT_MONTH_PLAN: SERVER+'editMonthPlan', //修改月计划条目
    ROUTE_SET_MONTH_PLAN_IS_OVER: SERVER+'setMonthPlanIsOver', //标记完成月计划
    ROUTE_GET_MONTH_PLAN: SERVER+'getMonthPlan', //获取月计划
    ROUTE_ADD_WEEK_PLAN: SERVER+'addWeekPlan', //周计划增加条目
    ROUTE_GET_WEEK_PLAN: SERVER+'getWeekPlan', //获取周计划
    ROUTE_EDIT_WEEK_PLAN: SERVER+'editWeekPlan', //修改周计划
    ROUTE_SET_WEEK_PLAN_IS_OVER: SERVER+'setWeekPlanIsOver', //标记完成周计划
    ROUTE_ADD_TODAY_PLAN: SERVER+'addTodayPlan', //日计划增加条目
    ROUTE_EDIT_DAY_PLAN: SERVER+'editDayPlan', //修改日计划
    ROUTE_SET_DAY_PLAN_IS_OVER: SERVER+'setDayPlanIsOver', //标记完成日计划
    ROUTE_SPECIAL_SOLDIER_VIDEO: SERVER+'specialSoldierVideo', //获取特种兵视频详情
    ROUTE_SUBMIT_SPECIAL_SOLDIER_TASK: SERVER+'submitSpecialSoldierTask', //提交视频匹配作业题目的作业
    ROUTE_QUESTION: SERVER+'question', //向教练提问题
    ROUTE_GET_AGENT_INFO: SERVER+'getAgentInfo', //获取4800代理商\特种兵二维码信息
    ROUTE_GET_SPECIAL_SOLDIER_HOMEWORK: SERVER+'getSpecialSoldierHomework', //获取特种兵个人的作业
    ROUTE_GET_SPECIAL_SOLDIER_QUESTION: SERVER+'getSpecialSoldierQuestion', //获取特种兵个人的问题
    ROUTE_GET_QAND_A: SERVER+'getQandA', //获取精彩问答
    ROUTE_ANSWER: SERVER+'answer', //回答问题
    ROUTE_QAND_ADETAIL: SERVER+'qandADetail', //搜索问答得到的数据是特种兵的问题，点击获取特种兵问题的详情
    ROUTE_END_VIDEO: SERVER+'endVideo', //反馈特种兵视频是否看完
    ROUTE_GET_PERSONAL_CARD_INFO: SERVER+'getPersonalCardInfo', //获取名片信息
    ROUTE_GET_SPECIAL_SOLDIER_EXCELLENT_HOMEWORK: SERVER+'getSpecialSoldierExcellentHomework', //获取特种兵精彩任务
    ROUTE_GET_PLAN_SUMMARY: SERVER+'getPlanSummary', //获取计划与总结
    ROUTE_GET_FIXED_PROBLEM: SERVER+'getFixedProblem', //获取问题
    ROUTE_ADD_FIXED_PROBLEM_ANSWER: SERVER+'addFixedProblemAnswer', //提交问题
    ROUTE_GET_REPORT_EMAIL: SERVER+'addReportEmail', //提交汇报邮箱
    ROUTE_GET_ACTUAL_COMPLETE_WORK: SERVER+'getActualCompleteWork', //获取实际做的事列表
    ROUTE_ADD_ACTUAL_COMPLETE_WORK: SERVER+'addActualCompleteWork', //新增实际做的事
    ROUTE_FINISH_ACTUAL_COMPLETE_WORK: SERVER+'finishActualCompleteWork', //完成实际做的事
    ROUTE_EDIT_ACTUAL_COMPLETE_WORK: SERVER+'editActualCompleteWork', //编辑实际做的事
    ROUTE_DEL_ACTUAL_COMPLETE_WORK: SERVER+'delActualCompleteWork', //删除实际做的事
    ROUTE_ADD_PERCENTAGE_RANKING: SERVER+'addPercentageRanking', //增加完成度
    ROUTE_GET_INDUSTRY: SERVER+'getIndustry', //行业
    ROUTE_GET_SUBJECT_ALL: SERVER+'getSubjectAll', //获取题目信息
    ROUTE_SUBMIT_ANSWER: SERVER+'submitAnswer', //获取题目信息

    ROUTE_GET_DAY_PLAN: SERVER+'getDayPlan', //获取日计划
    ROUTE_DELETE_DAY_PLAN: SERVER+'deleteDayPlan', //删除日计划
    ROUTE_DELETE_WEEK_PLAN: SERVER+'deleteWeekPlan', //删除周计划
    ROUTE_DELETE_MONTH_PLAN: SERVER+'deleteMonthPlan', //删除月计划
    ROUTE_ADD_USER_QUESTION: SERVER+'addUserQuestion', //添加备注问题
    ROUTE_EDIT_USER_QUESTION: SERVER+'editUserQuestion', //修改备注问题
    ROUTE_DELETE_USER_QUESTION: SERVER+'delUserQuestion', //删除备注问题
    ROUTE_ADD_PROBLEM_ANSWER: SERVER+'addProblemAnswer', //固定问题修改
    ROUTE_GET_SPECOPS_INTRODUCTION: SERVER+'getSpecopsIntroduction', //获取特种兵简介
    ROUTE_GET_HOME_PAGE_PLAN: SERVER+'getHomePagePlan', //获取特种兵首页计划
    ROUTE_STUDY_PROGRESS: SERVER+'studyProgress', //特种兵本周课程学习进度
    ROUTE_SHARE_LOG: SERVER+'shareLog', //分享进度回调
    ROUTE_SHARE_WORK_TASK: SERVER+'workTask', //新增周任务数据接口

    //新版首页接口
    ROUTE_STUDY_PROGRESS_LIST: SERVER+'studyProgressList', //个人中心课程列表
    ROUTE_GET_HOT_AVTIVITY_LIST: SERVER+'getHotActiveityList', //热门活动列表
    ROUTE_GET_HOT_AVTIVITY_DETAILED: SERVER+'getHotActivityDetailed', //热门活动详情
    ROUTE_GET_USER_STUDY_INFO: SERVER+'getUserStudyInfo', //首页个人信息（个人学习记录）
    ROUTE_GET_ARTICLE_LIST: SERVER+'getArticleList', //获取推荐阅读文章列表
    ROUTE_PRAISE_LOG: SERVER+'praiseLog', //点赞记录 文章点赞
    ROUTE_CANCEL_PRAISE_LOG: SERVER+'cancelPraiseLog', //取消点赞记录 文章点赞
    ROUTE_COLLECTION_LOG: SERVER+'collectionLog', //收藏记录 文章收藏
    ROUTE_CANCEL_COLLECTION_LOG: SERVER+'cancelCollectionLog', //取消收藏记录 文章收藏
    ROUTE_WATCH_LOG: SERVER+'watchLog', //观看记录 文章观看
    ROUTE_COMMENT_ARTICLE: SERVER+'commentArticle', //评论文章
    ROUTE_ARTICLE_INFO: SERVER+'articleInfo', //推荐阅读文章详情
    ROUTE_GET_COMMENT_ARTICLE_LIST: SERVER+'getCommentArticleList', //获取推荐阅读评论列表
    ROUTE_GET_ENCOURAGE_COURSE_LIST: SERVER+'getEncourageCourseList', //获取推荐课程列表
    ROUTE_APP_ENROLL: SERVER+'appEnroll', //活动报名
    ROUTE_ARTICLE_PAGE: SERVER+'articleJsp', //推荐阅读内容信息HTML页面
    ROUTE_GET_STAR_COMPANY_LIST: SERVER+'getStarCompanyList', //明星企业列表
    ROUTE_STAR_COMPANY_PAGE: SERVER+'starCompanyJsp', //明星企业内容信息HTML页面
    ROUTE_STAR_COMPANY_INFO: SERVER+'starCompanyInfo', //明星企业内容详情页面

    //任务接口
    ROUTE_GET_SPECIAL_TASK: SERVER+'getSpecialTask', //获取特种兵任务列表
    ROUTE_GET_TRAIN_TASK: SERVER+'getTrainTask', //获取训练任务列表
    ROUTE_GET_STUDY_TASK: SERVER+'getStudyTask', //获取学习任务列表
    ROUTE_GET_PLATFORM_TASK: SERVER+'getPlatformTask', //获取平台任务列表
    ROUTE_INSERT_CURRENT_TASK_LOG: SERVER+'insertCurrentTaskLog', //插入任务

    //boss接口
    ROUTE_GET_HOMEWORK_DETAILS: SERVER+'getHomeworkDetails', //获取课后作业列表
    ROUTE_GET_COMPANY_INFO: SERVER+'getCompanyInfo', //获取公司信息
    ROUTE_GET_WORK_SITUATION_ABSTRACT: SERVER+'getWorkSituationAbstract', //获取员工工作情况
    ROUTE_GET_SPECIAL_LIST: SERVER+'getSpecialList', //获取企业下属特种兵列表
    ROUTE_GET_STUDY_SITUATION_ABSTRACT: SERVER+'getStudySituationAbstract', //获取学习情况概要
    ROUTE_GET_MONTH_CENTEXE_USER_LIST: SERVER+'getMonthCentexeUserList', //获取员工月目标列表
    ROUTE_GET_DAY_PLAN_USER_LIST: SERVER+'getDayPlanUserList', //获取员工日计划列表
    ROUTE_GET_DAY_SUMMER_USER_LIST: SERVER+'getDaySummerUserList', //获取员工日总结列表
    ROUTE_GET_QUIZZES_DETAIL: SERVER+'getQuizzesDetails', //获取随堂测试
    ROUTE_GET_STUDY_SITUATION_DETAILS: SERVER+'getStudySituationDetails', //获取学习情况详情
    ROUTE_GET_PERSONAL_STUDY_DETAILS: SERVER+'getPersonalStudyDetails', //获取个人学习情况详情
    ROUTE_GET_PERSONAL_QUIZZES_DETAILS: SERVER+'getPersonalQuizzesDetails', //获取个人随堂测试详情
    ROUTE_GET_PERSONAL_HOMEWORK_DETAILS: SERVER+'getPersonalHomeworkDetails', //获取个人课后作业详情
    ROUTE_GET_USER_TASK_SUBMIT_RATE: SERVER+'getUserTaskSubmitRate', //获取员工任务提交率
    ROUTE_GET_USER_TASK_SUBMIT_RATE_DETAILS: SERVER+'getUserTaskSubmitRateDetails', //获取员工任务提交率详情

};
