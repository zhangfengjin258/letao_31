$(function() {
  var currentPage = 1; //当前页
  var pageSize = 5; //每页数据条数
  var currentId;//当前用户id
  var isDelete;//修改状态
  // 1、一进页面，发送ajax请求，请求列表数据，进行渲染（通过模板引擎）
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        //tmplate(模板id，数据对象)，在模板可以任意使用传进去对象中的所有属性
        var htmlStr = template("userTmp", info);
        $("tbody").html(htmlStr);

        // 在ajax请求回来之后，根据最新数据，进行初始化分页插件

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          // size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function(event, originalEvent, type, page) {
            // console.log(page);
            //为按钮绑定点击事件 page:当前点击的按钮值
            //   更新当前页
            currentPage = page;
            //   重新渲染页面
            render();
          }
        });
      }
    });
  }

//   2、给列表中所有按钮注册事件（采用事件委托，因为都是动态生成的）
// 事件委托好处：
    // 可以给动态生成元素绑定事件
    // 可以批量注册事件，性能效率高
    $('tbody').on('click','.btn', function () {
        // (1)显示模态框
        $('#userModal').modal('show');
        // 获取用户id
        currentId = $(this).parent().data('id');
        // console.log(currentId);
        // 根据按钮类名，决定用户成什么状态[1正常，0禁用]
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    });
    // 模态框确认按钮被点击, 应该发送ajax, 进行修改用户状态
    $('#confirmBtn').click(function () {
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: currentId,
                isDelete:isDelete,
            },
            dataType: "json",
            success: function ( info ) {
                // console.log(info)
                if (info.success) {
                    // 关闭模态框
                    $('#userModal').modal('hide');
                    // 重新渲染页面
                    render();
                }
            }
        });
    })


});
