$(function() {
  // 1、进页面第一步，发送ajax请求渲染数据
  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        var htmlStr = template("productTmp", info);
        $("tbody").html(htmlStr);
        // 分页设置
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          // size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function(event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            //   console.log(page);
            currentPage = page;
            // 重新渲染页面
            render();
          }
        });
      }
    });
  }

  // 【此处未给上架切换的接口】

  // // 2、给table中的按钮注册事件（事件委托）
  // $('tbody').on('click','.btn',function() {
  //     // 点击按钮显示模态框
  //     $('#productUpModal').modal('show');
  //     // 获取当前数据id
  //     var currentId = $(this).parent().data(id);
  // })

  // 2、添加商品
  // 点击添加按钮，显示模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
    // 发送ajax请求，获取所有二级分类列表
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        var htmlStr = template("secondTmp", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  // 3、给下拉列表的a注册点击事件（事件委托）
  $(".dropdown-menu").on("click", "a", function() {
    // 获取文本
    var txt = $(this).text();
    // 设置文本
    $("#dropdownText").text(txt);
    // 获取id赋值给隐藏域
    var id = $(this).data("id");
    // console.log(id);
    $('[name="brandId"]').val(id);

    // 表单校验
    $("#form")
      .data("bootstrapValidator")
      .updateStatus("brandId", "VALID");
  });

  // 4、设置文件上传插件
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function(e, data) {
      //   console.log(data);
      var picObj = data.result;
      // 全局声明picArr用于存放图片地址
      picArr.unshift(picObj);
      var picUrl = picObj.picAddr;
      $("#imgBox").prepend('<img src="' + picUrl + '" style="width:100px;">');
      // console.log(picArr.length);

      if (picArr.length > 3) {
        // 删除数组最后一项
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }
    //   如果文件上传满三张。当前picStatus校验状态更新VALID
    if(picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
    }
    }
  });

  // 5、添加表单校验
  //使用表单校验插件
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },

    //3. 指定校验字段
    fields: {
      //校验用户名，对应input表单的name属性
      // proName	是	产品名称
      // oldPrice	是	老价格
      // price	是	价格
      // proDesc	是	产品描述
      // size	是	产品尺寸
      // statu	否	产品上下架, 默认上架(1)
      // num
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品商品描述"
          }
        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          // \d  0-9
          // ?   0次或1次
          // +   1次或多次
          // *   0次或多次
          // {n,m}  出现n次到m次
          // {n}  出现n次
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: "商品库存格式, 必须是非零开头的数字"
          }
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "尺码格式xx-xx【xx为两位数】"
          }
        }
      },
      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          //不能为空
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });


//   6、注册表单校验成功事件，阻止默认提交，通过ajax提交数据   
$('#form').on('success.form.bv',function( e ) {
    // 阻止默认表单提交
    e.preventDefault();

    // 表单中所有数据
    var paramsStr = $('#form').serialize();
    // 拼接图片地址
    paramsStr += "&picName1="+picArr[0].picName+"&picArr1="+picArr[0].picAddr;
    paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;
    $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: paramsStr,
        dataType: "json",
        success: function (info) {
            // console.log(info);
            if( info.success ){
                // 关闭模态框
                $('#addModal').modal('hide');
                currentPage = 1;
                render();
                // 重置内容和状态
                $('#form').data('bootstrapValidator').resetForm(true);
                // 手动重置二级列表与图片
                $('#dropdownText').text('请输入二级分类');
                $('#imgBox img').remove();
                picArr = [];
            }
            
        }
    });
})
});
