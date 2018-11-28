$(function () {
    // 1、左边柱状图
    // 基于准备好的dom，初始化echarts实例
    var echarts_left = echarts.init(document.querySelector('.echarts_left'));

    // 指定图表的配置项和数据
    var option1 = {
        // 标题组件
        title: {
            // 是否显示标题组件false不显示，true显示
            // show:false,
            // 主标题文本
            text: '2018年注册人数',
            // 主标题文本超链接
            // link:'first.html',
            // 指定窗口打开主标题超链接【blank：新窗口打开，self：当前窗口打开】
            // target:'blank',
        },
        // 提示框组件，即使为空也是不可以删除的，不然鼠标触摸柱体不显示提示
        tooltip: {
            // 是否显示提示框组件false表示不显示，true表示显示
            // show:false,
            // 触发类型
            // trigger:'item',//[散点图，饼图等无类目轴的图表使用]
            // trigger:'axis',//[主要在柱状图，折线图等，有坐标轴的图表中使用]
            // trigger:'none'//[什么也不触发]
        },
        // 图例组件
        legend: {
            // 图例的数据数组
            data:[{
                // 图例项名称
                name:'销量',
                // 图例项icon【circle，rect，roundRect，triangle，diamond，pin，arroe，none等，也可以通过'image://url'设置为图片】
                // icon:'circle',
                // 图例文本样式
                // textStyle:{
                //     color:'red',
                // }
            }]
        },
        // 直角坐标系grid中的x轴
        xAxis: {
            data: ["6月","7月","8月","9月","10月","12月"],
            // x轴的位置【top上，bottom下】
            // position:'top',
            // x轴相对于默认位置的偏移
            // offset:0,
        },
        // 直角坐标系grid中的y轴
        yAxis: {
            // y轴的位置【left左，right右】
            // position:'left',
            // y轴相对于默认位置的偏移
            // offset:0,
        },
        // 系列列表
        series: [{
            //**
            name: '人数',//【与legend中的data对应】



            // 图表类型系列【line（折线），bar（柱形），pie（饼图），scatter（散点气泡），tree（树形），map（地图，区域数据可视化）】
            type: 'bar',
            // 系列中的数据内容数组。数组项通常为具体的数据项。
            data: [300,600, 900, 1200, 600, 900]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_left.setOption(option1);



    // 2、右边饼图
    // 基于准备好的dom，初始化echarts实例
    var echarts_right = echarts.init(document.querySelector('.echarts_right'));

    // 指定图表的配置项和数据【查询配置项表】
    var option = {
        // 标题组件title
        title : {
            // 主标题文本
            text: '热门品牌销售',
            // 副标题文本
            subtext: '2018年11月',
            // 水平居中
            x:'center'
        },
        // 提示框组件
        tooltip : {
            // 数据项图形触发
            trigger: 'item',
            // 字符串模板【饼图中：{a}（系列名称），{b}（数据项名称），{c}（数值），{d}（百分比）】
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 图例组件
        legend: {
            // 图例列表布局朝向
            orient: 'vertical',//纵轴
            left: 'left',//图例组件离容器左侧的距离。
            // 图例的数据数组
            data: ['耐克','阿迪','新百伦','李宁','阿迪王','乔丹']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'李宁'},
                    {value:1548, name:'阿迪王'},
                    {value:1000, name:'乔丹'}
                ],
                itemStyle: {
                    // 高亮状态的柱状图图形与标签样式。
                    emphasis: {
                        // 图形阴影的模糊大小
                        shadowBlur: 10,
                        // 阴影水平方向上的偏移距离。
                        shadowOffsetX: 0,
                        // 阴影颜色
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };  

    // 使用刚指定的配置项和数据显示图表。
    echarts_right.setOption(option);

     
})