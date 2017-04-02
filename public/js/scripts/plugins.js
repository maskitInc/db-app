// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    
    while (length--) {
        method = methods[length];
        
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

jQuery.getScrollBarSize = function () {
    var inner = $('<p></p>').css({
        'width': '100%',
        'height': '100%'
    });
    var outer = $('<div></div>').css({
        'position': 'absolute',
        'width': '100px',
        'height': '100px',
        'top': '0',
        'left': '0',
        'visibility': 'hidden',
        'overflow': 'hidden'
    }).append(inner);
    
    $(document.body).append(outer);
    
    var w1 = inner.width(),
        h1 = inner.height();
    outer.css('overflow', 'scroll');
    var w2 = inner.width(),
        h2 = inner.height();
    if (w1 == w2 && outer[0].clientWidth) {
        w2 = outer[0].clientWidth;
    }
    if (h1 == h2 && outer[0].clientHeight) {
        h2 = outer[0].clientHeight;
    }
    
    outer.detach();
    
    return [(w1 - w2)];
};

//alert( $.getScrollBarSize() );

/*=================== WHEN STOP SCROLLING ===============*/
// extension:
$.fn.scrollEnd = function (callback, timeout) {
    $(this).scroll(function () {
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
};

// how to call it (with a 1000ms timeout):
// $(window).scrollEnd(function(){
//     alert('stopped scrolling');
// }, 1000);
/*-------------------------------------------------------*/

/*bind / unbind FX*/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        
        return fBound;
    };
}
/*----------------------*/


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1
};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
/*----------------------*/
/*carousel functions START*/
function whichTransitionEvent() {
    var t,
        el = document.createElement("fakeelement");
    
    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }
    
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}


function whichAnimationEvent() {
    var t,
        el = document.createElement("fakeelement");
    
    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }
    
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function ($) {
    $.fn.longclick = function (callback, timeout) {
        var isIPad = $.isIPad();
        
        var startEvents = isIPad ? "touchstart" : "mousedown";
        var endEvents = isIPad ? "touchend touchcancel" : "mouseup";
        
        $(this).bind(startEvents, function (event) {
            // save the initial event object
            var initialEvent = event;
            // set delay after which the callback will be called
            var timer = window.setTimeout(function () {
                callback(initialEvent);
            }, timeout);
            // bind to global event(s) for clearance
            $(document).bind(endEvents, function () {
                // clear timer
                window.clearTimeout(timer);
                // reset global event handlers
                $(document).unbind(endEvents);
                return true;
                // use 'return false;' if you need to prevent default handler and
                // stop event bubbling
            });
            return true;
            // use 'return false;' if you need to prevent default handler and
            // stop event bubbling
        });
    };
})(jQuery);

// ...
// // using
// (function ($) {
//     $("#someDiv").longclick(function () {
//              alert($(e.target).attr("id") + " was clicked"); },
//              1500);
// })(jQuery);


function getRows(selector) {
    var height = $(selector).height();
    var font_size = $(selector).css('font-size');
    var line_height = $(selector).css('line-height');
    var scale = 1.15
    var line_height = Math.floor(parseInt(font_size) * scale);
    var rows = height / line_height;
    
    return Math.round(rows);
    
}

function ellipsizeTextBox(container, className, tagName) {
    var container = document.getElementById(container);
    if (container.getElementsByClassName) {
        var el = container.getElementsByClassName(className);
        
        for (var i = 0; i < el.length; i++) {
            var elBox = el[i];
            var elTit = el[i].getElementsByTagName(tagName)[0];
            var keep = elTit.innerHTML;
            
            while (elTit.scrollHeight > elBox.offsetHeight) {
                elTit.innerHTML = keep;
                elTit.innerHTML = elTit.innerHTML.substring(0, elTit.innerHTML.length - 1);
                keep = elTit.innerHTML;
                elTit.innerHTML = elTit.innerHTML + "...";
            }
        }
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "",
        i = 0,
        min = an == "a" ? 10 : 0,
        max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        var r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return "messageID-" + str.toUpperCase();
}


$.fn.shuffle = function () {
    
    var elements = this.get()
    var copy = [].concat(elements)
    var shuffled = []
    var placeholders = []
    
    // Shuffle the element array
    while (copy.length) {
        var rand = Math.floor(Math.random() * copy.length)
        var element = copy.splice(rand, 1)[0]
        shuffled.push(element)
    }
    
    // replace all elements with a plcaceholder
    for (var i = 0; i < elements.length; i++) {
        var placeholder = document.createTextNode('')
        findAndReplace(elements[i], placeholder)
        placeholders.push(placeholder)
    }
    
    // replace the placeholders with the shuffled elements
    for (var i = 0; i < elements.length; i++) {
        findAndReplace(placeholders[i], shuffled[i])
    }
    
    return $(shuffled)
    
}

function findAndReplace(find, replace) {
    find.parentNode.replaceChild(replace, find)
}


jQuery.fn.center = function (parent) {
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "absolute",
        "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
        "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
    });
    return this;
}


function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}


function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}


$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '.00');
    })
}