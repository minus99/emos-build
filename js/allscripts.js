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
					ID = ID.minusSimpleSlider( o['prop'] || {} );	
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
						callback({ type: 'done', val: 1 });  
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
			init: function(){
				var _t = this;
					_t.cart.init();
			}
			
	},
	pages = {
		main: {
			el: '.ems-page.page-home',
			initPlugins: function(){
				uty.slider( { ID: '.main-banner', prop: { infinite: !isMobile, rotate: !editableMode, lazyLoad: 'img.lazy-load' } } );	
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