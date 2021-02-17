const e=function(){const e=function(e,n,t){const o={passive:!0,capture:!0},i=`on${n}`;i in window?window[e+"EventListener"](n,t,o):i in document?document[e+"EventListener"](n,t,o):"add"===e&&console.warn(`activityListener rejected ${n}-event`)};return{erase:function(n,t){e("remove",n,t)},register:function(n,t){e("add",n,t)}}}();export default e;
//# sourceMappingURL=activityListener.js.map
