/**
 * Created by Administrator on 2016/8/4 0004.
 */

//csrf rel
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


//清除错误提示
function clearError(){
    $("#error").text("");
}
//csrf rel end
//回收脚本
function createRecycle(){
    var exp = $.trim( $('input[name="exp"]').val() );
    var gamegold =  $.trim( $('input[name="gamegold"]').val() );
    var customize = $.trim( $('input[name="customize"]').val() );
    var gear = $.trim($('textarea[name="gear"]').val() );
    //输入检测
    if ( exp != "" && ! $.isNumeric(exp) || gamegold != "" && ! $.isNumeric(gamegold)) {
        var msg_info = "回收脚本中回收经验和元宝数只受设置为数字"
        return errorMsg(msg_info);
    }else if(exp =="" && gamegold == "" && customize == "") {
        var msg_info = "回收脚本中回收经验,元宝数,自定义回收必须指定一个参数";
        return errorMsg(msg_info);
    }else if (gear == ""){
        var msg_info = ("需要左栏输入装备名称,每行输入一件装备名称.推荐用万游设置器导出装备名字列表");
        return errorMsg(msg_info);
    }else {
        if ( $("#error_msg").hasClass("alert-danger") ){
            infoMsg();
        }
    }//end$("#error_msg").hasClass("alert-danger") )

    //把装备名字转换为数组
    var gear_arr = gear.split('\n');
    var code = "[@回收装备]\r\n";
    var exp_str = "";
    var gold_str = "";
    var custom_str = "";
    var hsmsg = "sendmsg 5 恭喜你";

    if ( exp != ""){
        exp_str = "changeExp + " + exp + "\r\n"
        hsmsg += "获得" + exp + "点经验,"
    }

    if ( gamegold != ""){
        gold_str = "gamegold + " + gamegold + "\r\n"
        hsmsg += "获得" + gamegold + "个元宝,"
    }
    if ( customize != ""){
        custom_str = customize + "\r\n"
    }

    //循环拼接脚本
    $.each(gear_arr, function(i, zb){
        code += "#IF\r\n" +
                "checkitem " + zb + " 1\r\n" +
                "#ACT\r\n" +
                "take " + zb + " 1\r\n" +
                exp_str +
                gold_str +
                custom_str +
                hsmsg + ".回收[" + zb + "]成功!!\r\n" +
                "\r\n"

    })//end each
    code += "#ELSEACT\r\n" +
        "sendmsg 6 没有可以的回收的装备了\r\nbreak\r\n"
    $("#code").val(code);
}//回收脚本end

//传送员脚本
function createMove(){
    var m2 = $("#move_m2_type option:selected").val()
    var level = $.trim( $('input[name="level"]').val() );
    var needgold =  $.trim( $('input[name="needgold"]').val() );
    var mapinfo = $.trim( $('input[name="mapinfo"]').val() );

    // /输入检测
    if ( level != "" && ! $.isNumeric(level) || needgold != "" && ! $.isNumeric(needgold)){
        var msg_info = "传送员脚本,限制等级和需要元宝数只接受数字";
        return errorMsg(msg_info);
    }else if (mapinfo == ""){
        var msg_info = "传送员脚本,需要给地图编号";
        return errorMsg(msg_info);
    }else {
        if ( $("#error_msg").hasClass("alert-danger") ){
            infoMsg();
        }
    }

    if (m2 == "1"){
        heroMove(level, needgold, mapinfo);
    }else if (m2 == "2") {
        legMove(level, needgold, mapinfo);
    } else if(m2 == "3") {
        hgeMove(level, needgold, mapinfo);
    }else {
        gomMove(level, needgold, mapinfo);
    }


}//end传送员脚本

//HERO引擎传送员脚本
function heroMove(level, needgold, mapinfo){
    var level_msg = "checklevelex > 0";
    var gold_msg = "checkgamegold > 0";
    var decgold = "gamegold - 0";

    if (level != ""){
        level_msg = "checklevelex > " + level;
    }else {
        level = 0;
    }

    if (needgold != ""){
        var tmp =  parseInt(needgold) - 1
        gold_msg = "checkgamegold > " + tmp;
        decgold = "gamegold - " + needgold;
    }else {
        needgold = 0;
    }
    var code_arry = [ "[@main]",
        "<★/SCOLOR=249><XX地图/SCOLOR=254><★/SCOLOR=249> <为后期提供打高级装备!/SCOLOR=125><击杀BOSS爆元宝/SCOLOR=249>\\",
        "<━━━━━━━━━━━━━━━━━━━━━━━━━━━━/SCOLOR=155>\\ \\",
        "〖<怪物爆率/SCOLOR=253>〗：<高级武器、首饰，元宝，特殊材料等！/SCOLOR=254>\\" ,
        "〖<主要怪物/SCOLOR=250>〗：<本F各大禁区以及顶级BOSS等！！/SCOLOR=70>\\",
        "〖<进入条件/SCOLOR=249>〗：<需要"+ level+"级以上,花费"+needgold+"元宝进入！/SCOLOR=168>\\",
        "〖<是否进入/SCOLOR=158>〗：<元宝进入/@元宝进入>\\ \\",
        "<━━━━━━━━━━━━━━━━━━━━━━━━━━━━/SCOLOR=155>\\",
        "",
        "[@元宝进入]",
        "#IF",
        level_msg,
        gold_msg,
        "#ACT",
        decgold,
        "map " + mapinfo,
        "give 回城卷 1",
        "GuildNoticeMsg 56 0  土豪『%s』花"+needgold+"元宝进入了!→〖BOSS地图〗，看来是生死看淡，追寻帝路，寻找仙器去了！！",
        "#ELSEACT",
        "messagebox 看看自己等级或元宝数是否满足条件进入！！",
        "break",
    ];

$("#code").val(code_arry.join("\r\n"));
}//end heroMove


//LEG引擎传送员脚本
function legMove(level, needgold, mapinfo){
    var level_msg = "checklevelex > 0";
    var gold_msg = "checkgamegold > 0";
    var decgold = "gamegold - 0";

    if (level != ""){
        level_msg = "checklevelex > " + level;
    }else {
        level = 0;
    }

    if (needgold != ""){
        var tmp =  parseInt(needgold) - 1
        gold_msg = "checkgamegold > " + tmp;
        decgold = "gamegold - " + needgold;
    }else {
        needgold = 0;
    }
    var code_arry = [ "[@main]",
        "<$USERNAME>，对于里面的情形我真的是一点都不知道，曾目睹\\",
        "无数生怀绝技的武林高手进去都是有去无回,我劝你还是走吧，那里\\",
        "的妖魔太变态啦，杀人从不出第二招，一招足以令你丧命,而且那里\\",
        "一年到头从不见阳光,伸手不见五指，如果你真的要去的话考虑清楚...\\",
        "<COLOR=clLime 挑战难度：><COLOR=clFuchsia ★★★★★★>      <COLOR=clLime 爆率指数：><COLOR=clFuchsia ★★★★★>\\",
        "<COLOR=clLime 怪物爆率：><COLOR=clAqua 元宝,高级首饰武器及三职业套装等>\\",
        "<COLOR=clLime 进入条件：><COLOR=clAqua 需要"+level+"级,"+needgold+"元宝>\\",
        "<赶快送我前往，老子什么场面没见过，你以为我吓大的呀！/@进入>\\",
        "",
        "[@进入]",
        "#IF",
        level_msg,
        gold_msg,
        "#ACT",
        decgold,
        "map " + mapinfo,
        "give 回城卷 1",
        "sendmsg 0  恭喜勇士『%s』花"+needgold+"元宝进入了BOSS地图,去寻找遗失的宝藏！ 245 0！！",
        "#ELSEACT",
        "messagebox 尊敬的玩家你的条件不满足,请不要耍我哦!！！",
        "break",
    ];

$("#code").val(code_arry.join("\r\n"));
}//end heroMove

//hge引擎
function hgeMove(level, needgold, mapinfo){
    var level_msg = "checklevelex > 0";
    var gold_msg = "checkgamegold > 0";
    var decgold = "gamegold - 0";

    if (level != ""){
        level_msg = "checklevelex > " + level;
    }else {
        level = 0;
    }

    if (needgold != ""){
        var tmp =  parseInt(needgold) - 1
        gold_msg = "checkgamegold > " + tmp;
        decgold = "gamegold - " + needgold;
    }else {
        needgold = 0;
    }
    var code_arry = [ "[@main]",
        "你能找我，看来我们的缘分不浅。也许我可以带你进入真武山庄　\\",
        "本地图可是爆本服终极装备哦！\\",
        "<此地图爆;圣牛。剑甲。皓月.BOSS爆巅峰之灵！！适合道道。法法！/FCOLOR=249> \\",
        "一年到头从不见阳光,伸手不见五指，如果你真的要去的话考虑清楚...\\",
        "<挑战难度:/FCOLOR=222><★★★★★★★/FCOLOR=244>      <爆率指数/FCOLOR=222>:<★★★★★★★/FCOLOR=244>　\\",
        "<主要怪物:/FCOLOR=222><★★★★★★★/FCOLOR=244>      <爆率指数/FCOLOR=222>:<★★★★★★★/FCOLOR=244>　\\",
        "<需要等级:/FCOLOR=222><"+level+"级/FCOLOR=244>                  <需要元宝/FCOLOR=222>:<"+needgold+"元宝/FCOLOR=244>\\　\\",
        "<进入/@进入>  <进入/@进入>    <进入/@进入>                   <算了，我闪。/@exit>\\",
        "",
        "[@进入]",
        "#IF",
        level_msg,
        gold_msg,
        "#ACT",
        decgold,
        "map " + mapinfo,
        "give 回城卷 1",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "#ELSESAY",
        "你元宝数量不足!!!!!!!！",
    ];

    $("#code").val(code_arry.join("\r\n"));
}//end hgeMove

//GOM引擎
function gomMove(level, needgold, mapinfo){
    var level_msg = "checklevelex > 0";
    var gold_msg = "checkgamegold > 0";
    var decgold = "gamegold - 0";

    if (level != ""){
        level_msg = "checklevelex > " + level;
    }else {
        level = 0;
    }

    if (needgold != ""){
        var tmp =  parseInt(needgold) - 1
        gold_msg = "checkgamegold > " + tmp;
        decgold = "gamegold - " + needgold;
    }else {
        needgold = 0;
    }
    var code_arry = [ "[@main]",
        "你能找我，看来我们的缘分不浅。也许我可以带你进入真武山庄　\\",
        "本地图可是爆本服终极装备哦！\\",
        "<此地图爆;圣牛。剑甲。皓月.BOSS爆巅峰之灵！！适合道道。法法！/FCOLOR=249> \\",
        "一年到头从不见阳光,伸手不见五指，如果你真的要去的话考虑清楚...\\",
        "<挑战难度:/FCOLOR=222><★★★★★★★/FCOLOR=244>      <爆率指数/FCOLOR=222>:<★★★★★★★/FCOLOR=244>　\\",
        "<主要怪物:/FCOLOR=222><★★★★★★★/FCOLOR=244>      <爆率指数/FCOLOR=222>:<★★★★★★★/FCOLOR=244>　\\",
        "<需要等级:/FCOLOR=222><"+level+"/FCOLOR=244>                  <需要元宝/FCOLOR=222>:<"+needgold+"元宝/FCOLOR=244>\\　\\",
        "<进入/@进入>  <进入/@进入>    <进入/@进入>                   <算了，我闪。/@exit>\\",
        "",
        "[@进入]",
        "#IF",
        level_msg,
        gold_msg,
        "#ACT",
        decgold,
        "map " + mapinfo,
        "give 回城卷 1",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "SENDMSG 0 玩家[%s].从土成点击NPC进入真武山庄,本地图可会暴终极装备哦 ！！！",
        "#ELSESAY",
        "你元宝数量不足!!!!!!!！",
    ];

    $("#code").val(code_arry.join("\r\n"));
}

//生成爆率
function monDrop(){
    var m2 = $("#move_m2_type option:selected").val()
    var prop = $.trim( $('input[name="proportion"]').val() );
    var gear = $.trim($('textarea[name="gear"]').val() );

    // /输入检测
    if ( prop == "" ) {
        var msg_info = "生成爆率需要给物品爆出机率";
        return errorMsg(msg_info);
    }
    else if (gear == ""){
        var msg_info = "生成爆率需要左栏输入装备名称,每行一件装备名称.推荐用万游设置器导出装备名字列表";
        return errorMsg(msg_info);
    }else {
        if ( $("#error_msg").hasClass("alert-danger") ){
             $("#error_msg").removeClass("alert-danger");
             $("#error_msg").addClass("alert-success");
            infoMsg();
        }//end$("#error_msg").hasClass("alert-danger") )
    }
    //把装备名字转换为数组
    var item_str = ''
    var gear_arr = gear.split('\n');
    $.each(gear_arr, function(i, zb){
        item_str += prop + "  " + zb + "\r\n";
    });

    $("#code").val(item_str);
}

//有错误,警告框
function errorMsg(msg_info){
    $("#error_msg").removeClass("alert-success");
    $("#error_msg").addClass("alert-danger");

     $("#error_title").text("错误:");
     $("#error").text(msg_info);
    return false;
}

//恢复提示框
function infoMsg(){
    $("#error_msg").removeClass("alert-danger");
    $("#error_msg").addClass("alert-success");
    $("#error_title").text("提示:")
    $("#error").text("参数设置正确,复制你需要的代码吧!!");
}

//复制按钮
var clip = new ZeroClipboard( document.getElementById("code_cp_btn") );


//复制之后触发
ZeroClipboard.on("aftercopy", function(e) {
    if ($("#error_msg").hasClass("alert-danger")){
            $("#error_msg").removeClass("alert-danger");
            $("#error_msg").addClass("alert-success");
    }

    $("#error_title").text("提示:");
    $("#error").text("大功告成!已经帮你复制到剪贴板上!!");
});

