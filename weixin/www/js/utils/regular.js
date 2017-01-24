/**
 * 验证手机号
 * @param {Object} tel
 */
function testPhone(tel){
	var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	 if (reg.test(tel)) {
	     return true;
	 }else{
//			     document.getElementById("telPhone").focus();
	     return false;
	 };
}

/**
 * 获取单选框的值
 * @param {Object} RadioName
 */
function GetRadioValue(RadioName){
    var obj;
    obj=document.getElementsByName(RadioName);
    if(obj!=null){
        var i;
        for(i=0;i<obj.length;i++){
            if(obj[i].checked){
                return obj[i].value;
            }
        }
    }
    return null;
}

/**
 * 验证邮箱
*/
function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 验证身份证号码
 * @param {Object} card
 */
function isCardNo(card)
{
   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   if(reg.test(card)){
   		return true;
   }else{
   		return false;
   }

}
/**
 * 验证工商执照号
 * @param {Object} str
 */
function isLicenseNo(str){
	var reg = /\d{15}/;
	if(reg.test(str)){
   		return true;
   }else{
   		return false;
   }
}
/**
 * 验证邮箱（包含@和.）
 * @param {Object} str
 */
function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 *  邮政编码的验证（开头不能为0，共6位）
 * @param {Object} str
 */
function checkZipcode(str){
	var re= /^[1-9][0-9]{5}$/
    if(re.test(str)){
      	return true;
    }else{
      return false;

    }
}
/**
 * 验证数字(包含小数点)
*/
function checkNum(str){
    var re = /^[0-9]+.?[0-9]*$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 验证出生日期(平年日期格式为YYYY-MM-DD的正则表达式)
*/
function checkBirthDate(str){
    var re = /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 验证数字(正整数)
*/
function checkIntNum(str){
    var re = /^[0-9]*[1-9][0-9]*$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 验证非负整数
*/
function checkUnIntNum(str){
    var re = /^\d+$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 判断选取的日期是否小于当前日期
*/
function chkDate (pdate) {
	var d = new Date;
	var today = new Date(d.getFullYear (), d.getMonth (), d.getDate ());
	var reg = /\d+/g;
	var temp = pdate.match (reg);
	var foday = new Date (temp[0], parseInt (temp[1]) - 1, temp[2]);
	if (foday >= today){
		return false;
	}
	return true;
}

function showDateTime(str){
    var show_day=new Array('周日','周一','周二','周三','周四','周五','周六');
    var time=new Date(str.replace(/-/g,"/"));
    var year=time.getFullYear();
    var month = time.getMonth()+1;
    var date=time.getDate();
    var day=time.getDay();
    (month<10)&&(month='0'+month);
    (date<10)&&(date='0'+date);
    var now_time=year+'-'+month+'-'+date+' '+show_day[day];
    return now_time;
}

