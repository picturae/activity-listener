!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).activityListener=t()}(this,(function(){"use strict";return function(){let e=!0;const t={},n=function(e,n,o){const i=`on${n}`,c=t[n].get(o).procedure,r=t[n].get(o).options;i in window?window[e+"EventListener"](n,c,r):i in document?document[e+"EventListener"](n,c,r):"add"===e&&console.warn(`activityListener rejected ${n}-event`)},o=function(e,o){n("remove",e,o),t[e].delete(o),t[e].size||delete t[e]},i=function(){Object.keys(t).forEach((e=>{for(let n of t[e].keys())o(e,n)}))};return{debug:()=>console.log("registry",t),clear:i,destroy:i,erase:o,pause:function(){e=!1},register:function(o,i,c,r=50){const s=function(i,c,r){t[o]||(t[o]=new Map),t[o].set(i,{procedure:function(t){!function(t,n,o){if(!e)return;const i=function(){try{t(o)}catch(e){console.error("activityListener caught faulty callback")}};n?setTimeout(i,n):i()}(i,r,t)},options:c}),n("add",o,i)};i&&s(i,{passive:!0,capture:!0},0),c&&s(c,{passive:!0,capture:!1},r)},resume:function(){e=!0}}}()}));
//# sourceMappingURL=activityListener.js.map
