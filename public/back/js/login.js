$(function(){
    /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
    // 使用bootstrapValidator插件进行表单校验
   $("#form").bootstrapValidator({
        // 设置小图标【小红X】
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//校验成功
            invalid: 'glyphicon glyphicon-remove',//校验失败
            validating: 'glyphicon glyphicon-refresh',//校验中
          },
        //   设置校验规则【给input设置name值】
        fields:{
            // 用户名
            username:{
                // 校验规则：【注意validators是加s的】
                validators:{
                    // 非空校验
                    notEmpty:{
                        message:"请输入用户名",
                    },
                    // 长度校验
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必须是2-6位"
                    },
                    callback:{
                        message:"用户名不存在",
                    }
                }
            },
            // 密码
            password:{
                // 校验规则：
                validators:{
                    // 非空校验
                    notEmpty:{
                        message:"请输入密码",
                    },            
                     // 长度校验
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码错误",
                    }
                }
            }
        }
    });
    /*
        * 2. 校验成功后, 会触发一个事件, 表单校验成功事件【success.form.bv】        *    默认是会提交表单的, 页面就跳转了,
        *    我们需要注册表单校验成功事件, 在成功事件中, 阻止默认的提交, 通过 ajax 提交   
    * */
    $('#form').on('success.form.bv',function(e){
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            // 表单序列化获取username与password
            data:$('#form').serialize(),

            success:function(info){
                // console.log(info);
                if(info.error === 1000){
                    // alert('用户名不存在');
                    /**
                     *更新当前input校验状态，更新成失败
                     *updateStatus
                     * 参数1：field 字段名称
                     * 参数2：status 状态
                     *      NOT_VALIDATED(未校验),VALIDATING(校验中),INVALID(校验失败),VALID(校验成功)
                     * 参数3：validator 配置校验规则【用来配置输出的提示信息】
                     */
                    $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    return;
                }
                if(info.error === 1001){
                    // alert('密码错误');
                    $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    return;
                }
                if(info.success){
                    // 登陆成功
                    location.href ='index.html';
                }
            }
        })
    });
    /*
  * 3. 重置功能, 本身重置按钮, 就可以重置内容, 需要额外的重置状态【[type="reset"]表示属性选择器】
  * */
  $('[type="reset"]').click(function() {
    // resetForm( boolean );
    // resetForm();   只重置状态
    // resetForm(true);  重置内容 和 状态
    $('#form').data("bootstrapValidator").resetForm();
  })
})