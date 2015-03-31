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
            throw 'Selector type error!'
        }

        return this
    };


    main.prototype = {

        show: function(){
            console.log(this.target);
            return this.target;
        },

        add: function(obj){

            var target = this.target,
                id ,final,
                list ,styleSheet ,lengList ,lengTarget,
                curve ,mark ,engine ,start;

            function objToStr(obj){
                return Object.keys(obj).map(function(str){
                    return str + ':' + obj[str];
                }).join(';');
            }

            if(obj.id){ //获取标识符与设置
                id = obj.id;
            }
            else{
                if(!ae.animateNum){
                    ae.animateNum = 0;
                }
                id = 'animate' + ae.animateNum;
                ae.animateNum++;
            }
            if(obj.final){
                final = true;
            }

            if(obj[0]){ //处理第一帧
                obj[0] = objToStr(obj[0])
            }
            else{
                var _list = objToStr(obj[Object.keys(obj)[0]]).replace(/\s*/g,'').split(';').map(function(str){
                        return str.replace(/:\w*/,'')
                    }),
                    eleCss = window.getComputedStyle(this.target[0],null);
                obj[0] = _list.map(function(str){
                    return str + ':' + eleCss[str]
                }).join(';');
            }

            list = Object.keys(obj).filter(function(str){ //关键帧列排序
                return !isNaN(parseInt(str,10))
            }).sort(function(a,b){
                return a - b
            });
            styleSheet = document.styleSheets[0];
            lengList = list.length;
            lengTarget = target.length;
            for(var i = 0 ,j = i + 1; j < lengList; i++ ,j++){ //开始生成关键帧列表
                if(typeof  obj[list[j]] === 'object'){
                    curve = obj[list[j]].curve;
                    obj[list[j]] = objToStr(obj[list[j]])
                }
                mark = 'aeAni-' + id + '-' + i;
                engine = '@-webkit-keyframes ' + mark + '{0%{' + obj[list[i]] + '}100%{' + obj[list[j]] +'}}';
                start = '.' + mark + '{-webkit-animation:' + mark + ' ' + (list[j] - list[i])/1000 + 's ';
                if(curve){
                    start += curve;
                    if(final){
                        start += ';-webkit-animation-fill-mode:forwards;}'
                    }
                    else{
                        start += '}'
                    }
                }
                else{
                    if(final){
                        start += ';-webkit-animation-fill-mode:forwards;}'
                    }
                    else{
                        start += '}'
                    }
                }
                styleSheet.insertRule(engine,0);
                styleSheet.insertRule(start,0);
            }

            for(var m = 0;m < lengTarget;m++){ //绑定动画到对象
                if(!target[m].dataset.animate){
                    target[m].dataset.animate = mark;
                }
                else{
                    target[m].dataset.animate = target[m].dataset.animate + ' ' + mark;
                }
            }

            return this
        },

        play: function(id,fn,fn2){

            fn = fn || function(){};
            fn2 = fn2 || function(){};

            var list = this.target,
                leng = list.length,
                _timer,
                timer = 0;

            function cssEvent(ele,type,fn){
                ele.addEventListener('webkit' + type ,fn ,false);
                ele.addEventListener(type.toLowerCase() ,fn ,false)
            }
            function cssEventDel(ele,type,fn){
                ele.removeEventListener('webkit' + type ,fn ,false);
                ele.removeEventListener(type.toLowerCase() ,fn ,false)
            }
            function play(n){
                var target = list[n],
                    idList = target.dataset.animate.split(' '),
                    animate ,leng ,className ,now;
                function nextKey(){
                    if(now < leng){
                        now++;
                        target.classList.remove(className + (now - 1));
                        target.classList.add(className + now);
                    }
                    else{
                        cssEventDel(target,'AnimationEnd',nextKey);
                    }
                }
                if(id){ //获取播放的动画名
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
                target.classList.remove(className + now);
                target.classList.add(className + now);
                cssEvent(target,'AnimationEnd',nextKey);
                return leng
            }
            function check(){
                if(timer == _timer) {
                    fn();
                    cssEventDel(list[0],'AnimationEnd',check);
                }
                fn2();
                timer += 1;
            }

            for(var i = 0;i < leng;i++){
                _timer = play(i);
            }
            cssEvent(list[0],'AnimationEnd',check);


            return this
        },

        pause: function(){

            var target = this.target,
                leng = target.length;

            for(var i = 0;i < leng;i++){
                target[i].style.webkitAnimationPlayState = "paused"
            }

            return this

        },

        run: function(){

            var target = this.target,
                leng = target.length;

            for(var i = 0;i < leng;i++){
                target[i].style.webkitAnimationPlayState = "running"
            }

            return this

        },

        stop: function(id){

            var target = this.target,
                leng = target.length,
                list ,listLeng;

            if(id){
                for(var m = 0; m < leng; m++){
                    target[m].classList.remove(Array.prototype.slice.call(target[m].classList).filter(function(ele){
                        return ele.match('aeAni-' + id + '-')
                    })[0])
                }
            }
            else{
                for(var n = 0; n < leng ; n++){
                    list = Array.prototype.slice.call(target[n].classList).filter(function(ele){
                        return ele.match('aeAni-');
                    });
                    listLeng = list.length;
                    for(var i = 0; i < listLeng; i++){
                        target[n].classList.remove(list[i]);
                    }
                    target[n].style.webkitAnimationPlayState = ""
                }
            }
        },

        clear: function(){

            var target = this.target,
                leng = target.length,
                classList ,classLeng;

            for(var i = 0 ; i < leng ; i++){
                classList = Array.prototype.slice.call(target[i].classList).filter(function(ele){
                    return ele.match('aeAni-');
                });
                classLeng = classList.length;
                for(var n = 0; n < classLeng; n++){
                    target[i].classList.remove(classList[n]);
                }
            }

        }

    };

    return main

}(window);