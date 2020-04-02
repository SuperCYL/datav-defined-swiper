var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');

/**
 * swiper
 * */
var Swiper = require('swiper');
/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);


    var html = `<div id="certify" style="height:427px;overflow:hidden"><div class="swiper-container" style="height:427px;"><div class="swiper-wrapper" style="height:427px;">`
    
    for (i = 0; i < data.length; i++) { 
      html += `<div class="swiper-slide swiper-slide-defined" id="${data[i]['id']}">`
      html += `<img src=${data[i]['image']} style='width:158px;height:102px;' />`
      html += `<p class="tittle" style="position:absolute;left:186px;top:6px;">${data[i]['value']}</p>`
      html += `<span style="position:absolute;left:186px;bottom:6px;">2019/2/2</span>`
      html += `<span style="position:absolute;right:14px;bottom:6px;">35345</span>`
      html += `</div>`
    }
   html += `</div></div></div>`
   this.container.html(html);

   $(".swiper-slide-defined").on('click', (obj) => {
     var params = {
      id:$(obj)[0]["target"]["id"]
     }
     console.log(params);
     this.emit('itemClick', params)            // data必须为一个对象，而不是一个简单值，属性名即为变量名。
   })

    this.container.find(".swiper-slide").css({
      width:"583px",
      height:"127px",
      background:"rgba(38,186,241,0.55)",
      border:"1px solid rgba(38,186,241,1)",
      marginBottom:"29px",
      position:"relative",
      padding:"14px"
    })

    let that = this;
    new Swiper('#certify .swiper-container', {
    watchSlidesProgress: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    direction: 'vertical',
    loop: true, 
    autoplay: true,
    loopedSlides: 5,
    autoplay: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      //clickable :true,
    },
    on: {
      progress: function (progress) {
        for (i = 0; i < this.slides.length; i++) {
          var slide = this.slides.eq(i);
          var slideProgress = this.slides[i].progress;
          scale = 1 - Math.abs(slideProgress) / 4;
          slide.transform('scale(' + scale + ')');
        }
      },
      slideChangeTransitionStart: function(){
        console.log(that.container.find(".swiper-slide-duplicate-active").find(".tittle").text());
      },
    },
    

  })

  
  

   
    //更新图表
    //this.chart.render(data, cfg);
    
    //如果有需要的话,更新样式
    this.updateStyle();
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});