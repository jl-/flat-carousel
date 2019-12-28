"use strict";function ___$insertStyle(t){if(t&&"undefined"!=typeof window){var e=document.createElement("style");return e.setAttribute("type","text/css"),e.innerHTML=t,document.head.appendChild(e),t}}function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var Status,React=require("react"),React__default=_interopDefault(React),__assign=function(){return(__assign=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function __rest(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(t);o<i.length;o++)e.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(t,i[o])&&(n[i[o]]=t[i[o]])}return n}function __read(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var i,o,a=n.call(t),r=[];try{for(;(void 0===e||0<e--)&&!(i=a.next()).done;)r.push(i.value)}catch(t){o={error:t}}finally{try{i&&!i.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return r}!function(t){t[t.IDLE=1]="IDLE",t[t.EASING=2]="EASING"}(Status=Status||{});var outQunit=function(t){return--t*t*t*t*t+1},Tween=function(){function t(t){void 0===t&&(t={}),this._to=0,this._from=0,this.status=Status.IDLE,this.tick=this.tick.bind(this),this._easing=t.easing||outQunit,this._duration=t.duration||300}return t.prototype.from=function(t){return this._from=t,this},t.prototype.to=function(t){return this._to=t,this},t.prototype.duration=function(t){return void 0===t&&(t=300),this._duration=t,this},t.prototype.stop=function(t){return this._raf&&(cancelAnimationFrame(this._raf),this._raf=void 0),this.status=Status.IDLE,"function"==typeof t&&t(this._to,this._from),this},t.prototype.tick=function(i,o){var a,r=this,t=this,s=t._from,u=t._to,d=t._easing,l=t._duration,c=function(t){var e=t-(a=a||t),n=Math.min(e/l,1);n<=1&&i(s+(u-s)*d(n)),r.status===Status.EASING&&(1<=n?r.stop(o):r._raf=requestAnimationFrame(c))};this.stop(),this.status=Status.EASING,this._raf=requestAnimationFrame(c)},t}(),isPassiveEventSupported=function(){var t=!1;try{window.addEventListener("passive",null,{get passive(){return t=!0}})}catch(t){}return function(){return t}}();function coerceEventOptions(t){return void 0===t&&(t={}),isPassiveEventSupported()?t:Boolean(t.capture)}function on(t,e,n,i){t.addEventListener(e,n,coerceEventOptions(i))}function off(t,e,n,i){t.removeEventListener(e,n,coerceEventOptions(i))}var swipeOptions={initialIndex:0,transitionDuration:400,infiniteLoop:!0,autoplay:!0,autoplayInterval:3e3},pristineSwipeState={dx:0,_dx:0,x:0,y:0,touchId:void 0,isScrolling:void 0},Swiper=function(){function t(t,e){var o=this;this.handleStart=function(t){var e=o.state,n=o.findTouch(t);o.state=__assign(__assign({},e),{x:n.pageX-e.dx,y:n.pageY,touchId:n.identifier}),o.tween.stop(),o.stopAutoplay(),on(o.root,"touchmove",o.handleMove,{passive:!1}),on(o.root,"touchend",o.handleEnd),on(o.root,"mousemove",o.handleMove,{passive:!1}),on(o.root,"mouseup",o.handleEnd)},this.handleMove=function(t){var e=o.findTouch(t,!1,o.state.touchId);if(e){var n=e.pageX-o.state.x;if(void 0===o.state.isScrolling){var i=e.pageY-o.state.y;o.state.isScrolling=Math.abs(n)<Math.abs(i)}o.state.isScrolling||(t.preventDefault(),o.translate(n))}else o.handleEnd(t)},this.handleEnd=function(t){if(off(o.root,"touchmove",o.handleMove),off(o.root,"touchend",o.handleEnd),off(o.root,"mousemove",o.handleMove),off(o.root,"mouseup",o.handleEnd),o.findTouch(t,!0,o.state.touchId)){var e=0,n=o.state,i=o.getNextIndex(n.dx);o.slides[i]&&0<=n.dx*n._dx&&36<=Math.abs(n.dx)&&(e=0<n.dx?o.width:-o.width),o.tween.from(o.state.dx).to(e).tick(o.translate,o.onTweenEnd)}},this.translate=function(t){if(o.state._dx=t-o.state.dx,o.state.dx=t,Math.abs(o.state.dx)>o.width){var e=o.getNextIndex(o.state.dx);o.slides[e]&&(o.changeCurrentIndex(e),o.state.dx=o.state.dx%o.width,o.state.x=(o.state.x+o.width)%o.width)}var n=o.getNextIndex(o.state.dx);if(o.slides[n]){o.moveSlide(o.currentIndex,o.state.dx),n!==o.currentIndex&&o.moveSlide(n,o.state.dx+(0<o.state.dx?-o.width:o.width));for(var i=o.slides.length-1;0<=i;i--)i!==n&&i!==o.currentIndex&&o.moveSlide(i,o.width)}else o.moveSlide(o.currentIndex,.2*o.state.dx)},this.onTweenEnd=function(t){o.translate(t),o.state=__assign({},pristineSwipeState),o.changeCurrentIndex(o.getNextIndex(t)),o.startAutoplay()},this.root=t,this.width=t.offsetWidth,this.options=__assign(__assign({},swipeOptions),e),this.slides=Array.from(t.children),this.positions=new Array(this.slides.length),this.currentIndex=this.getIndex(this.options.initialIndex),this.tween=new Tween({duration:this.options.transitionDuration}),this.state=__assign({},pristineSwipeState),this.slides.length<2&&(this.options.infiniteLoop=!1),this.options.infiniteLoop||(this.options.autoplay=!1);for(var n=0;n<this.slides.length;n++){var i=this.slides[n];i.style.left="0px",i.style.width=this.width+"px",this.moveSlide(n,this.width)}1<this.slides.length&&(this.startAutoplay(),on(t,"touchstart",this.handleStart),on(t,"mousedown",this.handleStart)),this.moveSlide(this.currentIndex,0)}return t.prototype.getIndex=function(t){var e=this.root.children;return(t+e.length)%e.length},t.prototype.getNextIndex=function(t){var e=this.currentIndex+(0<t?-1:t<0?1:0);return this.options.infiniteLoop?this.getIndex(e):e},t.prototype.findTouch=function(t,e,n){void 0===e&&(e=!1);var i=t;if(!Boolean(i.touches||i.changedTouches))return{pageX:t.pageX,pageY:t.pageY,identifier:void 0};var o=e?i.changedTouches:i.touches;return n?Array.from(o).find(function(t){return t.identifier===n}):o[0]},t.prototype.moveSlide=function(t,e){var n=this.getIndex(t),i=this.slides[n];this.positions[n]!==e&&(this.positions[n]=e,i.style.webkitTransform="translateX("+e+"px)")},t.prototype.changeCurrentIndex=function(t){this.currentIndex=t,"function"==typeof this.options.onPageChange&&this.options.onPageChange(this.currentIndex)},t.prototype.startAutoplay=function(){var t=this;this.options.autoplay&&(this.autoplayTimer=setTimeout(function(){t.stopAutoplay(),t.tween.from(0).to(-t.width).tick(t.translate,t.onTweenEnd)},this.options.autoplayInterval))},t.prototype.stopAutoplay=function(){this.autoplayTimer&&(clearTimeout(this.autoplayTimer),this.autoplayTimer=void 0)},t}();___$insertStyle(".carousel {\n  width: 100vw;\n}\n.carousel, .carousel__main {\n  position: relative;\n  overflow: hidden;\n}\n.carousel__item {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  will-change: transform;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.carousel__dots {\n  position: absolute;\n  bottom: 8px;\n  left: 0;\n  right: 0;\n  font-size: 0;\n  text-align: center;\n}\n.carousel__dot {\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  border-radius: 5px;\n  background-color: rgba(255, 255, 255, 0.4);\n}\n.carousel__dot--active {\n  background-color: #fff;\n}\n.carousel__dot:only-child {\n  display: none;\n}\n.carousel__dot:nth-child(n+2) {\n  margin-left: 5px;\n}");var cx=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return t.filter(Boolean).join(" ")},CarouselMain=React__default.memo(React__default.forwardRef(function(t,e){var n=t.children;return React__default.createElement("div",{ref:e,className:"carousel__main"},React__default.Children.map(n,function(t,e){return React__default.isValidElement(t)?React__default.cloneElement(t,{key:e,className:cx(t.props.className,"carousel__item")}):null}))})),index=React__default.memo(function(t){var e=t.children,n=__rest(t,["children"]),i=React.useRef(null),o=React.useRef(null),a=__read(React.useState(n.initialIndex||0),2),r=a[0],s=a[1];return React.useEffect(function(){i.current=new Swiper(o.current,__assign(__assign({},n),{onPageChange:s}))},[]),React__default.createElement("div",{className:"carousel"},React__default.createElement(CarouselMain,{ref:o},e),React__default.createElement("div",{className:"carousel__dots"},React__default.Children.map(e,function(t,e){return React__default.createElement("span",{className:cx("carousel__dot",e===r?"carousel__dot--active":"")})})))});module.exports=index;
