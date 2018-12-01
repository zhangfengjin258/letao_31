$(function () {
    var currentPage = 1;//当前页
    var pageSize = 5;//每页数据条数
// 1、进入页面第一步，发送ajax请求渲染页面
    render();
    function render () {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function ( info ) {
                // console.log( info );
                var htmlStr = template('secondTmp', info );
                $('tbody').html( htmlStr );
                // 分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil( info.total / info.size),
                    onPageClicked: function (a,b,c,page) {
                        // console.log( page );
                        currentPage = page;
                        // 重新渲染页面
                        render();
                    }
                })
            }
        });
    }
    // 2、点击添加按钮，显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');
        // 发送请求获取一级分类
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType: "json",
            success: function ( info ) {
                // console.log( info );
                var htmlStr = template('dropDownTmp', info );
                $('.dropdown-menu').html( htmlStr );
            }
        })
    });

    // 3、给下拉列表 a 注册点击事件（事件委托）
    $('.dropdown-menu').on('click','a',function () {
    //     // 获取文本值
        var txt = $(this).text();
    //     // console.log(txt);
    //     // 设置给按钮[不能直接设置给dropDownMenu1，会覆盖后面的小箭头]
        $('#dropdownText').text( txt );
    //     // // 获取id
        var id = $(this).data('id');
        // console.log(id);
        
        // 设置给隐藏域
        $('[name="categoryId"]').val(id);

        // 调用updateStatus更新，隐藏域校验状态
        $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
    })


    // 4、配置上传文件插件，让插件发送一部文件上传请求
    $('#fileupload').fileupload({
        dataType:'json',
        // 此处的e为事件对象，不能删除
        done:function(e,data) {
            // console.log(data);
            // data.result后台返回对象
            var picObj = data.result;
            // console.log(picObj);
            
            // 获取图片地址，设置给img
            var picUrl = picObj.picAddr;
            // console.log(picUrl);

            $('#imgBox img').attr('src',picUrl);

            // 给隐藏域设置图片地址
            $('[name="brandLogo"]').val(picUrl);
            // 调用updateStatus更新隐藏域校验状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    })
    $('#form').bootstrapValidator({
        // 重置排除项, 都校验, 不排除
        excluded: [],
    
        // 配置校验图标
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',    // 校验成功
          invalid: 'glyphicon glyphicon-remove',   // 校验失败
          validating: 'glyphicon glyphicon-refresh'  // 校验中
        },
    
        // 指定校验字段
        fields: {
          categoryId: {
            validators: {
              notEmpty: {
                message: "请选择一级分类"
              }
            }
          },
          brandName: {
            validators: {
              notEmpty: {
                message: "请输入二级分类名称"
              }
            }
          },
          brandLogo: {
            validators: {
              notEmpty: {
                message: "请上传图片"
              }
            }
          }
        }
      })
    //   6、注册表单校验成功事件，阻止默认表单提交，通过ajax提交
    $('#form').on('success.form.bv',function( e ) {
        // 阻止表单自动提交
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function ( info ) {
                // console.log( info );
                // 关闭模态框
               if( info.success ) {
                $('#addModal').modal('hide');
                currentPage = 1;
                render();

                // 重置表单内容与状态
                $('#form').data('bootstrapValidator').resetForm(true);
                // 由于下拉菜单与图片不是表单元素，需要手动重置
                $('#dropdownText').text('请选择一级分类');
                $('#imgBox img').attr('src',"./images/default.png");
               }
            }
        });
    })
})