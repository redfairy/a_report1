define(["app", "js/service.http", "hbs!module/index/pageContent", "hbs!module/index/menuContent",
        "hbs!module/index/trafficContent",
        "hbs!module/index/dataflowContent",
        "hbs!module/index/usersContent",
        "hbs!module/index/cmnetContent",
        "hbs!module/index/smsContent",
        "hbs!module/index/interContent",
        "hbs!module/index/utilizationContent",
        "hbs!module/index/capacityContent",
        "hbs!module/index/faultContent",
        "hbs!module/index/qualityContent",
        "hbs!module/index/volteContent",
        "hbs!module/index/remarksContent"],
    function (app, service, template, menuTemplate, template1, template2, template3, template4, template5, template6, template7, template8, template9, template10, template11, template12) {

        var $ = Dom7;
        var _page;

        var _pageIndex = 0;
        var stopSwitch = true;

        var mySwiperv;

        var _kpi_time;

        function init(page) {
            _page = page;
            _kpi_time = app.moment().subtract(1, 'day').format("YYYY-MM-DD");
            var user = GetQueryString("user");
            if ((user == null) /*|| ((navigator.userAgent.toLocaleLowerCase( )).indexOf("micromessenger")==-1)*/) {
                app.f7.alert("请从微信登录！");
            } else {
                $(page.container).html(template());
                $("#user_id").html(user);
                service.queryUserReport(user, function (data) {
                    var subscription = data.subscription;
                    var reports = subscription[22];
                    for (var key in reports) {
                        if (key == 1) {
                            initTraffic();
                        } else if (key == 2) {
                            initDataFlow();
                        } else if (key == 3) {
                            initUsers();//用户数
                        } else if (key == 4) {
                            initCmnet();//CMNET
                        } else if (key == 5) {
                            initSms();//短彩信业务量
                        } else if (key == 6) {
                            initInter();//互联互通
                        } else if (key == 7) {
                            initUtilization();//网络利用率
                        } else if (key == 8) {
                            initCapacity();//网络能力
                        } else if (key == 9) {
                            initFault();//网络故障
                        } else if (key == 10) {
                            initQuality();//网络质量
                        } else if (key == 11) {
                            initVolte();//VOLTE专题
                        }
                    }

                    initRemarks();

                    preload();

                 //   initData1();

                });
            }


            $(document).trigger('renderComplete', {page: _page});
            addEventHandler();
        }

        //话务量
        function initTraffic() {
            $(".menu-list").append(menuTemplate({fa: 'fa-volume-control-phone', name: '话务量'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide traffic"></div>');
            $(".traffic").html(template1());//话务量

            //话务量
            var mySwiperh_users = app.f7.swiper('.swiper-init-traffic', {
                pagination: '.swiper-pagination-traffic',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }


        <!--数据流量-->
        function initDataFlow() {
            $(".menu-list").append(menuTemplate({fa: 'fa-bullseye', name: '数据流量'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide dataflow"></div>');
            $(".dataflow").html(template2());//数据流量


            //数据流量
            var mySwiperh_dataflow = app.f7.swiper('.swiper-init-dataflow', {
                pagination: '.swiper-pagination-dataflow',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });

            // 打开 地市流量柱图
            $(".btn_rank").click(function () {
                service.kpiRegionChart(2, 16, "DAY", "2016-06-14", function (res) {
                    var state = res.result;
                    if (state == 'true') {
                        var time = res.time;
                        var data = res.data;
                        for (var i = 0; i < data.length; i++) {
                            var d = data[i];
                            var title = d.title;
                            var min = d.min;
                            var max = d.max;
                            var values = d.values;
                            var xLabels = d.xLabels
                            var yTitle = d.yTitle
                            var xTitle = d.xTitle;
                            var charttype = d.charttype
                            if (charttype == "barchart") {
                                var props = d.props;
                                if (min = -1) {
                                    min = 0
                                }
                                var _max = 0;
                                var data = values.split(",");
                                for (var j = 0; j < data.length; j++) {
                                    var v = data[j];
                                    if (parseInt(v) > parseInt(_max)) {
                                        _max = v;
                                    }
                                }
                                _max = _max * 111 / 100;
                                if (max < _max) {
                                    max = _max;
                                }

                                if (max == 0) {
                                    max = max + 0.5;
                                }

                                var categories = new Array();
                                var x_labels = xLabels.split(",");
                                for (var k = 0; k < x_labels.length; k++) {
                                    var x = x_labels[k];
                                    categories.push(x.replace(/分公司/g, ""));
                                }

                                values = "[" + values + "]";
                                darwDataflowChart(title, categories, eval(values), min, max);
                                break;
                            } else {

                            }

                        }
                    }
                });

            });

            $("#data-flow-btn-lte-more").click(function () {
                app.router.open('dataflowlte', {});
            });

        }

        //用户数
        function initUsers() {
            $(".menu-list").append(menuTemplate({fa: 'fa-user', name: '用户数'}));

            $(".swiper-wrapper-v").append(' <div class="swiper-slide users"></div>');
            $(".users").html(template3());//用户数

            //用户数
            var mySwiperh_users = app.f7.swiper('.swiper-init-users', {
                pagination: '.swiper-pagination-users',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //CMNET
        function initCmnet() {
            $(".menu-list").append(menuTemplate({fa: 'fa-compass', name: 'CMNET'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide cmnet"></div>');
            $(".cmnet").html(template4());//CMNET

            //cmnet
            var mySwiperh_cmnet = app.f7.swiper('.swiper-init-cmnet', {
                pagination: '.swiper-pagination-cmnet',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //短彩信业务量
        function initSms() {
            $(".menu-list").append(menuTemplate({fa: 'fa-envelope-square', name: '短彩信业务量'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide sms"></div>');
            $(".sms").html(template5());//短彩信业务量

            //sms
            var mySwiperh_sms = app.f7.swiper('.swiper-init-sms', {
                pagination: '.swiper-pagination-sms',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //互联互通
        function initInter() {
            $(".menu-list").append(menuTemplate({fa: 'fa-sitemap', name: '互联互通'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide inter"></div>');
            $(".inter").html(template6());//互联互通

            //inter
            var mySwiperh_inter = app.f7.swiper('.swiper-init-inter', {
                pagination: '.swiper-pagination-inter',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //网络利用率
        function initUtilization() {
            $(".menu-list").append(menuTemplate({fa: 'fa-pie-chart', name: '网络利用率'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide utilization"></div>');
            $(".utilization").html(template7());//网络利用率

            //utilization
            var mySwiperh_utilization = app.f7.swiper('.swiper-init-utilization', {
                pagination: '.swiper-pagination-utilization',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //网络能力
        function initCapacity() {
            $(".menu-list").append(menuTemplate({fa: 'fa-cubes', name: '网络能力'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide capacity"></div>');
            $(".capacity").html(template8());//网络能力
            //capacity
            var mySwiperh_capacity = app.f7.swiper('.swiper-init-capacity', {
                pagination: '.swiper-pagination-capacity',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //网络故障
        function initFault() {
            $(".menu-list").append(menuTemplate({fa: 'fa-wrench', name: '网络故障'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide fault"></div>');
            $(".fault").html(template9());//网络故障

            //fault
            var mySwiperh_fault = app.f7.swiper('.swiper-init-fault', {
                pagination: '.swiper-pagination-fault',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });

            $(".fault_item").click(function () {
                app.router.open('fault', {});
            });
        }

        //网络质量
        function initQuality() {
            $(".menu-list").append(menuTemplate({fa: 'fa-globe', name: '网络质量'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide quality"></div>');
            $(".quality").html(template10());//网络质量

            //quality
            var mySwiperh_quality = app.f7.swiper('.swiper-init-quality', {
                pagination: '.swiper-pagination-quality',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //VOLTE专题
        function initVolte() {
            $(".menu-list").append(menuTemplate({fa: 'fa-clipboard', name: 'VOLTE专题'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide volte"></div>');
            $(".volte").html(template11());//VOLTE专题

            //volte
            var mySwiperh_volte = app.f7.swiper('.swiper-init-volte', {
                pagination: '.swiper-pagination-volte',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });
        }

        //备注
        function initRemarks() {
            $(".menu-list").append(menuTemplate({fa: 'fa-clipboard', name: '备注'}));
            $(".swiper-wrapper-v").append('<div class="swiper-slide remarks"></div>');
            $(".remarks").html(template12());//备注

            //remarks
            var mySwiperh_remarks = app.f7.swiper('.swiper-init-remarks', {
                pagination: '.swiper-pagination-remarks',
                spaceBetween: 50,
                direction: 'horizontal',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true
            });

        }


        function preload() {
            var m = document.location.href.toLowerCase().match(/#p(\d+)$/);
            if (m != null)pageIndex = m[1] - 1;

            $(".report-time").val(_kpi_time);
            $(".report-time").on('change', changeTime);

            $(".swiper-init-v .swiper-container, .swiper-init-v .swiper-slide").height($(window).height());
            var selector;
            if (_pageIndex > 0 && _pageIndex < $(".menu-list>li").length) {
                selector = $(".swiper-init-v>.swiper-slide").eq(_pageIndex);
            }

            mySwiperv = app.f7.swiper('.swiper-init-v', {
                pagination: '.swiper-pagination-v',
                direction: 'vertical',
                paginationType: 'progress',
                preloadImages: false,
                lazyLoading: true,
                onSlideChangeStart: function (swiper) {
                    console.log(' sliddeChange...' + swiper.slideActiveClass);
                },
                onSlideChangeEnd: function (swiper) {
                    _pageIndex = swiper.activeIndex;
                    pageSwitching();
                }
            });


            $(".menu-list li").click(function () {
                _pageIndex = $(this).index();
                app.f7.closePanel();
                pageSwitching()
            });

        }

        function pageSwitching() {
            if (_pageIndex < 0) {
                _pageIndex = 0;
                stopSwitch = false;
                return
            }
            if (_pageIndex >= $(".menu-list li").length) {
                _pageIndex = $(".menu-list li").length - 1;
                stopSwitch = false;
                return
            }
            mySwiperv.slideTo(_pageIndex, 1000, false);
            $(".menu-list li").removeClass("active").eq(_pageIndex).addClass("active");
        }


        var changeTime = function () {
            _kpi_time = $($(".report-time")[0]).val();
            initData1();
        }

        /**
         *  数据流量
         */
        function initData1() {
            service.queryKpiList("2", _kpi_time, "0", function (res) {
                if (res.result == "true") {
                    var datas = res.data;
                    var c, gsm, td, lte;
                    for (var i = 0; i < datas.length; i++) {
                        var data = datas[i];
                        var kpiid = data.kpiid;
                        if (kpiid == 16) {//总流量_全网(GSM+TD+LTE)
                            showDataflow("dataflow", "16", data.props);
                        } else if (kpiid == 17) {//流量_GSM
                            showDataflow("dataflow", "gsm", data.props);
                        } else if (kpiid == 18) {//流量_TD
                            showDataflow("dataflow", "td", data.props);
                        } else if (kpiid == 19) {//流量_LTE
                            showDataflow("dataflow", "lte", data.props);
                        } else if (kpiid == 20) {//流量_WLAN
                            showDataflow("dataflow", "wlan", data.props);
                        } else if (kpiid == 13) {//总话务量_全网
                            showDataflow("traffic", "13", data.props);
                        } else if (kpiid == 14) {//话务量_GSM
                            showDataflow("traffic", "gsm", data.props);
                        } else if (kpiid == 15) {//话务量_TD
                            showDataflow("traffic", "td", data.props);
                        } else if (kpiid == 147) {//全网最大登记用户数
                            showDataflow("users", "147", data.props);
                        } else if (kpiid == 148) {//全网最大登记用户数GSM值
                            showDataflow("users", "gsmmax", data.props);
                        } else if (kpiid == 149) {//全网最大登记用户数TD值
                            showDataflow("users", "tdmax", data.props);
                        } else if (kpiid == 150) {//全网最大登记用户数TD值
                            showDataflow("users", "gsm", data.props);
                        } else if (kpiid == 151) {//全网最大登记用户数TD值
                            showDataflow("users", "td", data.props);
                        } else if (kpiid == 154) {//全网HLR用户
                            showDataflow("users", "hlr", data.props);
                        } else if (kpiid == 155) {//HLR登记在省内用户数
                            showDataflow("users", "hlr155", data.props);
                        } else if (kpiid == 156) {//漫游至省内用户数
                            showDataflow("users", "156", data.props);
                        } else if (kpiid == 157) {//漫游至国外用户数
                            showDataflow("users", "157", data.props);
                        } else if (kpiid == 152) {//漫游来访用户数
                            showDataflow("users", "152", data.props);
                        } else if (kpiid == 153) {//漫游出访用户数
                            showDataflow("users", "153", data.props);
                        } else if (kpiid == 158) {//SGSN峰值附着用户数
                            showDataflow("users", "sgsn", data.props);
                        } else if (kpiid == 159) {//LTE峰值用户数
                            showDataflow("users", "159", data.props);
                        } else if (kpiid == 160) {//WLANAC关联用户数平均值
                            showDataflow("users", "160", data.props);
                        }
                    }


                }
            });
        }

        function darwDataflowChart(title, xLabels, values, min, max) {
            app.jquery(".container_chart").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: xLabels,
                    labels: {
                        rotation: -60
                    }
                },
                yAxis: {
                    max: max,
                    min: min,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: ''
                },
                series: [{
                    name: '地市',
                    data: values,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        y: 0,//-1 * pointValStr.length * ConstDistanceVal
                        x: 0,
                        align: 'center',
                        style: {
                            align: 'left',
                            fontSize: '8px',
                            fontFamily: 'SimHei'
                        }
                    }

                }]
            });
            app.f7.popup('.popup-chart');
        }

        function showDataflow(type, id, data) {
            for (var i = 0; i < data.length; i++) {
                var t = data[i];
                for (var j = 0; j < t.length; j++) {
                    var t1 = t[j];
                    var attr = t[j].attr;
                    var value = t[j].value;
                    var color = t[j].color;
                    if (attr == "当日值") {
                        var v = value.replace('万Erl', '');
                        v = v.replace('TB', '');
                        v = v.replace('万个', '');
                        $("." + type + "_" + id + "_c").html(v);
                        $("." + type + "_" + id + "_cc").html(value);
                    } else if (attr == "日环比") {
                        $("." + type + "_" + id + "_month").html(value);
                        $("." + type + "_" + id + "_month_i").removeClass("downarrow");
                        $("." + type + "_" + id + "_month_i").removeClass("uparrow");
                        if (color == "red") {
                            $("." + type + "_" + id + "_month_i").addClass("downarrow")
                        } else {
                            $("." + type + "_" + id + "_month_i").addClass("uparrow")
                        }

                        //$("." + type + "_" + id + "_month").css("color", color);
                    } else if (attr == "周环比") {
                        $("." + type + "_" + id + "_week").html(value);
                        //$("." + type + "_" + id + "_week").css("color", color);

                        $("." + type + "_" + id + "_week_i").removeClass("downarrow");
                        $("." + type + "_" + id + "_week_i").removeClass("uparrow");
                        if (color == "red") {
                            $("." + type + "_" + id + "_week_i").addClass("downarrow")
                        } else {
                            $("." + type + "_" + id + "_week_i").addClass("uparrow")
                        }

                    } else if (attr == "年累计同比") {
                        $("." + type + "_" + id + "_year").html(value);
                        //$("." + type + "_" + id + "_year").css("color", color);

                        $("." + type + "_" + id + "_year_i").removeClass("downarrow");
                        $("." + type + "_" + id + "_year_i").removeClass("uparrow");
                        if (color == "red") {
                            $("." + type + "_" + id + "_year_i").addClass("downarrow")
                        } else {
                            $("." + type + "_" + id + "_year_i").addClass("uparrow")
                        }

                    } else if (attr == "年累计") {
                        var vv = value.replace('亿Erl', '');
                        vv = vv.replace('TB', '');
                        $("." + type + "_" + id + "_lj").html(vv);
                    } else if (attr == "年累计同比") {
                        $("." + type + "_" + id + "_ljb").html(value);
                        $("." + type + "_" + id + "_ljb").css("color", color);
                    }
                }

            }
        }


        function addEventHandler() {
            app.utils.safeBind(document, 'active', activeHandler);
        }

        function activeHandler(event) {
            if (event.detail.page != _page.name) return;
            console.log(_page.name + ' is back...');

        }

        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        }

        return {
            init: init
        };

    });
