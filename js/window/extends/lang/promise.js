!function n(t,e,o){function r(u,f){if(!e[u]){if(!t[u]){var s="function"==typeof require&&require;if(!f&&s)return s(u,!0);if(i)return i(u,!0);throw new Error("Cannot find module '"+u+"'")}var c=e[u]={exports:{}};t[u][0].call(c.exports,function(n){var e=t[u][1][n];return r(e?e:n)},c,c.exports,n,t,e,o)}return e[u].exports}for(var i="function"==typeof require&&require,u=0;u<o.length;u++)r(o[u]);return r}({1:[function(n,t){function e(){}var o=t.exports={};o.nextTick=function(){var n="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(n)return function(n){return window.setImmediate(n)};if(t){var e=[];return window.addEventListener("message",function(n){var t=n.source;if((t===window||null===t)&&"process-tick"===n.data&&(n.stopPropagation(),e.length>0)){var o=e.shift();o()}},!0),function(n){e.push(n),window.postMessage("process-tick","*")}}return function(n){setTimeout(n,0)}}(),o.title="browser",o.browser=!0,o.env={},o.argv=[],o.on=e,o.once=e,o.off=e,o.emit=e,o.binding=function(){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(){throw new Error("process.chdir is not supported")}},{}],2:[function(n,t){"use strict";function e(n){function t(n){return null===c?void l.push(n):void i(function(){var t=c?n.onFulfilled:n.onRejected;if(null===t)return void(c?n.resolve:n.reject)(a);var e;try{e=t(a)}catch(o){return void n.reject(o)}n.resolve(e)})}function u(n){try{if(n===p)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if("function"==typeof t)return void r(t.bind(n),u,f)}c=!0,a=n,s()}catch(e){f(e)}}function f(n){c=!1,a=n,s()}function s(){for(var n=0,e=l.length;e>n;n++)t(l[n]);l=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof n)throw new TypeError("not a function");var c=null,a=null,l=[],p=this;this.then=function(n,r){return new e(function(e,i){t(new o(n,r,e,i))})},r(n,u,f)}function o(n,t,e,o){this.onFulfilled="function"==typeof n?n:null,this.onRejected="function"==typeof t?t:null,this.resolve=e,this.reject=o}function r(n,t,e){var o=!1;try{n(function(n){o||(o=!0,t(n))},function(n){o||(o=!0,e(n))})}catch(r){if(o)return;o=!0,e(r)}}var i=n("asap");t.exports=e},{asap:4}],3:[function(n,t){"use strict";function e(n){this.then=function(t){return"function"!=typeof t?this:new o(function(e,o){r(function(){try{e(t(n))}catch(r){o(r)}})})}}var o=n("./core.js"),r=n("asap");t.exports=o,e.prototype=Object.create(o.prototype);var i=new e(!0),u=new e(!1),f=new e(null),s=new e(void 0),c=new e(0),a=new e("");o.from=o.cast=function(n){if(n instanceof o)return n;if(null===n)return f;if(void 0===n)return s;if(n===!0)return i;if(n===!1)return u;if(0===n)return c;if(""===n)return a;if("object"==typeof n||"function"==typeof n)try{var t=n.then;if("function"==typeof t)return new o(t.bind(n))}catch(r){return new o(function(n,t){t(r)})}return new e(n)},o.denodeify=function(n,t){return t=t||1/0,function(){var e=this,r=Array.prototype.slice.call(arguments);return new o(function(o,i){for(;r.length&&r.length>t;)r.pop();r.push(function(n,t){n?i(n):o(t)}),n.apply(e,r)})}},o.nodeify=function(n){return function(){var t=Array.prototype.slice.call(arguments),e="function"==typeof t[t.length-1]?t.pop():null;try{return n.apply(this,arguments).nodeify(e)}catch(i){if(null===e||"undefined"==typeof e)return new o(function(n,t){t(i)});r(function(){e(i)})}}},o.all=function(){var n=Array.prototype.slice.call(1===arguments.length&&Array.isArray(arguments[0])?arguments[0]:arguments);return new o(function(t,e){function o(i,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(n){o(i,n)},e)}n[i]=u,0===--r&&t(n)}catch(s){e(s)}}if(0===n.length)return t([]);for(var r=n.length,i=0;i<n.length;i++)o(i,n[i])})},o.prototype.done=function(){var n=arguments.length?this.then.apply(this,arguments):this;n.then(null,function(n){r(function(){throw n})})},o.prototype.nodeify=function(n){return null===n||"undefined"==typeof n?this:void this.then(function(t){r(function(){n(null,t)})},function(t){r(function(){n(t)})})},o.prototype.catch=function(n){return this.then(null,n)},o.resolve=function(n){return new o(function(t){t(n)})},o.reject=function(n){return new o(function(t,e){e(n)})},o.race=function(n){return new o(function(t,e){n.map(function(n){o.cast(n).then(t,e)})})}},{"./core.js":2,asap:4}],4:[function(n,t){(function(n){function e(){for(;r.next;){r=r.next;var n=r.task;r.task=void 0;var t=r.domain;t&&(r.domain=void 0,t.enter());try{n()}catch(o){if(s)throw t&&t.exit(),setTimeout(e,0),t&&t.enter(),o;setTimeout(function(){throw o},0)}t&&t.exit()}u=!1}function o(t){i=i.next={task:t,domain:s&&n.domain,next:null},u||(u=!0,f())}var r={task:void 0,next:null},i=r,u=!1,f=void 0,s=!1;if("undefined"!=typeof n&&n.nextTick)s=!0,f=function(){n.nextTick(e)};else if("function"==typeof setImmediate)f="undefined"!=typeof window?setImmediate.bind(window,e):function(){setImmediate(e)};else if("undefined"!=typeof MessageChannel){var c=new MessageChannel;c.port1.onmessage=e,f=function(){c.port2.postMessage(0)}}else f=function(){setTimeout(e,0)};t.exports=o}).call(this,n("C:\\Users\\forbes.lindesay\\Documents\\GitHub\\promisejs.org\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))},{"C:\\Users\\forbes.lindesay\\Documents\\GitHub\\promisejs.org\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":1}],5:[function(){Promise.prototype.done||(Promise.prototype.done=function(n,t){this.then(n,t).then(null,function(n){setTimeout(function(){throw n},0)})})},{}],6:[function(n){"undefined"==typeof Promise?Promise=n("promise"):n("./polyfill-done.js")},{"./polyfill-done.js":5,promise:3}]},{},[6]);$.Promise = Promise;