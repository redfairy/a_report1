/**
 * Created by linlijuan on 15/11/27.
 */
define(["jquery"], function (jQuery) {

        var self = {};
        var $ = Dom7;
        var _f7;

        var _url = "http://jkzw.inspur.com";

        self.init = function (f7) {
            _f7 = f7;
        };


        function callWsService(method, type, param, callback) {
            jQuery.ajax({
                url: _url + method,
                dataType: 'json',
                type: type,
                data: param,
                timeout: 40000,
                success: function (res) {
                    callback(res);
                },
                error: function (e) {
                    /*  app.f7.hideIndicator();
                     app.f7.alert("连接超时");*/
                }
            });
        }


        /**
         * 指标列表查询接口
         */
        self.queryKpiList = function (type, time, regionid, callback) {
            var in0 = "";
            in0 += "username=support";
            in0 += "&kpitype=" + type;
            in0 += "&time=" + time;
            in0 += "&regionid=0";
            in0 += "&securityid=0";

            callWsService("/networkdaily1/rest/kpiLists", "GET", in0, callback);
        };


        /**
         * 指定指标分布图
         */
        self.kpiRegionChart = function (kpitype, kpiid, timegrad, time, callback) {
            var in0 = "";
            in0 += "&kpitype=" + kpitype;
            in0 += "&timegrad=" + timegrad;
            in0 += "&time=" + time;
            in0 += "&kpiid=" + kpiid;
            callWsService("/networkdaily1/rest/kpiRegionChart", "GET", "username=support" + in0, callback);
        };

        /**
         * 个人订阅查询接口
         * userb
         */
        self.queryUserReport = function (user, callback) {
            callWsService("/weixin/network/childreport/" + user, "GET", "", callback);
        };

        self.queryKpi = function (kpi_id, time_range, dim_range, time, dim_value, net_type, callback) {
            var in0 = "{\"KPI_ID\":\"" + kpi_id + "\",";
            in0 += "\"TIME_RANGE\":\"" + time_range + "\",";
            in0 += "\"DIM_RANGE\":\"" + dim_range + "\",";
            in0 += "\"TIME\":\"" + time + "\",";
            in0 += "\"DIM_VALUE\":\"" + dim_value + "\",";
            in0 += "\"NET_TYPE\":\"" + net_type + "\"}";
            callWsService("/kpi/value", "GET", "param=" + in0, callback);
        };

        return self;

    }
);
