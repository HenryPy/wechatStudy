//引入时间模块
var util = require('../../utils/util')

Page({
    data: {
        interval: '',
        list: [],
        name: "",
        ww: "",
        alarm: "",
        f: "",
        j2: '123\n,456',
        j1: '',
        j5: '',
    },
    //封装刷新页面
    refersh() {
        // 刷新数据函数
        wx.cloud.database().collection('Alarm').get()
            .then(res => {
                console.log("请求成功", res.data)
                wx.stopPullDownRefresh()
                this.setData({
                    list: res.data
                })
            }).catch(res => {
                console.log('请求失败', res)
            })
    },

    //调用服务器mysql
    show_data: function () {
        var _this = this;
        wx.request({
            url: 'https://www.hxkz.site/show_data.php',
            data: {
                name: 'wangzhan',
                password: 'Aa123456',
                database: 'wangzhan',
            },
            // 请求的头文件
            header: {
                // 对数据进行JSON序列化
                // 'content-type': 'application/json'
                // 将数据转换成query string
                'content-type': 'x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'JSON',
            responseType: 'text',
            success: function (res) {
               
                console.log(res)
                let _data = res.data
                // var alarm='';
                // console.log('res.data:', _data)

                // 将从数据库读取的信息显示在前端
                _this.setData({
                    alarm: _data,
                    //  j5: j6 
                })
                // alarm = _data
                // console.log('alarm:', alarm)

                var str0 = _data;
                console.log(typeof (str0));
                console.log('str0:', str0)

                var a = str0.split("id");
               
                var mycars0 = new Array();
                var f1 = ''

                for (var i = 1; i < a.length; i++) {
                    // 确定每个截取位置
                    var ipos = a[i].indexOf("id");
                    var ipos0 = a[i].indexOf("报警时间");
                    var ipos1 = a[i].indexOf("报警项");
                    var ipos2 = a[i].indexOf("报警内容");
                    // 确定每段截取起始点
                    var str1 = a[i].substring(0, ipos);
                    var str2 = a[i].substring(ipos, ipos0);
                    var str3 = a[i].substring(ipos0, ipos1);
                    var str4 = a[i].substring(ipos1, ipos2);
                    var str5 = a[i].substring(ipos2, a[i].length);
                    // console.log('str1:', String(str1));

                    // console.log(str1);
                    // 每项内容
                    var b = str2.split(" ");
                    var c = str3.substring(5, 30);
                    var d = str4.split(" ");
                    var e = str5.split(" ");
                    var g = "\\n";
                    // 每条完整信息
                    var f = (b[1] + "  " + c + "  " + e[1] + g);
                    // 打印f
                    // console.log('f:', String(f));
                    f1 = f1 + f
                    // console.log(f1)                  
                }
                    var j6 = f1.replace(/\\n/g, '\n')
                    console.log(j6)
                    _this.setData({                        
                        j5:j6 
                    })
             }, 
        })

        wx.showLoading({
            title: 'inserting',
        })
        setTimeout(function () {
            wx.hideLoading()
            wx.showToast({
                title: 'success',
            })
        }, 500)   

    },

    // message: function () {
    //     var str = "id: 5 报警时间: 2021-12-22 14:14:19 报警项: 23125 报警内容: 1#插拔氣缸前報警 id: 6 报警时间: 2021-12-22 14:14:25 报警项: 231250 报警内容: 1#插拔氣缸前報警解除 ";
    //     // console.log(typeof (str));
    //     // console.log('str:', str)

    //     var a = str.split("id");
    //     for (var i = 0; i < a.length; i++) {
    //         console.log(a[i])
    //     }
    //     var mycars0 = new Array();
    //     var f1 = ''

    //     for (var i = 1; i < a.length; i++) {
    //         // 确定每个截取位置
    //         var ipos = a[i].indexOf("id");
    //         var ipos0 = a[i].indexOf("报警时间");
    //         var ipos1 = a[i].indexOf("报警项");
    //         var ipos2 = a[i].indexOf("报警内容");
    //         // 确定每段截取起始点
    //         var str1 = a[i].substring(0, ipos);
    //         var str2 = a[i].substring(ipos, ipos0);
    //         var str3 = a[i].substring(ipos0, ipos1);
    //         var str4 = a[i].substring(ipos1, ipos2);
    //         var str5 = a[i].substring(ipos2, a[i].length);
    //         // console.log('str1:', String(str1));

    //         // console.log(str1);
    //         // 每项内容
    //         var b = str2.split(" ");
    //         var c = str3.substring(5, 30);
    //         var d = str4.split(" ");
    //         var e = str5.split(" ");
    //         var g = "\\n";
    //         // 每条完整信息
    //         var f = (b[1] + "  " + c + "  " + e[1] + g);
    //         // 打印f
    //         // console.log('f:', String(f));
    //         f1 = f1 + f
    //         // console.log(f1)
    //         // 添加数组
    //         mycars0.push(f)

    //         var j6 = f1.replace(/\\n/g, '\n')
    //         var mycars = mycars0.join()
    //         let { j2 } = this.data
    //         let j3 = j2.replace(/\\n/g, '\n')

    //         this.setData({
    //             j5:j6 
    //         })
    //     }
    // },

    onLoad: function (options) {
        //选择本地文件
        // this.chooseExcel()
        //调用数据库信息
        // this.ondisplay()
        //调用自动刷新功能 
        // this.refersh()
        // 引入手机时间
        var time = util.formatTime(new Date())
        this.setData({
            time: time
        });
    },

    onReady: function () {
    },

    onShow: function () {
        let that = this;
        //自动调用刷新页面功能
        this.data.interval = setInterval(function () {
            that.refersh()
        }, 200000)//200秒
        this.setData({
            interval: this.data.interval
        })
    },

    onHide: function () {
        //退出页面时不再调用数据
        clearInterval(this.data.interval)
    },

    onUnload: function () {
        //退出页面时不再调用数据 
        clearInterval(this.data.interval)
    },

    onPullDownRefresh: function () {
        //页面下拉时调用刷新方法
        this.refersh()
    },

})
