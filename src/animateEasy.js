var ae = AE = function(window, undefined) {

    var main = function(selector) {

        if(!(this instanceof ae)){
            return new ae(selector);
        }

        if(typeof selector === 'object'){
            if(selector[0]){
                this.target = Array.prototype.slice.call(selector);
            }
            else{
                this.target = [selector];
            }
        }
        else if(typeof selector === 'string'){
            if(selector[0]==='.'){
                this.target = Array.prototype.slice.call(document.getElementsByClassName(selector.substring(1)));
            }
            else if(selector[0]==='#'){
                this.target = [document.getElementById(selector.substring(1))];
            }
            else{
                this.target = Array.prototype.slice.call(document.querySelectorAll(selector));
            }
        }
        else{
            //错误
        }

        return this
    };


    main.prototype = {

        show:function(){
            console.log(this.target)
        },

        add:function(obj){
            if(!obj[0]){ //需要自动获取第一帧
                var _list = obj[Object.keys(obj)[0]].replace(/\s*/g,'').split(';').map(function(str){
                    return str.replace(/:\w*/,'')
                }),
                    eleCss = window.getComputedStyle(this.target[0],null);
                obj[0] = _list.map(function(str){
                    return str + ':' + eleCss[str]
                }).join(';');
            }

            var list = Object.keys(obj).filter(function(str){
                    return !isNaN(parseInt(str,10))
                }).sort(function(a,b){
                    return a - b
                }),
                styleSheet = document.styleSheets[0],
                lengList = list.length,
                lengTarget = this.target.length,
                id;

            function objToStr(obj){
                return Object.keys(obj).map(function(str){
                    return str + ':' + obj[str];
                }).join(';');
            }

            if(obj.id){ //获取标识符
                id = obj.id;
            }
            else{
                if(!ae.animateNum){
                    ae.animateNum = 0;
                }
                id = 'animate' + ae.animateNum;
                ae.animateNum++;
            }

            for(var n = 0 ;n < lengList ;n++){ //对象关键帧参数转化成字符串
                if(typeof obj[list[n]] === 'object'){
                    obj[list[n]] = objToStr(obj[list[n]])
                }
            }
            for(var i = 0 ,j = i + 1; j < lengList; i++ ,j++){ //开始生成关键帧列表
                var mark = 'aeAni-' + id + '-' + i,
                    engine = '@-webkit-keyframes ' + mark + '{0%{' + obj[list[i]] + '}100%{' + obj[list[j]] +'}}',
                    start = '.' + mark + '{-webkit-animation:' + mark + ' ' + (list[j] - list[i])/1000 + 's}';
                styleSheet.insertRule(engine,0);
                styleSheet.insertRule(start,0);
            }
            for(var m = 0;m < lengTarget;m++){ //绑定动画到对象
                if(!this.target[m].dataset.animate){
                    this.target[m].dataset.animate = mark
                }
                else{
                    this.target[m].dataset.animate = this.target[m].dataset.animate + ' ' + mark;
                }
            }

            return this
        },

        play: function(id){
            var list = this.target,
                leng = this.target.length;
            function play(n){
                var target = list[n],
                    idList = target.dataset.animate.split(' '),
                    animate ,leng ,className ,now;
                function cssEvent(ele,type,fn){
                    ele.addEventListener('webkit' + type ,fn ,false);
                    ele.addEventListener(type.toLowerCase() ,fn ,false)
                }
                function cssEventDel(ele,type,fn){
                    ele.removeEventListener('webkit' + type ,fn ,false);
                    ele.removeEventListener(type.toLowerCase() ,fn ,false)
                }
                function nextKey(){
                    console.log('now:' + now + ' ' + 'leng:' + leng);
                    if(now < leng){
                        now++;
                        target.classList.remove(className + (now - 1));
                        target.classList.add(className + now);
                    }
                    else{
                        target.classList.remove(className + now);
                        cssEventDel(target,'AnimationEnd',nextKey);
                    }
                }
                if(!!id){ //获取播放的动画名
                    animate = idList.filter(function(str){
                        return !!str.match('-' + id + '-')
                    })[0];
                }
                else{
                    animate = idList[idList.length - 1];
                }
                leng = animate.match(/\d+$/g)[0];
                className = animate.replace(/\d+$/g,'');
                now = 0;
                target.classList.add(className + now);
                cssEvent(target,'AnimationEnd',nextKey)
            }
            for(var i = 0;i < leng;i++){
                play(i);
            }
        }
    };

    return main

}(window);