(function( $ ) {
    $.widget( "custom.carousel", {
        // default options
        options: {
            //basic display
            orientation: 'vertical',
            classItems:'',
            classCaps:'',
            width:'none',
            height:'none',     
            navigation:{
                ends:'standart',
                endSize:20
            },
            step:3,
            animation:{
                easing:'swing',
                speed:'slow'
            },   
            icons:{
                up: 'ui-icon-circle-triangle-n',
                down: 'ui-icon-circle-triangle-s',
                left: 'ui-icon-circle-triangle-w',
                right: 'ui-icon-circle-triangle-e' 
            },
            //active state
            activeItem:null,
            focusItem:0,
            //callbacks
            hoverItemIn:null,
            hoverItemOut:null,
            hoverCapIn:null,
            hoverCapOut:null,
            click:null,
            //for private use
            classFocus: 'ui-state-hover',
            classDefault: 'ui-state-default',
            classHover: 'ui-state-hover',
            classActive: 'ui-state-active',
            classDisabled: 'ui-state-disabled'

        },  
        _setOption: function( key, value ) {
            if ( key == "focusItem" ) {
                // if user sets new focus item roll to focus
                this.options.focusItem = value;
                this._setview();
            }else{
                this._super( key, value );
            }
        },                     
        _create: function() {
            // adding base class to main container
            this.element.addClass('ui-carousel');
            // and reloading
            this.refresh();  
        },
        recenter: function(){  
            this.element.find('li.ui-carousel-item').each(function(){

                var h = $(this).height(),
                w = $(this).width(),
                ch =  $(this).children(':eq(0)').outerHeight(),         
                cw =  $(this).children(':eq(0)').outerWidth();         
                $(this).children(':eq(0)').css({'margin-left':(w-cw)/2,'margin-top':(h-ch)/2});

            });
        },
        refresh: function(){
            // if width is already set
            if(this.options.width == 'none'){ 
                this.options.width = this.element.width()
            }
            // it height is already set
            if(this.options.height == 'none'){ 
                this.options.height = this.element.height();
            }
            // resize the widget   
            this.element.width(this.options.width).height(this.options.height);
            // declare classBase for easier access
            // create internal li element to contain the list 
            if(this.element.children('li.ui-carousel-items').length ==0){
                this.element.append($('<li class="ui-carousel-items">').append($('<ul class="ui-carousel-items">')));
            }
            // move the elements to the internal list
            this.element.children( "li:not(.ui-carousel-items,.ui-carousel-cap-1,.ui-carousel-cap-2)" ).each( $.proxy(function( i, el ) {

                // Add the class so this option will not be processed next time the list is refreshed
                var $el = $( el ).addClass( 'ui-carousel-item '+ this.options.classDefault +' '+this.options.itemClass);
                // adding 100% width for verticals/height for horizontals
                if(this.options.orientation === 'vertical'){
                    $el.width(this.options.width); 
                }else if(this.options.orientation === 'horizontal'){
                    $el.height(this.options.height); 
                } 
                // adding mouse hover handlers
                $el.hover(  $.proxy(function(eventobject){
                    this._hoverItemIn( eventobject );      
                },this), 
                $.proxy(function(eventobject){ 
                    this._hoverItemOut( eventobject );      
                },this));
                // adding click handler
                $el.click(  $.proxy(function(eventobject){
                    this._onClick(eventobject);  
                },this));
                // move the new item to the internal list
                this.element.find('ul.ui-carousel-items').append($el);
            },this));
            //checking if there shoud be any ends
            if(this.options.navigation.ends == 'standart'){
                //check and making ends as needed
                // adding top/left cap
                if(this.element.children('.ui-carousel-cap-1').length== 0){
                    //apply rounded corners 
                    var icon;
                    if(this.options.orientation === 'vertical'){
                        //todo icons
                        if(typeof(this.options.icons.up) === 'string'){
                            icon = $('<span class="ui-icon '+this.options.icons.up +'">');
                        }else{
                            icon = this.options.icons.up; 
                        }
                    }else if(this.options.orientation === 'horizontal'){
                        //todo icons
                        if(typeof(this.options.icons.left) === 'string'){
                            icon = $('<span class="ui-icon '+this.options.icons.left +'">');
                        }else{
                            icon = this.options.icons.left; 
                        }
                    }
                    this.element.prepend($('<li>').addClass('ui-carousel-cap-1 '+this.options.classCaps +' ' +this.options.classDefault).append(icon));   

                    // adding hover handler to cap
                    this.element.children('li.ui-carousel-cap-1').hover(  $.proxy(function(eventobject){

                        this._hoverCapIn(eventobject );      
                    },this), 
                    $.proxy(function(eventobject){ 
                        this._hoverCapOut(eventobject );      
                    },this));
                }
                // adding bottom/right cap
                if(this.element.children('.ui-carousel-cap-2').length== 0){
                    //apply rounded corners 
                    var icon;
                    if(this.options.orientation === 'vertical'){
                        //todo icons
                        if(typeof(this.options.icons.down) === 'string'){
                            icon = $('<span class="ui-icon '+this.options.icons.down +'">');
                        }else{
                            icon = this.options.icons.down; 
                        }
                    }else if(this.options.orientation === 'horizontal'){
                        //todo icons
                        if(typeof(this.options.icons.right) === 'string'){
                            icon = $('<span class="ui-icon '+this.options.icons.right +'">');
                        }else{
                            icon = this.options.icons.right; 
                        }
                    } 
                    this.element.append($('<li>').addClass('ui-carousel-cap-2 '+this.options.classCaps +' ' +this.options.classDefault).append(icon));   

                    // adding hover handler to cap 
                    this.element.children('li.ui-carousel-cap-2').hover(  $.proxy(function(eventobject){

                        this._hoverCapIn(eventobject );      
                    },this), 
                    $.proxy(function(eventobject){ 
                        this._hoverCapOut(eventobject );          
                    },this));
                }
                if(this.element.hasClass('ui-corner-all')){
                    if(this.options.orientation === 'horizontal'){
                        this.element.children('li.ui-carousel-cap-1').addClass('ui-corner-left')
                        this.element.children('li.ui-carousel-cap-2').addClass('ui-corner-right')
                    }else if(this.options.orientation === 'vertical'){
                        this.element.children('li.ui-carousel-cap-1').addClass('ui-corner-top')
                        this.element.children('li.ui-carousel-cap-2').addClass('ui-corner-bottom')
                    }
                }
                // aranging ends and list 
                this.element.children().css('float','left');
                if(this.options.orientation === 'vertical'){   
                    this.element.children('li.ui-carousel-items').css({'width':this.options.width,'height':this.options.height-(this.options.navigation.endSize*2)});
                    var sumOfChildrenHeight = 0; 
                    this.element.find('ul.ui-carousel-items').children().each(function() 
                    { 
                        sumOfChildrenHeight += $(this).outerHeight(); 
                    });
                    this.element.find('ul.ui-carousel-items').width(this.options.width).height(sumOfChildrenHeight);
                    // getting content height from known outerHeight;
                    var capHeight = this.options.navigation.endSize 
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-top-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-bottom-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-top'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-bottom'));
                    // getting content width from known outerWidth; 
                    var capWidth = this.options.width 
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-left-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-right-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-left'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-right'));

                    this.element.children('li.ui-carousel-cap-1,li.ui-carousel-cap-2').height(capHeight).width(capWidth);
                }else if(this.options.orientation === 'horizontal'){
                    this.element.children('li.ui-carousel-items').css({'width':this.options.width-(this.options.navigation.endSize*2),'height':this.options.height});
                    var sumOfChildrenWidth = 0; 
                    this.element.find('ul.ui-carousel-items').children().each(function() 
                    { 
                        sumOfChildrenWidth += $(this).outerWidth(); 
                    });
                    this.element.find('ul.ui-carousel-items').height(this.options.height).width(sumOfChildrenWidth);
                    // getting content height from known outerHeight;
                    var capHeight = this.options.height 
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-top-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-bottom-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-top'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-bottom'));
                    // getting content width from known outerWidth; 
                    var capWidth = this.options.navigation.endSize 
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-left-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('border-right-width'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-left'))
                    -parseFloat(this.element.children('li.ui-carousel-cap-1').css('padding-right'));

                    this.element.children('li.ui-carousel-cap-1,li.ui-carousel-cap-2').height(capHeight).width(capWidth); 
                }
                // centering the icon on cap1
                var marginX = (this.element.children('li.ui-carousel-cap-1').width()-this.element.children('li.ui-carousel-cap-1').children('span').outerWidth())/2; 
                var marginY =(this.element.children('li.ui-carousel-cap-1').height()-this.element.children('li.ui-carousel-cap-1').children('span').outerHeight())/2; 
                this.element.children('li.ui-carousel-cap-1').children('span').css({'margin-top':marginY,'margin-left':marginX});

                // centering the icon on cap2
                var marginX = (this.element.children('li.ui-carousel-cap-2').width()-this.element.children('li.ui-carousel-cap-2').children('span').outerWidth())/2; 
                var marginY =(this.element.children('li.ui-carousel-cap-2').height()-this.element.children('li.ui-carousel-cap-2').children('span').outerHeight())/2; 
                this.element.children('li.ui-carousel-cap-2').children('span').css({'margin-top':marginY,'margin-left':marginX});

                //adding click handler to caps
                this.element.children('li.ui-carousel-cap-1').click(  $.proxy(function(eventobject){
                    this._viewback(eventobject);      
                },this));
                this.element.children('li.ui-carousel-cap-2').click(  $.proxy(function(eventobject){
                    this._viewforward(eventobject);      
                },this));
            }


            this._setview();


        },
        _viewback:function(event){ 
            this.options.focusItem-=this.options.step;        
            if(this.options.focusItem < 0)this.options.focusItem =0;
            this._setview();

        },
        _viewforward:function(event){ 
            this.options.focusItem+=this.options.step;
            if(this.options.focusItem >  (this.element.find('ul.ui-carousel-items').children().length-1)) this.options.focusItem =this.element.find('ul.ui-carousel-items').children().length-1 ;
            this._setview();     
        },
        //the actual hover methods
        _setview:function(){  
            this.element.find('ul.ui-carousel-items').children().removeClass(this.options.classFocus).addClass(this.options.classDefault);
            this.element.find('ul.ui-carousel-items').children(':eq('+this.options.focusItem+')').removeClass(this.options.classDefault).addClass(this.options.classFocus);
            if(this.options.orientation ==='vertical'){
                var heightContainer=  this.element.find('li.ui-carousel-items').height();
                var heightList=  this.element.find('ul.ui-carousel-items').outerHeight();

                var topFocusItem=    this.element.find('ul.ui-carousel-items').children(':eq('+this.options.focusItem+')').position().top;
                var heightFocusItem =  this.element.find('ul.ui-carousel-items').children(':eq('+this.options.focusItem+')').outerHeight(); 
                var animationTarget = -(topFocusItem+(heightFocusItem/2))+(heightContainer/2);
                if(animationTarget > 0)  animationTarget = 0;
                if(animationTarget < -(heightList-heightContainer))animationTarget = -(heightList-heightContainer);    

                this.element.find('ul.ui-carousel-items').animate({'top':animationTarget},this.options.animation.speed,this.options.animation.easing);
            }else if(this.options.orientation ==='horizontal'){
                var widthContainer=  this.element.find('li.ui-carousel-items').width();
                var widthList=  this.element.find('ul.ui-carousel-items').outerWidth();

                var leftFocusItem=    this.element.find('ul.ui-carousel-items').children(':eq('+this.options.focusItem+')').position().left;
                var widthFocusItem =  this.element.find('ul.ui-carousel-items').children(':eq('+this.options.focusItem+')').outerWidth(); 
                var animationTarget = -(leftFocusItem+(widthFocusItem/2))+(widthContainer/2);
                if(animationTarget > 0)  animationTarget = 0;
                if(animationTarget < -(widthList-widthContainer))animationTarget = -(widthList-widthContainer);    
                this.element.find('ul.ui-carousel-items').animate({'left':animationTarget},this.options.animation.speed,this.options.animation.easing);

            }
            if(this.options.navigation.ends === 'standart'){
                this.element.children('li.ui-carousel-cap-1,li.ui-carousel-cap-2').removeClass(this.options.classDisabled);
                if(this.options.focusItem ===  (this.element.find('ul.ui-carousel-items').children().length-1)){
                    this.element.children('li.ui-carousel-cap-2').addClass(this.options.classDisabled);
                }
                if(this.options.focusItem === 0){
                    this.element.children('li.ui-carousel-cap-1').addClass(this.options.classDisabled);

                }
            }

            this.recenter();
        },
        _onClick:function(event){

            var target = $(event.currentTarget);
            target.siblings().removeClass(this.options.classActive).addClass(this.options.classDefault);
            target.removeClass(this.options.classDefault).addClass(this.options.classActive);
            this.options.focusItem = target.index();
            this._setview();     
            this._trigger( "click", null,  {'target':target,'index':target.index()} );      
        },
        _hoverItemIn:function(event){    
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classDefault);               
            $(target).addClass(this.options.classHover);                         

            this._trigger( "hoverItemIn", null,  {'target':target,'index':target.index()} );      

        },
        _hoverItemOut:function(event){           
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classHover);               
            $(target).addClass(this.options.classDefault);                         
            this._trigger( "hoverItemOut", null,  {'target':target,'index':target.index()} );  
        },
        _hoverCapIn:function(event){    
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classDefault);               
            $(target).addClass(this.options.classHover);                         
            this._trigger( "hoverCapIn", null,  {'target':target} );      
        },
        _hoverCapOut:function(event){           
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classHover);               
            $(target).addClass(this.options.classDefault);                         
            this._trigger( "hoverCapOut", null,  {'target':target} );      

        }
    });
}( jQuery ));
