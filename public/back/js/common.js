//进度条基本使用设置【插件NProgress】
//1、 NProgress.start();//开启进度条

//2、 NProgress.done();//关闭进度条

//3、 NProgress.set(0.4);//运行到40%
//4、 NPrpgress.inc();//每次增长一点点



// 需求：
// 第一次ajax请求，开启进度条
// 等待最后一个ajax请求完成，关闭进度条

// ajax全局事件
// .ajaxComplate()      每个ajax完成时调用（不管成功失败）
// .ajaxSuccess()       每个ajax请求成功是调用
// .ajaxError()         每个ajax失败时调用
// .ajaxSend()          每个ajax发送前调用

// 【注意】
// .ajaxStart()        在第一个ajax请求开始是调用
// .ajaxStop()         在所有ajax请求都完成时调用

$(document).ajaxStart( function () {
    // 开启进度条
    NProgress.start();
} );
$(document).ajaxStop( function () {
    // 关闭进度条
    NProgress.done();
} )




