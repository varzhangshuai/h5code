function getUserid(){var e=location.search,t=new Object;if(-1!=e.indexOf("?")){var i=e.substr(1);strs=i.split("&");for(var n=0;n<strs.length;n++)t[strs[n].split("=")[0]]=unescape(strs[n].split("=")[1])}return t}function getUri(e){var t=e.split("//"),i=t[1].indexOf("/"),n=t[1].substring(i);return-1!=n.indexOf("?")&&(n=n.split("?")[0]),n}function myRoutes(){return"http://m.daodaoclub.com"}function isEmptyObject(e){var t;for(t in e)return!1;return!0}function setupWebViewJavascriptBridge(e){if(android)window.WebViewJavascriptBridge?e(WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){(new Date).getTime();$("#log").html(),e(WebViewJavascriptBridge)},!1);else{if(window.WebViewJavascriptBridge)return e(WebViewJavascriptBridge);if(window.WVJBCallbacks)return window.WVJBCallbacks.push(e);window.WVJBCallbacks=[e];var t=document.createElement("iframe");t.style.display="none",t.src="https://__bridge_loaded__",document.documentElement.appendChild(t),setTimeout(function(){document.documentElement.removeChild(t)},0)}}function OCJSJAVA(e,t,i,n){var o=new Object;(new Date).getDate();setupWebViewJavascriptBridge(function(r){index++,android&&1==index&&r.init(),r.callHandler("webCallApp",{iNeed:"you",uri:e},function(e){o=e,android&&(o=JSON.parse(o)),i&&!isEmptyObject(i)&&$.extend(o,i),n?t(o,n):t(o)})})}function appShareWX(e){e.topName&&""!=e.topName||(e.topName=""),e.title&&""!=e.title||(e.title=""),e.image&&""!=e.image||(e.image=""),e.describe&&""!=e.describe||(e.describe=""),e.shareurl&&""!=e.shareurl||(e.shareurl=""),$("#sharelog").html("0"+JSON.stringify(e)),setupWebViewJavascriptBridge(function(t){$("#sharelog").html("1"+JSON.stringify(e)),t.callHandler("webCallApp",{topName:e.topName,title:e.title,image:e.image,describe:e.describe,shareurl:e.shareurl},function(e){JSON.stringify(e)})})}function deleteOs(e,t,i){i||(i=new Object),isWechat?_unionid&&""!=_unionid?(i._unionid=_unionid,e(i)):getUnionid(search):isApp&&OCJSJAVA(t,e,i)}function setCookie(e,t){var i=new Date;i.setTime(i.getTime()+864e5),document.cookie=e+"="+escape(t)+";expires="+i.toGMTString()}function getCookies(e){for(var t,i=document.cookie.replace(/[ ]/g,"").split(";"),n=0;n<i.length;n++){var o=i[n].split("=");if(e==o[0]){t=unescape(o[1]).substring(0,o[1].length);break}}return t}function delCookie(e){var t=new Date;t.setTime(t.getTime()-1);var i=getCookies(e);null!=i&&(document.cookie=e+"="+i+";expires="+t.toGMTString())}function gettimestamp(){return(new Date).getTime()}function copyToClipboard(e){if(os.ios){var t=document.querySelector("#"),i=document.createRange();i.selectNode(t),window.getSelection().addRange(i);var n=document.execCommand("copy");try{var o=n?"successful":"unsuccessful";console.log("copy is"+o)}catch(e){console.log("Oops, unable to copy")}window.getSelection().removeAllRanges()}else if(os.android){var r=document.createElement("input"),a=document.getElementById(e).innerHTML||document.getElementById(e).value;r.setAttribute("value",a),document.body.appendChild(r),r.select(),document.execCommand("copy"),toast(document.execCommand("copy")),document.body.removeChild(r)}}var ua=this.navigator.userAgent,platform=this.navigator.platform;detect(ua,platform);var android=os.android,index=0,_unionid=getCookies("_unionid"),isApp=os.daodaoclub,isWechat=os.micromessenger,search=getUserid();