var bdy = $('body'),
	win = $( window ),
	doc = $( document ),
	wt = parseFloat( win.width() ),
	ht = parseFloat( win.height() ),
	wst = parseFloat( win.scrollTop() ),
	sRatio,
	isMobile = mobile.detect(),
	editableMode = $('.admin-wrapper').length > 0 || $('[editable]').length > 0 ? true : false,
	uty = {
		speed: 666,
		easing: 'easeInOutExpo',
		ani: function( o, callback ){
			var _t = this, ID = o['el'];
			if( _t.detectEl( ID ) ){
				ID.stop().animate(o['prop'], o['speed'] || _t.speed, o['easing'] || _t.easing);
				setTimeout(function(){
					if( typeof callback !== 'undefined' )
						callback();
				}, ( o['speed'] || _t.speed ) + 1);
			}
		},
		setCss: function( o ){
			TweenLite.set(o['el'], { css: o['prop'] || {} } );
		},
		setAttr: function( o ){
			o['el'].attr( o['prop'], o['val'] || '' );
		},
		detectEl: function( ID ){
			return ID.length > 0 ? true : false;
		},
		ajx: function( o, callback ){	
			$.ajax({
				type: o['type'] || 'GET',
				dataType: o['dataType'] || 'html',
				url: o['uri'] || '',
				error: function( e ){ 
					if( typeof callback !== 'undefined' ) 
						callback({ type: 'error' }); 
				},
				timeout: 30000,
				success:function( d ){ 
					if( typeof callback !== 'undefined' ) 
						callback({ type: 'success', val: d });
				}
			});
		},
		cssClass: function( o, callback ){
			var _t = this, ID = $( o['ID'] ), k = o['delay'], type = o['type'], cls;
			if( _t.detectEl( ID ) ){
				if( type == 'add' ){
					cls = o['cls'] || ['ready', 'animate'];
					ID.addClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().addClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
				}else{
					cls = o['cls'] || ['animate', 'ready'];
					ID.removeClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().removeClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
				}
			}
		},
		pageScroll: function( o, callback ){
			var _t = this;
			$('html, body').stop().animate({ scrollTop: o['scrollTop'] || 0 }, o['speed'] || _t.speed, o['easing'] || 'easeInOutExpo', function(){ 
				if( typeof callback !== 'undefined' )
					callback();  
			});
		},
		lettering: function( o, callback ){
			var _t = this, ID = $( o['ID'] );
			if( _t.detectEl( ID ) )
				ID.lettering( o['type'] );
		},
		slider: function( o, callback ){
			var _t = this;
			if( _t.detectEl( $( o['ID'] ) ) ){ 
				var ID = $( o['ID'] );
					ID = ID.bxSlider( o['prop'] || {} );
				return ID;	
			}
		},
		lazyLoad: function( o, callback ){
			var _t = this, ID = $( o['ID'] );
			if( _t.detectEl( $('.lazy', ID) ) )
				$('.lazy', ID).lazyload({ effect: 'fadeIn', container: o['container'] || window, load: function(){ 
					$( this )
					.removeClass('lazy')
					.addClass('loaded'); 
				}});
		},
		imageLoaded: function( o, callback ){
			var _t = this, el = o['el'];
			if( _t.detectEl( el ) ){
				var total = $('img', el).length, counter = 0;
	
				el
				.imagesLoaded()
				.always( function( instance ) {
					if( typeof callback !== 'undefined' )
						callback({ type: 'always' }); 
				})
				.done( function( instance ){
					if( typeof callback !== 'undefined' )
						callback({ elem: el, type: 'done', val: 1 });  
				})
				.fail( function(){
					if( typeof callback !== 'undefined' )
						callback({ type: 'fail' }); 
				})
				.progress( function( instance, image ) {
					var val = counter / total;
					if( typeof callback !== 'undefined' )
						callback({ type: 'progress', val: counter / total }); 
					counter++;
				});
			}
		},
		wayPoint: {
			el: 'article',
			active: true,
			rate: 1,
			threshold: 80,
			cls: 'animated',
			enabled: function(){ this.active = true; },
			disabled: function(){ this.active = false; },
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) && _t.active )
					el.each(function(){
                        var ths = $( this ),
							o1 = { x: 0, y: wst, width: wt, height: ht * _t.rate },
               				o2 = { x: 0, y: ths.offset().top + _t.threshold, width: wt, height: ths.height() * _t.rate };
						
						if( o1.x < o2.x + o2.width && o1.x + o1.width  > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y )
							ths.addClass( _t.cls );	
                    });
			}
		},
		compactMenu: {
			rate: 0,
			cls: 'compact-menu',
			init: function(){
				var _t = this;
				if( wst > _t.rate && !bdy.hasClass( _t.cls ) )
					bdy.addClass( _t.cls );
				else if( wst == _t.rate && bdy.hasClass( _t.cls ) )
					bdy.removeClass( _t.cls );
			}
		},
		hoverVideo: {
			el: '.ems-categories li',
			cls: 'active',
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el.hover(function(){
						var ths = $( this );
						ths.addClass( _t.cls ).find('video').get( 0 ).play();
					}, function(){
						var ths = $( this );
						ths.removeClass( _t.cls ).find('video').get( 0 ).pause();
					});	
			}
		},
		trimText: function( k ){
			return k.replace(/(^\s+|\s+$)/g,'');
		},
		cleanText: function( k ){
			return k.replace(/\s+/g, '');
		},
		diff: function( arr1, arr2 ){
			var newArr = [];
			var arr = arr1.concat(arr2);
		
			for (var i in arr) {
				var f = arr[i];
				var t = 0;
				for (j = 0; j < arr.length; j++) {
					if (arr[j] === f) {
						t++;
					}
				}
				if (t === 1) {
					newArr.push(f);
				}
			}
			return newArr;
		}
	},
	management = {
		class: {
			arr: [
				//{ main: '.contact-switch__content-container div:first-child', target: '.contact-switch__content-container div:first-child', type: 'add', cls: 'active' },
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), type = o['type'] || 'add', cls = o['cls'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){
					if( type == 'add' )
						target.addClass( cls );
					else
						target.removeClass( cls );
				}
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );	
				
			}
		},
		append: {
			arr: [
				//{ main: '.product-filter', target: '.section.prdList', add: 'before' },
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), clone = o['clone'] || '', type = o['add'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){
					var e = clone != '' ? main.clone() : main;
					if( type == 'prepend' ) target.prepend( e );
					else if( type == 'before' ) target.before( e );
					else if( type == 'after' ) target.after( e );
					else if( type == 'html' ) target.html( e.html() );
					else target.append( e );
				}
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );	
			}
		},
		template: {
			arr: [
				//{ template: '<a href="/">{{k}}</a>', trns:'nav_home', target: '[id$="lblNavigation"]', add: 'prepend' }
			],
			control: function( k ){
				var b = false;
				if( k != undefined && k != null && k != '' ) b = true;
				return b;
			},	
			set: function( o ){
				var target = $( o['target'] || '' ), type = o['add'] || '';
				if( uty.detectEl( target ) && _t.control( translation[ o['trns'] || '' ] ) ){
					var e = o['template'].replace(/{{k}}/g, translation[ o['trns'] || '' ]);
					if( type == 'prepend' ) target.prepend( e );
					else if( type == 'before' ) target.before( e );
					else if( type == 'after' ) target.after( e );
					else if( type == 'html' ) target.html( e );
					else target.append( e );
				}
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			},
		},
		setAttr: {
			arr: [
				//{ main: 'a.btnOdemeBilgiDon', attr: 'href', value: 'javaScript:window.print();' },
			],
			set: function( o ){
				var o = arr[ i ], main = $( o['main'] || '' );;
					if( uty.detectEl( main ) )
						main.attr( o['attr'], o['value'] );
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		init: function(){
			var _t = this;
				_t.class.init();
				_t.append.init();
				_t.template.init();
				_t.setAttr.init();
		}
	},
	plugin = {
		slider: {
			el: '.swiper-container',
			typ: {
				main: { 
					prop: {
						nextText: '<i class="ems-icon next"></i>', 
						prevText: '<i class="ems-icon prev"></i>', 
						mode: 'horizontal', 
						pager: true, 
						adaptiveHeight: true,
						video: true,
						onSliderLoad: function(){ 
							var ths = this;
								ths.sliderLoad();
								ths.sliderControl(); 
						},
						onSlideBefore: function(){ this.sliderDisabled('add'); this.sliderControl(); },
						onSlideAfter: function(){ this.sliderDisabled('remove'); } 
					} 
				},
				news: { 
					prop: { 
						nextText: '<i class="ems-icon next"></i>', 
						prevText: '<i class="ems-icon prev"></i>',
						pager: false, 
						slideWidth: 654,
						minSlides: 2,
						maxSlides: 3,
						moveSlides: 1,
						slideMargin: 80,
						adaptiveHeight: true,
						onSliderLoad: function(){ 
							var ths = this;
								ths.sliderResize(); 
								ths.sliderLoad();
								ths.slides = 3; 
								ths.sliderControl(); 
						},
						onSliderResize: function(){ this.sliderResize(); },
						onSlideBefore: function(){ this.sliderDisabled('add'); this.sliderControl(); },
						onSlideAfter: function(){ this.sliderDisabled('remove'); } 
					} 
				}	
			},
			addPager: function( ID ){ ID.append('<div class="sld-pager"><strong></strong><span></span></div>'); },
			addOrder: function( ID ){ ID.each(function( i, k ){ $( this ).attr('data-order', i);  }); },
			customThumb: function( ID ){
				if( !uty.detectEl( $('.thumb-slider', ID) ) ) 	return false;
				var _t = this, drp = $('.thumb-slider', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
				s.each(function( i, k ){
                    var ths = $( this ), tt = ths.attr('data-thumb') || '';
					if( tt != '' )
						htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);"><img src="'+ tt +'" border="0"/></a></li>';
                });
				drp.find('ul').html( htm );
				
				$('ul li', drp).bind('click', function(){
					var ths = $( this ), k = ths.attr('data-order') || 0;
					$('.bx-pager a[data-slide-index="'+ k +'"]', ID).click();
				});			
				
			},
			customDropDown: function( ID ){
				if( !uty.detectEl( $('.ems-custom-dropdown', ID) ) ) 	return false;
				var _t = this, drp = $('.ems-custom-dropdown', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
				s.each(function( i, k ){
                    var ths = $( this ), tt = ths.attr('data-title') || '';
					if( tt != '' )
						htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);">'+ tt +'</a></li>';
                });
				drp.find('.ems-sub').html( htm );
				
				$('.ems-custom-dropdown-header a', drp).bind('click', function(){
					var ths = $( this );
					if( drp.hasClass( cls['opened'] ) ) 
						$('.ems-custom-dropdown').removeClass( cls['opened'] );
					else{
						$('.ems-custom-dropdown').removeClass( cls['opened'] );
						drp.addClass( cls['opened'] );
					}	
				});
				
				$('.ems-sub li', drp).bind('click', function(){
					var ths = $( this ), k = ths.attr('data-order') || 0;
					$('.ems-custom-dropdown').removeClass( cls['opened'] );
					$('.bx-pager a[data-slide-index="'+ k +'"]', ID).click();
				});
				
			},
			set: function( ID ){
				var _t = this, typ = 'main';
				if( ID.hasClass('news-slider') ) typ = 'news';

				var s = $('.swiper-inner > ul', ID);
				if( $('> li', s).length > 1 ){ 
					_t.addPager( ID );
					_t.addOrder( $('> li', s) );
					_t.customDropDown( ID );
					_t.customThumb( ID );
					s.bxSlider( _t.typ[ typ ]['prop'] || {} );
				}
			},
			lazy: function( ID ){
				var _t = this, img = $('.lazy-load', ID);	
				if( uty.detectEl( img ) )
					 img
					 .css({'opacity': 0})
					 .attr('src', img.attr('data-original'))
					 .one('load', function(){ 																			 					
						$( this )
						.addClass('load-image')
						.removeClass('lazy-load')
						.stop()
						.animate({ 'opacity': 1 }, 222);
					 });		
			},
			activeElements: function( o ){
				var arr = [], elem = o['el'], c = o['c'], k = o['k'], mn = c * k, mx = k * ( mn + 1 ); 
					for( var i = mn; i < mx; ++i ){
						var e = $('li[data-order="'+ i +'"]', elem).not('.bx-clone');
						if( uty.detectEl( $('.lazy-load', e) ) )
							arr.push( e );
					}
				return arr;	
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					
					$.fn.extend({
						
						sliderDisabled: function( k ){
							var ths = this;
							setTimeout(function(){
								var con = ths.parents('.swiper-container');
								if( k == 'add' ) con.addClass('disabled');
								else con.removeClass('disabled');
							}, 10);
						},
						
						sliderLoad: function(){
							var ths = this;
							setTimeout(function(){ $('li.bx-clone', ths).each(function(){ _t.lazy( $( this ) ); }); }, 0);
						},
						
						sliderControl: function(){
							var ths = this;
							
							setTimeout(function(){
								
								var con = ths.parents('.swiper-container'), pager = con.find('.sld-pager'), act = con.find('[aria-hidden="false"]'), cnt = con.find('.headline-holder'), drp = $('.ems-custom-dropdown', con), current = ths.getCurrentSlide();
								
								if( uty.detectEl( cnt ) )
									$('> ul > li[data-order="'+ current +'"]', cnt).addClass('active').siblings('li').removeClass('active');
								
								if( uty.detectEl( pager ) ){
									pager.find('strong').text( current + 1 );
									pager.find('span').text( '/ ' + ths.getSlideCount() );
								}
								
								if( ths.slides !== undefined ) 
									act = _t.activeElements({ el: ths, c: current, k: ths.slides });
									
								if( uty.detectEl( drp ) ){
									var k = $('.ems-custom-dropdown-header a', drp), e = $('.ems-sub li[data-order="'+ current +'"]', drp);
									if( uty.detectEl( k ) && uty.detectEl( e ) ){
										k.html( e.text() );
										e.addClass('selected').siblings('li').removeClass('selected');
									}
								}
								
								if( uty.detectEl( act ) )
									$.each(act, function(){ _t.lazy( $( this ) ); });
							}, 0);
						},
						
						sliderResize: function(){
							var ths = this;
							setTimeout(function(){
								var con = ths.parents('.swiper-container'), b = con.find('.bx-wrapper'); 
								b.css('margin-left', ( con.width() - parseFloat( b.css('max-width') ) ) * .5);
							}, 0);
						}
					});
					
					el.each(function(){ _t.set( $( this ) ); });
				}
			}
		},
		isotop: {
			el: '.section-cat-sub-list .ems-container > ul',
			cls: { loaded: 'masonry-loaded' },
			typ: {
				main: { 
					prop: {
						itemSelector: 'li',
						layoutMode: 'masonry' 
					} 
				}	
			},
			init: function(){
				var _t = this, el = $( _t.el );
				el.each(function(){
					var ths = $( this );
					uty.imageLoaded({ el: ths }, function( o ){
						if( o['type'] == 'done' ){
							var e = o['elem']; 
								e.isotope( _t['typ']['main'] );					
								e.addClass( _t['cls']['loaded'] ); 
						}
					});			    
                });
			}	
		},
		init: function(){
			var _t = this;
				_t.isotop.init();
				_t.slider.init();
		}
	},
	modules = {
			cart: {
				amoundEl: 'span#lblUrunAdet',
				amountTarget: '.mCartBtn b',
				priceEl: 'span#lblUrunTutari',
				priceTarget: '.moduleMiniCart .price span',
				btn: '.moduleMiniCart .title a',
				closeBtn: '.vail.vailCart',
				cls: { ready: 'mini-cart-ready', animate: 'mini-cart-animate' },
				add: function(){
					var _t = this;
						_t.amound();
					uty.pageScroll({ scrollTop: 0 }, function(){ _t.opened(); });	
				},
				amound: function(){
					var _t = this, amoundEl = $( _t.amoundEl ), amountTarget = $( _t.amountTarget ), priceEl = $( _t.priceEl ), priceTarget = $( _t.priceTarget );
					if( uty.detectEl( amoundEl ) && uty.detectEl( amountTarget ) ){
						var val = parseFloat( uty.trimText( amoundEl.text() ) );
						amountTarget.text( val );
					}
					if( uty.detectEl( priceEl ) && uty.detectEl( priceTarget ) ){
						var val = parseFloat( priceEl.text() );
						priceTarget.text( uty.trimText( priceEl.text() ) );
					}
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] + ' ' + _t.cls['animate'] );
				},
				opened: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				},
				closed: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				init: function(){
					var _t = this, btn = $( _t.btn ), closeBtn = $( _t.closeBtn );
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							if( bdy.hasClass( _t.cls['ready'] ) ) 
								_t.closed();
							else
								_t.opened();
						});
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ 
							_t.closed();
						});
				},
			},
			login: {
				btn: '.mod-mini-login .btn-signin',
				closeBtn: '',
				showPassBtn: '.mod-mini-login .show-pass-btn',
				email: '.mod-mini-login input[id$="txtKUTU_UYEEMAIL"]',
				pass: '.mod-mini-login input[id$="txtUYE_SIFRE"]',
				err: '.errorKutuLogin',
				cls: { ready: 'mini-login-ready', animate: 'mini-login-animate', showPass: 'show' },
				check: function(){
					var _t = this, email = $( _t.email ), err = $( _t.err );
					if( uty.detectEl( err ) ){
						var ekt =  uty.cleanText( err.text() );
						if( ekt != '' ){
							_t.opened();
							uty.pageScroll();
							if( uty.detectEl( email ) ) email.focus();
						}
					}
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] + ' ' + _t.cls['animate'] );
				},
				opened: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				},
				closed: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				init: function(){
					var _t = this, btn = $( _t.btn ), closeBtn = $( _t.closeBtn ), showPassBtn = $( _t.showPassBtn ), pass = $( _t.pass );
						_t.check();
					
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							if( bdy.hasClass( _t.cls['ready'] ) ) _t.closed();
							else _t.opened();
						});
					
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ _t.closeBtn(); });
					
					if( uty.detectEl( showPassBtn ) && uty.detectEl( pass ) )
						showPassBtn.bind('click', function(){  
							var ths = $( this );
							if( ths.hasClass( _t.cls['showPass'] ) ){
								ths.removeClass( _t.cls['showPass'] );
								pass.prop('type', 'password');
							}else{
								ths.addClass( _t.cls['showPass'] );
								pass.prop('type', 'text');
							}
						});	
						
				}
			},
			init: function(){
				var _t = this;
					_t.login.init();
					_t.cart.init();
			}
			
	},
	pages = {
		main: {
			el: '.ems-page.page-home',
			initPlugins: function(){
				uty.hoverVideo.init();	
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					_t.initPlugins();
				}	
			}
		},
		init: function(){
			var _t = this;
				_t.main.init();
		}
	},
	initialize = function(){
		plugin.init();
		modules.init();
		management.init();
		pages.init();
	};
	
	initialize();
	
/* DISPATCH */	
stage.addEventListener("CustomEvent", [ { type: "sepetDoldur", handler: "cartAmound" } ]);
stage.addEventListener("CustomEvent", [ { type: "sepeteEkle", handler: "cartAdd" } ]);	
function cartAmound(){ modules.cart.amound(); }
function cartAdd(){ modules.cart.add(); }
cartAmound();