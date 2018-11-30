$(function () {
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render () {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: "json",
            success: function ( info ) {
                // console.log( info );
                var htmlStr = template('firstTmp',info);
                // console.log(htmlStr);
                $('#categoryName').html( htmlStr );


                // 分页
                $('#paginator').bootstrapPaginator({
                    // 指定版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil( info.total / info.size ),
                    // 给页码添加点击事件
                    onPageClicked: function( a, b, c, page ) {
                        // console.log( page );
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        });   
    }
    // 2、点击添加按钮，显示模态框。
    $('#addBtn').click(function () {
        $('#addModal').modal('show'); 
    })

    // 3、进行表单校验
    $('#form').bootstrapValidator({
       // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',   // 校验失败
            validating: 'glyphicon glyphicon-refresh'  // 校验中
        }, 
        fields: {
            //校验用户名，对应input表单的name属性
            categoryName: {
              validators: {
                //不能为空
                notEmpty: {
                  message: '请输入一级分类名',
                },
              }
            }
        }
    })
    // 4、注册表单校验事件，阻止默认提交，通过ajax提交
    $('#form').on('success.form.bv',function ( e ) {
        // console.log( e );
        e.preventDefault();//阻止默认提交
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function ( info ) {
                // console.log(info);
                // 关闭模态框
                if ( info.success ){
                    $('#addModal').modal('hide');
                    // 重新渲染页面
                    currentPage = 1;
                    render();
                    // 重置表单内容与状态（校验状态）
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        });
    })
})