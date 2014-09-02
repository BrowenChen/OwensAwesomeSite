var maps = Array();
var coordinates = Array();
(function($)
{
	/**********************************************************************/

	var Cascade=function(cascade,page,paginationPage,paginationLastPage,openHome)
	{
		/******************************************************************/

		var $this=this;

		$this.cascade=$(cascade);
		$this.cascadeWindow=cascade.find('.cascade-window');
		$this.cascadeElement=cascade.find('.cascade-menu li');
		$this.cascadeNavigation=cascade.find('.cascade-navigation');

		$this.enable=false;

		$this.currentHash='';
		$this.previousHash=(config.ajax ? '#!/main' : '');
		
		$this.page=page;

		$this.currentPage=-1;
		$this.previousPage=-1;
		
		$this.paginationPage = paginationPage;
		$this.paginationLastPage = paginationLastPage;
		
		$this.openHome = openHome;
		
		$this.scrollbar='';

		/******************************************************************/

		this.load=function()
		{
			$(window).unbind('hashchange');
			$(window).unbind("popstate");
			if($this.paginationLastPage!=1)
				$this.createNavigation(($this.paginationPage-1==0 ? $this.paginationLastPage : $this.paginationPage-1) + "p/", ($this.paginationPage+1>$this.paginationLastPage ? 1 : $this.paginationPage+1) + "p/");
						
			var i=0;
			
			if(history.pushState && config.ajax)
			{
				$(".cascade-navigation, .cascade-window-close-bar a, .header-logo-link:not([href^='http']), .cascade_header_menu a:not([href^='http']), .link_once").unbind("click");
				$(".cascade-navigation, .cascade-window-close-bar a, .header-logo-link:not([href^='http']), .cascade_header_menu a:not([href^='http']), .link_once").click(function(event){
					event.preventDefault();
					var url = $(this).attr("href");
					$this.doHashHTML5({
						'url': url
					});
				});
			}
			
			$this.cascadeElement.each(function() 
			{
				if(history.pushState && config.ajax)
				{
					$(this).children("a:not([href^='http'])").unbind("click");
					$(this).children("a:not([href^='http'])").click(function(event){
						event.preventDefault();
						var url = $(this).attr("href");
						$this.doHashHTML5({
							'url': url
						});
					});
				}
				var image=$(document.createElement('img'));	
				var url=$(this).css('background-image').substring(4);
				
				url=url.substring(0,url.length-1).replace(/"/ig,'');
				
				if($.browser.msie) image.attr('src',url+'?i='+getRandom(1,10000));
				else image.attr('src',url);
				
				$(image).bind('load',function() 
				{
					if((++i)==$this.cascadeElement.length)
					{
						$this.cascade.removeClass('preloader');
						$this.cascadeElement.css('display','block');
						
						var hrefSplit = document.location.href.replace(new RegExp(config.home_url, 'g'), "").split("/");
						hrefSplit = $.grep(hrefSplit,function(n){
							return(n);
						});
						if(typeof(config.home_page_link)!='undefined' && openHome==1 && (hrefSplit=='' || hrefSplit=='main' || hrefSplit[hrefSplit.length-1]=='main'))
						{
							if(config.ajax && history.pushState)
								$this.doHashHTML5({
									'url': config.home_page_link
								});
							else if(config.ajax)
								window.location.hash = '#!/' + config.home_page_link;
							var paginationPage = 0;
							var j = 0;
							for(var id in $this.page)
							{
								j++;
								if(id==config.home_page_link || decodeURIComponent(id)==config.home_page_link)
									paginationPage = Math.ceil(j/4);
							};
							if(paginationPage!=$this.paginationPage)
							{
								$.ajax({
									url: config.ajaxurl,
									data: "action=cascade_paging&cascade_page=" + paginationPage,
									dataType: "json",
									success: function(json){
										if(json.isOk)
										{
											$(".cascade-menu").html(json.html);
											var page = new Object();
											var i = 0;
											for(i; i<json.links_config.link.length; i++)
												page[json.links_config["link"][i]] = {tab:"cascade-portfolio-" + json.links_config["post_id"][i], active: json.links_config["active"][i], main:1};
											for(i=0; i<json.links_config.link_full_width.length; i++)
												page[json.links_config["link_full_width"][i]] = {tab:"cascade-portfolio-" + json.links_config["fw_post_id"][i], active: parseInt(json.links_config["fw_active"][i]), main:0, color: json.links_config["color"][i], full_width: true};
											$(".cascade").cascade(page, parseInt(paginationPage), parseInt(json.lastPage), 1);
											if(!history.pushState)
												window.location.href='#!/main';
											else
											{
												$this.doHashHTML5({
													'url': 'main'
												});
											}
											$this.showPreloader(true);
										}
									}
								});
							}
						}
						else
							openHome = 0;
						if(paginationPage==$this.paginationPage || typeof(paginationPage)=='undefined')
						{
							$this.openAnimation({
								animation: (parseInt(config.home_page_link)>0 && openHome==1 ? 'disable' : ''),
								disableHash: (parseInt(config.home_page_link)>0 && openHome==1 ? 1 : 0)
							});
							if(parseInt(config.home_page_link)>0 && openHome==1)
							{
								$this.currentPage = config.home_page_link;
								$this.open(0);
							}
						}
					};			
				});
			});
		};
		
		/******************************************************************/
		
		this.getFirstPage=function()
		{
			for(var key in $this.page) 
			{
				if($this.page[key]['main']==1) return(key);
			};
			
			return;
		};
		
		/******************************************************************/
		
		this.getPrevPage=function()
		{
			var prev='';
			for(var key in $this.page)
			{
				if(key==$this.currentPage && prev!='') return(prev);
				else if($this.page[key]['main']==1) prev=key;
			};

			return(prev);
		};

		/******************************************************************/

		this.getNextPage=function()
		{
			var n=false;
			var next=$this.getFirstPage();

			for(var key in $this.page)
			{
				if(n) 
				{
					if($this.page[key]['main']==1) return(key);
				};
				if(key==$this.currentPage) n=key;
			};

			return(next);
		};
		
		/******************************************************************/

		this.getPage=function(key,property)
		{
			if(typeof($this.page[key])!="undefined")
				return($this.page[key][property]);
			else
				return false;
		};
		
		/******************************************************************/
		
		this.doHashHTML5=function(data)
		{
			history.pushState("", "title", config.home_url + "/" + data.url.replace("#!/", "").replace(new RegExp(config.home_url + "/", 'g'), ""));
			$(window).trigger("popstate", 1);
		};
		
		/******************************************************************/
		
		this.popstateFunction=function(event, param)
		{
			var hrefSplit = document.location.href.replace(new RegExp(config.home_url, 'g'), "").split("/");
			hrefSplit = $.grep(hrefSplit,function(n){
				return(n);
			});
			$this.currentHash = "#!/";
			for(i in hrefSplit)
				$this.currentHash += hrefSplit[i] + ((parseInt(i)+1)<hrefSplit.length ? "/" : "");
			$this.doHash();
			$this.previousHash=$this.currentHash;
		}
		
		/******************************************************************/
		
		this.handleHashHTML5=function(data)
		{
			if(config.ajax)
				$(window).bind("popstate", $this.popstateFunction).trigger("popstate", 1);
			else
				$this.popstateFunction();
		};
		
		/******************************************************************/

		this.doHash=function(data)
		{
			if(!$this.enable || (typeof(data)!='undefined' && typeof(data.disableHash)!='undefined' && data.disableHash==1)) return;
			$this.enable=false;
			
			var open=$this.isOpen();
			var currentPage=$this.checkHash();
			if(currentPage==false) 
			{
				$this.enable=true;
				var found = false;
				for(var i=0; i<config.link_full_width.length; i++)
				{
					if('#!/' + config["link_full_width"][i]==$this.currentHash)
					{
						found = true;
						currentPage = config["link_full_width"][i];
						break;
					}
				}
				if(!found)
					return(false);
			}
			$this.currentPage=currentPage;
			if($this.previousPage==-1) 
				$this.previousPage=$this.currentPage;
			if($this.currentPage==-1) $this.close();
			else if(open) $this.close({'onComplete':function() { $this.open(); }});
			else $this.open(); 
		};
		
		/******************************************************************/
		
		this.handleHash=function(data)
		{
			if(window.location.hash=='' && config.ajax) window.location.href='#!/main';

			$this.currentHash=window.location.hash;
			if($this.currentHash!=$this.previousHash)
			{
				$this.doHash({
					disableHash: (typeof(data.disableHash)!='undefined' ? data.disableHash==1 : 0)
				});
				$this.previousHash=$this.currentHash;
			}

			$(window).bind('hashchange',function(event) 
			{
				event.preventDefault();
				if($this.isEnable()==false) return;

				$this.currentHash=window.location.hash;
				$this.doHash();
				$this.previousHash=$this.currentHash;
			}); 		
		};
		
		/******************************************************************/
		
		this.checkHash=function()
		{
			if($this.currentHash=='#!/main')
				return(-1);
				
			var splittedHash = $this.currentHash.split("/");
			var splittedHashScroll = $this.currentHash.split("#");
			if($this.previousHash!='')
				var splittedHashPrevious = $this.previousHash.split("#");
			if(($this.previousHash=='' && splittedHashScroll.length==3 && $this.isOpen()) || ($this.previousHash!='' && splittedHashScroll.length==3 && splittedHashPrevious[0]+splittedHashPrevious[1]==splittedHashScroll[0]+splittedHashScroll[1]))
			{
				if($("#" + splittedHashScroll[2]).length)
				{
					$this.destroyScrollbar();
					$this.scrollbar = $('.cascade-window-content').jScrollPane({maintainPosition:true,autoReinitialise:false}).data('jsp');
					$this.scrollbar.scrollToElement($("#" + splittedHashScroll[2]), true);
				}
			}
			else
			{
				var paginationPage = 0;
				var i = 0;
				for(var id in $this.page)
				{
					i++;
					if((id==splittedHash[1] || decodeURIComponent(id)==splittedHash[1]) && !$this.page[id].full_width)
						paginationPage = Math.ceil(i/4);
				};
				if(paginationPage>config.lastPage)
					paginationPage = 0;

				//inside tab pagination
				if(typeof(splittedHash[2])!="undefined" && splittedHash[2].substr(0,4)=="page")
				{
					if($this.isOpen())
					{
						$this.setMenuSelectedPosition();
						return $this.getPageContent({
							name: (splittedHash[1].indexOf("#")!=-1 ? splittedHash[1].substr(0, splittedHash[1].indexOf("#")) : splittedHash[1]),
							paged: parseInt(splittedHash[2].split("-")[1])
						});
					}
				}
				//blog category
				else if(typeof(splittedHash[2])!="undefined" && splittedHash[2].substr(0,8)=="category")
				{
					if($this.isOpen())
					{
						$this.setMenuSelectedPosition();
							var	data = {
							name: (splittedHash[1].indexOf("#")!=-1 ? splittedHash[1].substr(0, splittedHash[1].indexOf("#")) : splittedHash[1]),
							category_id: parseInt(splittedHash[2].split("-")[1])
						};
						if(typeof(splittedHash[3])!="undefined" && splittedHash[3].substr(0,4)=="page")
							data.paged = parseInt(splittedHash[3].split("-")[1]);
						return $this.getPageContent(data);
					}
				}
				//child page pagination
				else if(typeof(splittedHash[2])!="undefined" && splittedHash[2]!="" && typeof(splittedHash[3])!="undefined" && splittedHash[3].substr(0,4)=="page")
				{
					if($this.isOpen())
					{
						$this.setMenuSelectedPosition();
						return $this.getPageContent({
							name: (splittedHash[2].indexOf("#")!=-1 ? splittedHash[2].substr(0, splittedHash[2].indexOf("#")) : splittedHash[2]),
							parent_name: splittedHash[1],
							paged: parseInt(splittedHash[3].split("-")[1]),
							type: 'get_comments'
						});
					}
				}
				//child page
				else if(typeof(splittedHash[2])!="undefined" && splittedHash[2]!="")
				{
					if($this.isOpen())
					{
						$this.setMenuSelectedPosition();
						return $this.getPageContent({
							name: (splittedHash[2].indexOf("#")!=-1 ? splittedHash[2].substr(0, splittedHash[2].indexOf("#")) : splittedHash[2]),
							parent_name: splittedHash[1]
						});
					}
				}

				if(paginationPage==0)
					paginationPage = parseInt($this.currentHash.split("/")[1]);
				if(paginationPage!=$this.paginationPage)
				{
					if($this.isOpen())
					{
						$this.close({
							onComplete: function(){
								return $this.changePaginationPage(paginationPage);
							}
						});
					}
					else
						return $this.changePaginationPage(paginationPage);
				}
				else
				{
					for(var id in $this.page)
					{
						if(id==splittedHash[1] || decodeURIComponent(id)==splittedHash[1])
							return(id);
					};
				}
			}
			return(false);
		};
		
		/******************************************************************/
		
		this.changePaginationPage=function(paginationPage)
		{
			if(parseInt(paginationPage)>0)
			{
				$this.closeAnimation({
					onComplete: function(){
						$.ajax({
							url: config.ajaxurl,
							data: "action=cascade_paging&cascade_page=" + paginationPage,
							dataType: "json",
							success: function(json){
								if(json.isOk)
								{
									$(".cascade-menu").html(json.html);
									var page = new Object();
									var i = 0;
									for(i; i<json.links_config.link.length; i++)
										page[json.links_config["link"][i]] = {tab:"cascade-portfolio-" + json.links_config["post_id"][i], active: json.links_config["active"][i], main:1};
									for(i=0; i<json.links_config.link_full_width.length; i++)
										page[json.links_config["link_full_width"][i]] = {tab:"cascade-portfolio-" + json.links_config["fw_post_id"][i], active: parseInt(json.links_config["fw_active"][i]), main:0, color: json.links_config["color"][i], full_width: true};
									$(".cascade").cascade(page, parseInt(paginationPage), parseInt(json.lastPage), 0);
									var splittedHash = $this.currentHash.split("/");
									for(var id in $this.page)
									{
										if(id==splittedHash[1] || decodeURIComponent(id)==splittedHash[1])
											return(id);
									};
									if(!history.pushState)
										window.location.href='#!/main';
									else
									{
										$this.doHashHTML5({
											'url': 'main'
										});
									}
									return(false);
								}
							}
						});
					}
				});
			}
			return(false);
		};
		
		/******************************************************************/
		
		this.getPageContent=function(data)
		{
			if(data.type!='get_comments')
				$this.showPreloader(true);
			data.action = 'cascade_get_content';

			if(config.ajax)
			{
				$.get(config.ajaxurl, data, function(json) 
				{
					if(data.type=='get_comments')
					{
						$("#cascade_comments").html(json.html);
						$(".cascade_pagination a").click(function(event){
							event.preventDefault();
							var url = $(this).attr("href");
							$this.doHashHTML5({
								'url': url
							});
						});
						$this.scrollbar =  $('.cascade-window-content').jScrollPane({maintainPosition:true,autoReinitialise:false}).data('jsp');
						$this.scrollbar.reinitialise();
						return(false);
					}
					else
					{
						$this.destroyScrollbar();
						if(typeof(json.cf7)!="undefined" && json.cf7!="")
						{
							$('.cascade-window-content').html(json.html);
							$.getScript(json.cf7, function(){
								$this.setTabContent();
								return(false);
							});
						}
						else
						{
							$('.cascade-window-content').html(json.html);
							$this.setTabContent();
							return(false);
						}
					}
				},
				'json');
			}
			else
				$this.setTabContent();
			return(false);
		}
		
		this.setMenuSelectedPosition=function()
		{
			$(".cascade_header_menu a.selected").removeClass("selected");
			var splittedHash = $this.currentHash.split("#");
			if(typeof(splittedHash[1])!="undefined")
				$(".cascade_header_menu").find('[href$="' + splittedHash[1] + '"]').addClass("selected");
		}
		
		/******************************************************************/
		
		this.openAnimation=function(data)
		{
			var j=0;
			var openSpeed = (typeof(data.animation)!='undefined' && data.animation=='disable' ? 0 : 1000);
			var closeSpeed = (typeof(data.animation)!='undefined' && data.animation=='disable' ? 0 : 500);
			var delay = (typeof(data.animation)!='undefined' && data.animation=='disable' ? 0 : 200);
			$this.cascadeElement.each(function(index) 
			{
				if(config.animation_type=="fade")
				{
					$(this).css("height", "468px").delay(delay*index).animate({opacity:1},openSpeed,function()
					{
						if((++j)==$this.cascadeElement.length)
						{
							if(typeof(data)!='undefined' && typeof(data.onComplete)!='undefined') data.onComplete.apply();
							$this.enable=true;
							if(config.ajax)
							{
								if(history.pushState)
									$this.handleHashHTML5();
								else
									$this.handleHash({
										disableHash: (typeof(data.disableHash)!='undefined' ? data.disableHash==1 : 0)
									});
							}
							else
								$this.handleHashHTML5();
						};
					});
				}
				else
				{
					$(this).delay(delay*index).animate({height: "468px", opacity:1},closeSpeed,'easeInOutQuad',function()
					{
						if((++j)==$this.cascadeElement.length)
						{
							if(typeof(data)!='undefined' && typeof(data.onComplete)!='undefined') data.onComplete.apply();
							$this.enable=true;
							if(config.ajax)
							{
								if(history.pushState)
									$this.handleHashHTML5();
								else
									$this.handleHash({
										disableHash: (typeof(data.disableHash)!='undefined' ? data.disableHash==1 : 0)
									});
							}
							else
								$this.handleHashHTML5();
						};
					});
				}
			});
		};
		
		/******************************************************************/
		
		this.closeAnimation=function(data)
		{
			var j=0;
			$this.cascadeElement.each(function(index){
				if(config.animation_type=="fade")
				{
					$(this).animate({opacity:0},500,function()
					{
						if((++j)==$this.cascadeElement.length)
							if(typeof(data)!='undefined' && typeof(data.onComplete)!='undefined') data.onComplete.apply();
							
					});
				}
				else
				{
					$(this).animate({height: "0px", opacity:0},500,'easeInOutQuad',function()
					{
						if((++j)==$this.cascadeElement.length)
							if(typeof(data)!='undefined' && typeof(data.onComplete)!='undefined') data.onComplete.apply();
							
					});
				}
			});
		};

		/******************************************************************/
		
		this.setTabContent=function()
		{
			var splittedHash = $this.currentHash.split("#");
			if(splittedHash.length==3 && $("#" + splittedHash[2]).length)
			{
				$this.scrollbar =  $('.cascade-window-content').jScrollPane({maintainPosition:true,autoReinitialise:false}).data('jsp');
				$this.scrollbar.scrollToElement($("#" + splittedHash[2]), true);
			}
			else
				$this.createScrollbar();
			
			$this.showPreloader(false);
			
			if($this.getPage($this.currentPage, 'full_width'))
				$this.showNavigation(false);
			else
				$this.showNavigation(true);
			
			//slider
			$('.slider').nivoSlider({directionNav:false});
			
			//portfolio
				
			/**************************************************************************/
			
			$('.fancybox-image a').attr("rel", "gallery");
			$('.fancybox-image a').fancybox({
				'titlePosition': 'inside'
			});
			
			/**************************************************************************/
			$('.fancybox-video a').bind('click',function() 
			{
				$.fancybox(
				{
					//'padding':0,
					'autoScale':false,
					'titlePosition': 'inside',
					'title': this.title,
					'transitionIn':'none',
					'transitionOut':'none',
					'width':(this.href.indexOf("vimeo")!=-1 ? 600 : 680),
					'height':(this.href.indexOf("vimeo")!=-1 ? 338 : 495),
					'href':(this.href.indexOf("vimeo")!=-1 ? this.href : this.href.replace(new RegExp("watch\\?v=", "i"), 'embed/')),
					'type':'iframe',
					'swf':
					{
						'wmode':'transparent',
						'allowfullscreen':'true'
					}
				});

				return false;
			});
			
			/**************************************************************************/
			
			$(".fancybox-iframe a").fancybox({
				'width' : '75%',
				'height' : '75%',
				'autoScale' : false,
				'titlePosition': 'inside',
				'type' : 'iframe'
			});

			/**************************************************************************/

			$('.gallery-list img').captify();

			/**************************************************************************/

			$('.gallery-list').hover(

				function() {},
				function()
				{
					$(this).find('li img').animate({opacity:1},250);
				}	
				
			);
				
			/**************************************************************************/

			$('.gallery-list li').hover(

				function() 
				{
					$(this).siblings('li').find('img').css('opacity',0.5);
					$(this).find('img').animate({opacity:1},250);
				},

				function()
				{
					$(this).find('img').css('opacity',1);	
				}
				
			);
				
			/**************************************************************************/
			
			$('.skill-list-item-level span').each(function(index) 
			{
				$(this).delay(index*50).animate({opacity:1},500);
			});

			/**************************************************************************/
			
			//map
			if(!config.ajax)
			{
				for(i in maps)
				{
					google.maps.event.trigger(maps[i], 'resize');
					maps[i].setCenter(coordinates[i]);
				}
			}
			
			$this.enable=true;

			$this.previousPage=$this.currentPage;
			splittedHash = $this.currentHash.split("/");
			if(typeof(splittedHash[2])!="undefined")
				$('#'+$this.getPage($this.currentPage,'tab')+' a').attr('href',(config.ajax ? (!history.pushState ? '#!/' : '') + (splittedHash[1].indexOf("#")!=-1 ? splittedHash[1].substr(0, splittedHash[1].indexOf("#")) : splittedHash[1]) : config.home_url));
			else
				$('#'+$this.getPage($this.currentPage,'tab')+' a').attr('href',(config.ajax ? (!history.pushState ? '#!/' : '') + 'main' : config.home_url));
			
			if(config.ajax && history.pushState)
			{
				$(".cascade-window-close-bar a").attr("href", "main");
				$(".cascade_post_title a, .cascade_post_more, .cascade_post_category a, .cascade_pagination a, .cascade_post_comment a, .cascade_bread_crum a, .cascade_post_list .cascade_post_thumb, .link").click(function(event){
					event.preventDefault();
					var url = $(this).attr("href");
					$this.doHashHTML5({
						'url': url
					});
				});
			}
			
			$this.createNavigation($this.getPrevPage(), $this.getNextPage());
		};

		this.open=function(animationSpeed)
		{
			var animationSpeed = (typeof(animationSpeed)!="undefined" ? animationSpeed : 500);
			var i=0;
			var tab=$this.getPage($this.currentPage,'tab');
			$('#'+tab).css('z-index',2);
			if($this.getPage($this.currentPage,'active')==1)
				$('#'+tab).addClass('cascade-active');
			
			$this.setMenuSelectedPosition();
			
			var opacity = 1;
			if($this.getPage($this.currentPage, 'full_width'))
				opacity = 0;
			
			$this.cascadeElement.animate({left:0, opacity:opacity},animationSpeed,'easeOutExpo',function(data) 
			{
				i++;
				if(i==$this.cascadeElement.length)
				{
					var width = '640px';
					var left = '220px';
					if($this.getPage($this.currentPage, 'full_width'))
					{
						width = '100%';
						left = 0;
					}
					$this.cascadeWindow.css({'opacity':'0', 'display':'block', 'left':left}).attr('class','cascade-window ' + (typeof($('#'+tab).attr('class'))!='undefined' ? $('#'+tab).attr('class') : 'cascade-color-' + $this.getPage($this.currentPage,'color')));

					if($this.getPage($this.currentPage, 'full_width'))
						$this.cascadeWindow.addClass("full_width");
					else
						$this.cascadeWindow.removeClass("full_width");
					
					$this.cascadeWindow.animate({width:width, 'opacity': '1'},animationSpeed,'easeInOutQuad',function()
					{
						$this.showPreloader(true);
						
						var splittedHash = $this.currentHash.split("/");
						//inside tab pagination
						if(typeof(splittedHash[2])!="undefined" && splittedHash[2].substr(0,4)=="page")
							$this.getPageContent({
								name: (splittedHash[1].indexOf("#")!=-1 ? splittedHash[1].substr(0, splittedHash[1].indexOf("#")) : splittedHash[1]),
								paged: parseInt(splittedHash[2].split("-")[1])
							});
						//blog category
						else if(typeof(splittedHash[2])!="undefined" && splittedHash[2].substr(0,8)=="category")
						{
							var	data = {
								name: (splittedHash[1].indexOf("#")!=-1 ? splittedHash[1].substr(0, splittedHash[1].indexOf("#")) : splittedHash[1]),
								category_id: parseInt(splittedHash[2].split("-")[1])
							};
							if(typeof(splittedHash[3])!="undefined" && splittedHash[3].substr(0,4)=="page")
								data.paged = parseInt(splittedHash[3].split("-")[1]);
							$this.getPageContent(data);
						}
						//child page pagination
						else if(typeof(splittedHash[2])!="undefined" && splittedHash[2]!="" && typeof(splittedHash[3])!="undefined" && splittedHash[3].substr(0,4)=="page")
							$this.getPageContent({
								name: (splittedHash[2].indexOf("#")!=-1 ? splittedHash[2].substr(0, splittedHash[2].indexOf("#")) : splittedHash[2]),
								parent_name: splittedHash[1],
								paged: parseInt(splittedHash[3].split("-")[1])
							});
						//child page
						else if(typeof(splittedHash[2])!="undefined" && splittedHash[2]!="")
							$this.getPageContent({
								name: (splittedHash[2].indexOf("#")!=-1 ? splittedHash[2].substr(0, splittedHash[2].indexOf("#")) : splittedHash[2]),
								parent_name: splittedHash[1]
							});
						else
						{
							if(config.ajax)
							{
								$.get(config.ajaxurl,{action: 'cascade_get_content', name: splittedHash[1]},function(json) 
								{			
									if(typeof(json.cf7)!="undefined" && json.cf7!="")
									{
										$('.cascade-window-content').html(json.html);
										$.getScript(json.cf7, function(){
											$this.setTabContent();
										});
									}
									else
									{
										$('.cascade-window-content').html(json.html);
										$this.setTabContent();
									}
									
								},
								'json');
							}
							else
								$this.setTabContent();
						}
					});
				};
			});
		};
		
		/******************************************************************/
		
		this.close=function(data)
		{
			$(':input,a').qtip('destroy');
			var tab=$this.getPage($this.previousPage,'tab');
			if(tab!=false)
			{
				if($this.getPage($this.previousPage,'active'))
					$('#'+tab).removeClass('cascade-active');
				$this.destroyScrollbar();
				if($this.paginationLastPage!=1)
				{
					$this.createNavigation(($this.paginationPage-1==0 ? $this.paginationLastPage : $this.paginationPage-1) + "p/", ($this.paginationPage+1>$this.paginationLastPage ? 1 : $this.paginationPage+1) + "p/");
					$this.showNavigation(true);
				}
				else
					$this.showNavigation(false);
				$('.cascade-window-content').html('');
				
				if($this.previousPage!='-1')
					$('#'+tab+' a').attr('href','#!/'+$this.previousPage);
				
				$this.cascadeWindow.animate({width:'0px',opacity:0},500,'easeInOutQuad',function() 	
				{
					$this.cascadeWindow.css('display','none');
					$this.expand(data);
					$(".cascade_header_menu a.selected").removeClass("selected");
				});
			}
			else
				$this.expand(data);
		};
		
		/******************************************************************/

		this.expand=function(data)
		{
			var counter=0,done=0,left=-200;

			$this.cascadeElement.each(function() 
			{
				$(this).css('z-index',1);
				left+=200+((counter++)>0 ? 20 : 0);

				$(this).animate({left:left, opacity: 1},500,'easeOutExpo',function()
				{
					done++;
					if(done==$this.cascadeElement.length)
					{
						if(typeof(data)!='undefined')
						{
							if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
							else $this.enable=true;
						}
						else $this.enable=true;
					};
				});
			});
		};
		
		/******************************************************************/
		
		this.isOpen=function()
		{
			return($this.currentPage==-1 ? false : true);
		};
		
		/******************************************************************/
		
		this.isEnable=function()
		{
			if(!$this.enable)
			{
				window.location.href=$this.previousHash;
				return(false);
			}  
			
			return(true);
		};

		/***********************************************************/

		this.createNavigation=function(prev, next)
		{
			$this.cascade.find('.cascade-navigation-prev').attr('href',(config.ajax ? '#!/' : '')+prev);
			$this.cascade.find('.cascade-navigation-next').attr('href',(config.ajax ? '#!/' : '')+next);
		};

		/******************************************************************/

		this.showNavigation=function(show)
		{
			if($this.cascadeElement.length>1)
				$this.cascadeNavigation.css('display',show ? 'block' : 'none');
		};

		/******************************************************************/

		this.showPreloader=function(show)
		{
			if(show) $this.cascadeWindow.addClass('cascade-window-prealoder');
			else $this.cascadeWindow.removeClass('cascade-window-prealoder');
		};

		/******************************************************************/
		
		this.createScrollbar=function()
		{
			$this.scrollbar=$('.cascade-window-content').jScrollPane({maintainPosition:false,autoReinitialise:false}).data('jsp');
		};
		
		/******************************************************************/

		this.destroyScrollbar=function()
		{
			if($this.scrollbar!='') 
			{
				$this.scrollbar.destroy();
				$this.scrollbar='';
			};			  
		};

		/******************************************************************/
	};

	/**************************************************************/

	$.fn.cascade=function(page,paginationPage,paginationLastPage, openHome)
	{
		/***********************************************************/

		var cascade=new Cascade(this,page,paginationPage,paginationLastPage, openHome);
		cascade.load();

		/***********************************************************/
	};

	/**************************************************************/

})(jQuery);