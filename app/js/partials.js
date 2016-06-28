define(["handlebars", "lib/helpers"], function(Handlebars){

  var infoSub = '{{#each this}}';
  infoSub += '  <a href="page/kpi-list.html" class="item-link">              ';
  infoSub += '    <li class="item-content">                                  ';
  infoSub += '    <div class="item-media"><i class="icon icon-f7"></i></div> ';
  infoSub += '    <div class="item-inner">                                   ';
  infoSub += '    <div class="item-title">{{name}}（{{kpis.[0].values.[0].value}}分）</div>                    ';
  infoSub += '  <div class="item-after"></div>                               ';
  infoSub += '  </div>                                                       ';
  infoSub += '  </li>                                                        ';
  infoSub += '  </a>     ';
  infoSub += '{{/each}}';

  //工单条目模板，下面init方法记得注册
  var task =  '{{#each this}}';
      task += '<li >';
      task += '  <a href="page/task-detail.html?id={{tid}}" class="item-link item-content">';
      task += '    <div class="item-media"><i class="icon icon-f7"></i></div>';
      task += '    <div class="item-inner">';
      task += '      <div class="item-title-small">';
      //{{{}}}里面的字符串可以转义html字符串
      task += '         {{{taskdata}}}';
      task += '         {{#is type "apple"}}';
      task += '           ---yes----';
      task += '         {{/is}}';
      task += '         {{#is type "banana"}}';
      task += '           ---no----';
      task += '         {{/is}}';
      task += '     </div>';
      task += '    </div>';
      task += '  </a>';
      task += '</li>';
      task += '{{/each}}';


  var news =  '<a href="page/news-detail.html?id={{_id}}">';
      news += '  <div class="card full-width">';
      news += '   <div class="card-content">';
      news += '    <div class="card-content-inner no-padding">';
      news += '      <img src="{{images}}" class="fullsize" onerror="ImgError(this);">';
      news += '      <div class="absolute snap-bottom near-transparent bg-black row-height-bigger fix-width"></div>';
      news += '    </div>';
      news += '    <div class="absolute snap-bottom color-white row-height-bigger fix-width valign-box">';
      news += '      <div class="padding-10">{{title}}</div>';
      news += '    </div>';
      news += '    <div class="absolute ribbon-tag {{cardType}} right-0 top-20-px color-white i18n" data-i18n="global.industry_news">';
      news += '      ';
      news += '    </div>';
      news += '   </div>';
      news += '   <div class="card-footer include-tag">';
      news += '     <div class="full-size ">';
      news += '      <div class="color-deep-gray">{{description}}</div>';
      news += '      <div class="margin-top-10-px smaller-text color-smoke">';
      news += '        {{#each tags}}';
      news += '          <span class="badge smaller margin-right-10px">{{this}}</span>';
      news += '        {{/each}}';
      news += '        <span class="margin-right-10px">';
      news += '          <i class="fa fa-clock-o margin-right-10px"></i>{{relatime}}';
      news += '        </span>';
      news += '        <span class="margin-right-10px">';
      news += '          <i class="fa fa-eye margin-right-10px"></i>{{views}}';
      news += '        </span>';
      news += '      </div>';
      news += '     </div>';
      news += '   </div>';
      news += '  </div>';
      news += '</a>';


  function init(){

    Handlebars.registerPartial('news', news);
    //新增的模板记得在这类注册下才能在模块中使用
    Handlebars.registerPartial('task', task);

    Handlebars.registerPartial('infoSub', infoSub);
  }

  return {
    init: init
  };

});