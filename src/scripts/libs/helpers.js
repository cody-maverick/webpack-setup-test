function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function killbounce(_func, _wait) {

  var wheel = 0,
      wheelLimit = 0,
      oldDate = new Date();

  return function() {
    var context = this,
        args = arguments,
        event = args[0],
        getDeltaY = event.deltaY,
        newDate = new Date(),
        newTime = newDate.getTime(),
        oldTime = oldDate.getTime(),
        scrollAllowed = true;

    if (wheelLimit < 10 && (newTime-oldTime) < _wait) {
      wheelLimit++;
    } else {
      if((newTime-oldTime) > _wait) {
        wheelLimit = 0;
        wheel = 0;
      } else {
        scrollAllowed = false;
      }
    }

    wheel++;

    if (wheel > 80) {
      wheel = 0;
      _func.apply(context, args);
    }

    oldDate = new Date();

    if( scrollAllowed ) {
      _func.apply(context, args);
    }
  }
}

function preventDefault(event) {
  event.preventDefault();
}

window.helpers = window.helpers || {};

jQuery.extend(window.helpers, {
  getURLParameter: function (name, search) {
    search = search || window.location.search || window.location.hash;
    if (search.indexOf('?') > -1) search = search.split('?')[1];
    var uri = (new RegExp('(^|&)' + name + '=' + '(.+?)(&|$)').exec(search) || [, null, null])[2];
    return uri && decodeURI(uri);
  },

  getURLData: function () {
    var search = window.location.search || window.location.hash;
    var data = {};

    search = search.split('?');
    search = (search.length > 1) ? search[1] : '';
    search = search.split('&');

    $.each(search, function (index, str) {
      var parsed = str.split('='),
        key = parsed[0],
        value;
      if (!key || parsed.length !== 2) return;
      value = decodeURI(parsed[1]);
      if (key in data) {
        if (!(data[key] instanceof Array)) data[key] = [data[key]];
        data[key].push(value);
      } else data[key] = value;
    });

    return data;
  },

  render: function(str, data){
    return Object.keys(data).reduce(function(str, key){
      var value = (data[key] === undefined)? '' : data[key];
      return str.split('{' + key + '}').join(value);
    }, str);
  }
});

window.debug = (function(){
  var data = window.helpers.getURLData();
  if(data.debug && ['on', 'off'].indexOf(data.debug) > -1) sessionStorage.setItem('debug', data.debug);
  return (window.sessionStorage.getItem('debug') === 'on');
})();

(function(){
  var basket = {
    add: function(item){
      item.id += '';
      if(!(item.id && item.list)) return;
      basket.items[item.id] = item;
      window.localStorage.setItem('ga_basket', JSON.stringify(basket.items));
    },
    clear: function(){
      window.ga_basket = {};
      localStorage.removeItem('ga_basket');
    },
    getItems: function(){
      return JSON.parse(window.localStorage.getItem('ga_basket') || '{}');
    },
    getIDs: function(){
      return Object.keys(basket.items);
    },
    getItemByID: function(id){
      id = id += '';
      return basket.items[id];
    }
  };

  basket.items = basket.getItems();
  window.ga_basket = basket;
})();

(function($){
  $.fn.visibilityObserver = function(options){
    this.eq(0).each(function(){
      new visibilityObserver($(this), options);
    });
    return this;
  };

  // TODO: предусмотреть возможность передачи в options.offset функции для динамического расчёта
  function visibilityObserver($element, options){
    var observer = this;
    var settings;
    var timers = {};
    var intervals = {};

    var $window = $(window);

    function getSettings(options){
      options = options || {};
      options.offset = $.extend({}, getSettings.offset, options.offset || {});
      return $.extend({}, getSettings.default, options || {});
    }

    getSettings.offset = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };

    getSettings.default = {
      auto_check: 0,
      events: true,
      namespace: 'v-observer',
      reselect: false,
      resize_delay: 250,
      scroll_delay: 250,
      visibility_min: 50
    };

    // для кроссбраузерности
    // иначе могут быть проблемы с height|width и read-only
    function getRect(element){
      var base = element.getBoundingClientRect();
      var rect = {
        bottom: base.bottom,
        left: base.left,
        right: base.right,
        top: base.top,
        height: base.bottom - base.top,
        width: base.right - base.left,
        x: base.left,
        y: base.top
      };
      rect.square = rect.width * rect.height;
      return rect;
    }

    // рассчитывает видимую область на экране на основе
    // отступов в настройках и позиции родительского элемента на странице
    function getRectVisible(element, bounding, offset){
      bounding = bounding || {
        bottom: document.documentElement.clientHeight,
        left: 0,
        right: document.documentElement.clientWidth,
        top: 0
      };
      offset = offset || getSettings.offset;
      var rect = getRect(element);
      var visible = {};
      visible.left = Math.min(Math.max(bounding.left, bounding.left + offset.left, rect.left), bounding.right);
      visible.right = Math.max(Math.min(bounding.right - offset.right, bounding.right, rect.right), visible.left);
      visible.top = Math.min(Math.max(bounding.top, bounding.top + offset.top, rect.top), bounding.bottom);
      visible.bottom = Math.max(Math.min(bounding.bottom - offset.bottom, bounding.bottom, rect.bottom), visible.top);
      visible.height = visible.bottom - visible.top;
      visible.width = visible.right - visible.left;
      visible.square = visible.width * visible.height;
      visible.square_perc = Math.ceil( visible.square / (rect.square || 1 ) * 100);
      return visible;
    }

    observer.addEvents = function(){
      if(!settings.events){ return; }

      $window.on('resize.' + settings.namespace, function(){
        if(timers.resize) return;
        timers.resize = setTimeout(function(){
          timers.resize = null;
          observer.checkVisibility();
        }, settings.resize_delay);
      });

      $window.on('scroll.' + settings.namespace, function(){
        if(timers.scroll) return;
        timers.scroll = setTimeout(function(){
          timers.scroll = null;
          observer.checkVisibility();
        }, settings.scroll_delay);
      });
    };

    observer.checkVisibility = function(){
      settings.reselect = true;
      var frame_rect = getRectVisible(observer.frame[0], null, settings.offset);
      var changes = [];
      observer.items = settings.reselect? observer.reselect() : observer.items;

      observer.items.each(function(){
        var $element = $(this);
        var status = $element.data('in_view') || false;
        var rect = getRectVisible($element[0], frame_rect);
        var visibility = (rect.square_perc >= settings.visibility_min);
        if(visibility !== status) {
          changes.push({
            element: $element,
            visibility: visibility
          });
        }
      });

      changes.forEach(function(item){
        item.element.trigger(settings.namespace + ':element--' + (item.visibility? 'show' : 'hide'));
        item.element.data('in_view', item.visibility);
      });

      if(!changes.length){ return; }
      observer.frame.trigger(settings.namespace + ':elements--changed', [changes]);
    };

    observer.destroy = function(){
      observer.removeEvents();
      Object.keys(timers).forEach(function(name){
        var timer = timers[name];
        if(timer){ clearTimeout(timer); }
      });
      Object.keys(intervals).forEach(function(name){
        var interval = intervals[name];
        if(interval){ clearTimeout(interval); }
      });
      observer.frame.removeData('v-observer');
    };

    observer.removeEvents = function(){
      $window.off('.' + settings.namespace);
    };

    observer.reselect = function(){
      return settings.selector? observer.frame.find(settings.selector) : observer.frame.children();
    };

    observer.startAutoCheck = function(interval){
      observer.stopAutoCheck();
      intervals.auto_check = setInterval(function(){
        observer.checkVisibility();
      }, interval);
    };

    observer.stopAutoCheck = function(){
      if(intervals.auto_check){ intervals.auto_check = clearInterval(); }
    };

    observer.updateOffset = function(offset){
      $.extend(settings.offset, offset);
      observer.checkVisibility();
    };

    settings = getSettings(options);

    observer.frame = $element;
    observer.items = observer.reselect();
    observer.addEvents();
    observer.checkVisibility();
    if(settings.auto_check){
      observer.startAutoCheck(settings.auto_check);
    }

    observer.frame.data('v-observer', observer);
    return observer;
  }
})(jQuery);
