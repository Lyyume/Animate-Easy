ae(".example").add({1000:{right:"200px"}});var render=function(){var a={createBackground:function(){function a(){c.style.transform="translateZ("+f+"px)rotateX("+d+"deg)rotateY("+e+"deg)"}function b(){var a=document.createElement("div"),b=2e3*(.5-Math.random()),d=2e3*(.5-Math.random()),e=400*-Math.random(),f=360*(.5-Math.random()),g=360*(.5-Math.random()),h=360*(.5-Math.random());return a.classList.add("people"),a.style.background="url(./img/F_"+~~(9*Math.random()+1)+".svg)",a.style.transform="translateX( "+b+"px )translateY( "+d+"px )translateZ( "+e+"px )rotateX("+f+"deg) rotateY("+g+"deg) rotateZ("+h+"deg)",c.appendChild(a),ae(a).add({200000:{"margin-top":"-100px",opacity:"0",curve:"linear"}}).play(),a}var c=document.getElementsByClassName("world")[0],d=(document.getElementsByClassName("background")[0],0),e=0,f=0;window.addEventListener("mousemove",function(b){e=20*-(.5-b.clientX/window.innerWidth),d=20*(.5-b.clientY/window.innerHeight),a()});for(var g=0;50>g;g++)b()},eventReg:function(){for(var a=document.getElementsByClassName("button"),b=document.getElementsByClassName("example")[0],c=0,d=a.length;d>c;c++)a[c].addEventListener("mouseenter",function(){var a=document.createElement("div"),b=this.firstChild,c=b.nextSibling,d=c.nextSibling;a.classList.add("mask"),this.appendChild(a),c.classList.add("text-white"),d.classList.add("img-show")}),a[c].addEventListener("mouseleave",function(){var a=document.getElementsByClassName("mask"),b=this.firstChild,c=b.nextSibling,d=c.nextSibling;this.removeChild(a[0]),c.classList.remove("text-white"),d.classList.remove("img-show")});b.addEventListener("click",function(){AE(this).add({2000:{right:"600px"}}).play()})}};return a}();render.createBackground(),render.eventReg();