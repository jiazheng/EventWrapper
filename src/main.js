/**
 * 百度地图API事件包装器，以类似google map api事件调用
 * 方式使用百度地图API
 * 此代码使用closure compiler压缩
 * @author JZ
 * @version 1.0
 */

(function(){
/**
 * 命名空间
 */
window['EventWrapper'] = window['EventWrapper'] || {};

var e = window['EventWrapper'];
/**
 * 添加DOM事件监听函数
 * @param HTMLElement DOM元素
 * @param String 事件名称
 * @param Function 事件处理函数
 * @returns MapsEventListener 事件监听对象
 */
e['addDomListener'] = function(instance, eventName, handler) {
    if (instance.addEventListener) {
        instance.addEventListener(eventName, handler, false);
    }
    else if (instance.attachEvent) {
        instance.attachEvent('on' + eventName, handler);
    }
    else {
        instance['on' + eventName] = handler;
    }
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.DOM_EVENT);
};
/**
 * 添加DOM事件监听函数，函数仅执行一次
 * @param HTMLElement DOM元素
 * @param String 事件名称
 * @param Function 事件处理函数
 * @returns MapsEventListener 事件监听对象
 */
e['addDomListenerOnce'] = function(instance, eventName, handler) {
    var eventListener = e.addDomListener(instance, eventName, function(){
        // 移除
        e.removeListener(instance, eventName, handler);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * 添加地图事件监听函数
 * @param Object 实例
 * @param String 事件名称
 * @param Function 事件处理函数
 * @returns MapsEventListener 事件监听对象
 */
e['addListener'] = function(instance, eventName, handler) {
    instance.addEventListener(eventName, handler);
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.MAP_EVENT);
};
/**
 * 添加地图事件监听函数，函数仅执行一次
 * @param Object 实例
 * @param String 事件名称
 * @param Function 事件处理函数
 * @returns MapsEventListener 事件监听对象
 */
e['addListenerOnce'] = function(instance, eventName, handler){
    var eventListener = e.addListener(instance, eventName, function(){
        // 移除
        e.removeListener(eventListener);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * 移除特定实例的所有事件的所有监听函数
 * @param Object
 */
e['clearInstanceListeners'] = function(instance) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        e['removeListener'](listeners[i]);
    }
    instance._e_ = {};
};
/**
 * 移除特定实例特定事件的所有监听函数
 * @param Object 实例
 * @param string 事件名
 */
e['clearListeners'] = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            e['removeListener'](listeners[i]);
        }
    }
};
/**
 * 移除特定的事件监听函数
 * @param MapsEventListener
 */
e['removeListener'] = function(listener) {
    var instance = listener._instance;
    var eventName = listener._eventName;
    var handler = listener._handler;
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._guid == listener._guid) {
            if (listener._eventType == MapsEventListener.DOM_EVENT) {
                // DOM事件
                if (instance.removeEventListener) {
                    instance.removeEventListener(eventName, handler, false);
                }
                else if (instance.detachEvent) {
                    instance.detachEvent('on' + eventName, handler);
                }
                else {
                    instance['on' + eventName] = null;
                }
            }
            else if (listener._eventType == MapsEventListener.MAP_EVENT) {
                // 地图事件
                instance.removeEventListener(eventName, handler);
            }
            delete listeners[i];
        }
    }
};
/**
 * 触发特定事件
 * @param Object 实例
 * @param string 事件名称
 */
e['trigger'] = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            var args = Array.prototype.slice.call(arguments, 2);
            listeners[i]._handler.apply(instance, args);
        }
    }
};

/**
 * 事件监听对象
 * @private
 * @param Object 对象实例
 * @param string 事件名称
 * @param Function 事件监听函数
 * @param EventTypes 事件类型
 */
function MapsEventListener(instance, eventName, handler, eventType){
    this._instance = instance;
    this._eventName = eventName;
    this._handler = handler;
    this._eventType = eventType;
    this._guid = MapsEventListener._guid ++;
    this._instance._e_ = this._instance._e_ || {};
    this._instance._e_[this._guid] = this;
}
MapsEventListener._guid = 1;

MapsEventListener.DOM_EVENT = 1;
MapsEventListener.MAP_EVENT = 2;

})();