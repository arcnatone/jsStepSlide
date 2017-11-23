/* 
# ------------
#
# jsStepSlide
#
#
# Author : Ji-seop
# Last Update : 2017-10-20
# Options : margin(px), showItem(int), speed(ms), time(ms), auto(boolean), control(boolean), button(boolean)
#
#-------------
*/
(function($){
	/* Step Slider */
	$.fn.jsStepSlide = function(options){
		var slideObj = $(this);
		var slideArr = new Array();
		var defaults = new Array();
		defaults = {
			margin : 20,
			showItem : 5,
			speed : 450,
			time : 5000,
			auto : true,
			control : true,
			button : true
		};
		var options = $.extend({}, defaults, options);

		slideArr = {
			area : slideObj,
			wrap : slideObj.find(".slide-wrap"),
			list : slideObj.find(".slide-list"),
			listLength : slideObj.find(".slide-list").find(".slide-item").length,
			item : slideObj.find(".slide-list").find(".slide-item"),
			itemWidth : slideObj.find(".slide-list").find(".slide-item").outerWidth(),
			state : false,
			prevIdx : 0,
			nextIdx : 0,
			animation : $.noop,
			controller : null,
			buttonObj : null,
			nextBtn : null,
			prevBtn : null,
			options : options
		};

		// Value Check
		function valueCheck(obj){
			if(typeof obj != "undefined" && obj != null && obj != ""){
				return false;		
			}else if(!isNaN(obj)){
				return false;
			}else{
				return true;
			}
		}

		// Controller Setting
		function appendController(){
			var controller = "";
			controller += "<ul class='slide-controller'>";
			for(var i=0; i < Math.ceil(slideArr.listLength/slideArr.options.showItem); i++){
				if(i==0){
					controller += "<li class='on'>"+(i+1)+"</li>";
				}else{
					controller += "<li>"+(i+1)+"</li>";
				}
			}
			controller += "</ul>";
			slideArr.wrap.append(controller);
		}
		// Buttons Setting
		function appendButtons(){
			var buttons = "";
			buttons += "<div class='btn-prev'>이전</div>";
			buttons += "<div class='btn-next'>다음</div>";
			slideArr.wrap.append(buttons);
		}
		
		// Default Setting
		slideArr.list.css("height", slideArr.item.outerHeight());
		slideArr.item.each(function(i){
			var thisObj = $(this);
			var thisLeftOffset = parseFloat(thisObj.css("left"));

			if(i < slideArr.options.showItem){
				thisObj.show().css("left", i%slideArr.options.showItem*(slideArr.itemWidth+slideArr.options.margin));
			}else{
				thisObj.css({"display":"none", "opacity":"0", "left":"100%"})
			}
		});

		if(slideArr.options.control){
			appendController();
			slideArr.controller = slideArr.area.find(".slide-controller");
		}
		if(slideArr.options.button){
			appendButtons();
			slideArr.prevBtn = slideArr.area.find(".btn-prev");
			slideArr.nextBtn = slideArr.area.find(".btn-next");
		}

		// Next Slide
		function nextSlide(idx){
			if(!slideArr.state){
				slideArr.state = true;
				// Auto
				if(slideArr.options.auto){
					stopSlide();
				}

				//console.log("i : "+slideArr.nextIdx);
				if(!valueCheck(idx)){
					if(idx > -1){
						slideArr.nextIdx = idx*slideArr.options.showItem;
					}else{
						slideArr.nextIdx = (Math.ceil(slideArr.listLength/slideArr.options.showItem)-1)*slideArr.options.showItem;
					}
				}else{
					if(slideArr.nextIdx+(slideArr.options.showItem) >= slideArr.listLength){
						slideArr.nextIdx = 0;
					}else{
						slideArr.nextIdx = slideArr.nextIdx+slideArr.options.showItem;
					}
				}
				//console.log("o : "+slideArr.nextIdx);

				if(slideArr.options.control){
					slideArr.controller.find("li").eq(slideArr.nextIdx/slideArr.options.showItem).addClass("on").siblings("li.on").removeClass("on");
				}

				slideArr.item.each(function(i){
					// Hide
					var thisObj = $(this);
					if(thisObj.is(":visible") && (i < slideArr.nextIdx || i >= slideArr.nextIdx+slideArr.options.showItem)){
						//console.log("h : "+i);
						var thisLeftOffset = parseFloat(thisObj.css("left"));
						thisObj.stop().delay(i%slideArr.options.showItem*100).animate({"left":thisLeftOffset-50, "opacity":0}, slideArr.options.speed, "swing", function(){
							thisObj.css("left", "100%").hide();
						});
					}
					// Show
					if(!thisObj.is(":visible") && (i >= slideArr.nextIdx && i < slideArr.nextIdx+slideArr.options.showItem)){
						//console.log("v : "+i);
						thisObj.css("left", i%slideArr.options.showItem*(slideArr.itemWidth+slideArr.options.margin)+50).show().stop().delay((i%slideArr.options.showItem+3)*100).animate({"left":i%slideArr.options.showItem*(slideArr.itemWidth+slideArr.options.margin), "opacity":1}, slideArr.options.speed, "swing");
					}
				});
				
				setTimeout(function(){
					slideArr.state = false;
					// Auto
					if(slideArr.options.auto){
						autoSlide();
					}
				}, slideArr.options.showItem*100+slideArr.options.speed);
			};
		}

		// Auto Slide
		function autoSlide(){
			slideArr.animation = setInterval(nextSlide, slideArr.options.time);
		}
		// Stop Slide
		function stopSlide(){
			clearInterval(slideArr.animation);
		}
		// Run
		if(slideArr.options.auto){
			autoSlide();
		}

		if(slideArr.options.control){
			slideArr.controller.find("li").on("click", function(){
				if(!slideArr.state && !$(this).hasClass("on")){
					nextSlide($(this).index());
				}
			});
		}

		if(slideArr.options.button){
			slideArr.prevBtn.on("click", function(){
				nextSlide(Math.ceil(slideArr.nextIdx-slideArr.options.showItem)/slideArr.options.showItem);
			});
			slideArr.nextBtn.on("click", function(){
				nextSlide();
			});
		}
	};
}(jQuery));

