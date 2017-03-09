'use strict';

//该文件永远不要提交svn
//发布正式服务器的配置，svn上面永远不要动这个配置，在发布测试服务器的时候将ISSUE改为false
//如果发布ios时 ISSUE_IOS=true 其他的发布为 ISSUE_IOS=false
//CHANNEL为android渠道，发布百度市场时为baidu,其他的为default,ios忽略这个选项
let CONFIG = {
    ISSUE: true,
    ISSUE_IOS: false,
    CHANNEL: 'default',
};

//发布测试服务器的配置，该配置只有 CONFIG.ISSUE 为 false 的时候才生效
//如果是本地开发模式， CONFIG.ISSUE = false， TEST_CONFIG.ISSUE = false, 同时可以修改调试的服务器
//如果是发布测试服务器， CONFIG.ISSUE = false，TEST_CONFIG.ISSUE = true
let TEST_CONFIG = {
    ISSUE: true,
    BASE_SERVER_INDEX: 1, //只有 TEST_CONFIG.ISSUE 为 false时生效
    BASE_CHAT_SERVER_INDEX: 1, //只有 TEST_CONFIG.ISSUE 为 false时生效
};

//web服务器 依次是本地服务器， 测试服务器， 正式服务器
const BASE_SERVERS = ['localhost:3000', 'test.gyyxjqd.com', 'www.gyyxjqd.com'];
//聊天服务器 依次是本地服务器(石毅的测试ip)， 测试服务器， 正式服务器
const BASE_CHAT_SERVERS = ['192.168.1.102', '120.76.207.56', '120.76.24.185'];

const BASE_SERVER = CONFIG.ISSUE ? BASE_SERVERS[2] : TEST_CONFIG.ISSUE ? BASE_SERVERS[1] : BASE_SERVERS[TEST_CONFIG.BASE_SERVER_INDEX];
const CHAT_SERVER_IP = CONFIG.ISSUE ? BASE_CHAT_SERVERS[2] : TEST_CONFIG.ISSUE ? BASE_CHAT_SERVERS[1] : BASE_CHAT_SERVERS[TEST_CONFIG.BASE_CHAT_SERVER_INDEX];

module.exports = {
    ISSUE_IOS: CONFIG.ISSUE_IOS,
    MINIFY: CONFIG.ISSUE, //是否压缩js文件，我们采取测试服务器为了查找问题不用压缩js文件，正式服务器需要压缩js文件，并且不能看到调试信息
    CHANNEL: CONFIG.CHANNEL,
    API_VERSION: 3, //服务器请求的接口版本号
    //IOS的appid
    IOS_APPID: '1096525384',
    // IOS_APPID: '',
    //web服务器
    DES_KEY:'SV#Y!jAz', //DES加密KEY
    SERVER: 'http://'+BASE_SERVER+'/app/api/', //web服务器地址
    DOWNLOAD_SERVER: 'http://'+BASE_SERVER+'/download/apks/admin/apks/',//程序更新下载地址
    WEBSOCKET_CHAT_SERVER: 'ws://'+BASE_SERVER+'/websocket/',   //聊天服务器地址
    SHARE_IMGDIR_SERVER: 'http://'+BASE_SERVER+'/app/www/img/',   //分享图片目录
    SHARE_HOMEWORKDETAIL_SERVER: 'http://'+BASE_SERVER+'/app/www/pages/homework/',   //分享作业详情目录
    SHARE_APPDOWNLOAD_SERVER: 'http://'+BASE_SERVER+'/app/www/pages/sign/download.html',   //分享下载app页面
    SHARE_SHAREDIR_SERVER: 'http://'+BASE_SERVER+'/app/www/pages/share/',   //分享网页目录
    INTEGRAL_EXPLAINDIR_SERVER: 'http://'+BASE_SERVER+'/web/www/integral/integralExplain.html',   //积分说明页面
    //获取验证码的超时时间
    DEFAULT_CODE_TIMEOUT: 90,
    //聊天服务器
    CHAT_SERVER_IP: CHAT_SERVER_IP, //测试专用聊天服务器IP
    CHAT_SERVER_PORT: 52347, //聊天服务器端口
    //服务器超时
    TRAIN_SERVER_TIMEOUT: 30,
    MEETING_SERVER_TIMEOUT: 30,
    //显示指引层的次数控制
    GUIDE_SHOW_TIMES: 0,
    //显示发布规则是否显示
    IS_RULES_SHOW: true,
    //主题颜色
    THEME_COLOR:'#A62045',
    THEME_COLORS: ['#DE3031', '#FFFFFF'],//#DE3031
    //训练场时长
    TRAIN_TYPES: {
        '10001':{gameType: 1, roundTime: 60*1000}, //一分钟自我介绍
        '10002':{gameType: 2, roundTime: 45*1000}, //5秒打电话
        '10003':{gameType: 3, roundTime: 5*60*1000}, //5分钟演讲
    },
    //自定义会场的说话人数
    MAX_MEETING_SPEAKER_NUMBER: 6,
    //自定义会场倒计时变红
    MEET_COUNT_TIME_DOWN: 10*60000,
    //视频播放
    VIDEO_REWARD_RATION: 0.90, //视频播放获取奖励需要时长占总时长的比例
    //微吼直播
    VHALL_APP_KEY: '1349953300',
    VHALL_APP_SECRECT_KEY: 'b4f69bd6dd0c37db138b2a613786f24f',
    //分页列表每页数据的条数
    PER_PAGE_COUNT: 10,
    LISTVIEW_INFINITE: {
        STATUS: {
            /*loading more status change graph
            *
            * STATUS_TEXT_HIDE->[STATUS_HAVE_MORE, STATUS_START_LOAD]
            * STATUS_START_LOAD->[STATUS_TEXT_HIDE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR]
            * STATUS_HAVE_MORE->[STATUS_TEXT_HIDE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR]
            * STATUS_ALL_LOADED->[STATUS_TEXT_HIDE]
            */
            STATUS_TEXT_HIDE: 0,
            STATUS_START_LOAD: 1,
            STATUS_HAVE_MORE: 2,
            STATUS_NO_DATA: 3,
            STATUS_ALL_LOADED: 4,
            STATUS_LOAD_ERROR: 5,
        },
        TEXT: {
            0: '',
            1: '',
            2: '正在加载更多...',
            3: '暂无数据!',
            4: '没有更多内容',
            5: '加载错误，请稍后再试',
        },
    },
};
