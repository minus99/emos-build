var bdy = $('body'),
	win = $( window ),
	doc = $( document ),
	wt = parseFloat( win.width() ),
	ht = parseFloat( win.height() ),
	wst = parseFloat( win.scrollTop() ),
	sRatio,
	uty = {
		speed: .6,
		easing: Expo.easeInOut,
		ani: function( o, callback ){
			var _t = this, ID = o['el'];
			if( _t.detectEl( ID ) ){
				if( typeof callback !== 'undefined' ) o['prop']['onComplete'] = callback;
				o['prop']['ease'] = o['easing'] || _t.easing;
				TweenLite.to(ID,  o['speed'] || _t.speed, o['prop'] || {})
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
		swiper: function( o, callback ){
			var _t = this;
			if( _t.detectEl( $( o['ID'] ) ) ){
				var s = new Swiper( o['ID'], o['prop'] ); 
				if( typeof callback !== 'undefined' )
					callback( s );
				return s;	
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
		}
	}