////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// JS LBF
var translation = {
	compareVld: 'Karşılaştırma için en az 2 ürün seçiniz.',
	serviceListAll: 'Tümü',
	infoWindowMap: 'İçerik Yükleniyor',
	locationSearch: 'Lütfen il/ilçe bilginizi giriniz',
	serviceWorkHours: 'ÇALIŞMA GÜN VE SAATLERİ',
	mapBackBtn: 'Geri',
	discountText: 'İNDİRİM',
	eBulten_txtUYE_EMAIL: 'E-mail adresinizi giriniz...'
}; 

var siteSettings = {
	visilabsTemplateActive: true
};

var visTemplate = {
	cls: { price: 'urunListe_brutFiyat', discount: 'urunListe_satisFiyat', priceWrp: 'ems-prd-price-first', discountWrp: 'ems-prd-price-selling', indirimli: 'indirimli' },
	template: {
		//list: '<li data-prdcode="{{prdcode}}"><div class="product clearfix"><div class="img"><a href="{{uri}}"><img class="lazyload" src="http://cdn.englishhome.com.tr/images/lazyload/placeHolder.gif" data-original="{{src}}" alt="{{title}}" title="{{title}}"></a></div><div class="productBottom"><h1><a href="{{uri}}" title="{{title}}">{{title}}</a></h1><div class="priceHolder">{{urunListe_brutFiyat}} {{urunListe_satisFiyat}}</div></div></div></li>',
		list: '<li class="ems-prd {{class}}" data-prdcode="{{prdcode}}"> <div class="ems-prd-inner"> <div class="ems-prd-wrp">{{discountWrp}}<div class="ems-prd-image"><a href="{{uri}}"><img class="lazyload" src="http://cdn.englishhome.com.tr/images/lazyload/placeHolder.gif" data-original="{{src}}" alt="{{title}}" title="{{title}}"></a></div></div><div class="ems-prd-name"><a href="{{uri}}" title="{{title}}">{{title}}</a></div><div class="ems-prd-price clearfix">{{urunListe_brutFiyat}}{{urunListe_satisFiyat}}</div><div class="ems-fixer"></div></div></li>',
		price: '<span class="{{wrpClass}}"><div class="{{class}}">{{price}}<span class="d">{{decimals}}</span><span class="pb1"> {{currency}}</span></div></span>',
		discount: '<div class="ems-prd-icons"><div class="urunListe_pnlIndirimOran"><span class="urunListe_IndirimOran">%{{discount}}<span>{{discountText}}</span></span></div></div>'
	},
	getPrice: function( o ){
		var _t = this, prc = ( o['price'] || '' ).toString(), htm = '';
		if( prc != '' ){
			prc = prc.split('.');
			var price = prc[ 0 ] || '',
				decimals = prc[ 1 ] || '';
				if( decimals != '' ) decimals = ',' + decimals;
				
			htm = _t.template.price.replace(/{{class}}/g, o['cls'] || '').replace(/{{wrpClass}}/g, o['wrpCls'] || '').replace(/{{currency}}/g, o['cur'] || '').replace(/{{price}}/g, price).replace(/{{decimals}}/g, decimals);
		}
		return htm;
	},
	setImg: function( k ){
		if( k.indexOf('_small.jpg') == -1 )
			k = k.replace(/.jpg/g, '_small.jpg');
		return k;
	},
	setUri: function( k ){
		/* canlıya geçişte kaldırılacak unutma */
		k = k.replace(/www./g, 'sap.');
		return k;
	},
	getClass: function( o ){ 
		var _t = this, k = '',  prc = o['price'] || '', dPrc = o['dprice'] || '';
		if( prc != dPrc ) k = _t.cls['indirimli'];
		return k;
	},
	getDiscount: function( o ){
		var _t = this, k = '', dis = o['discount'] || 0;
		if( dis != 0 )
			k = _t.template.discount.replace(/{{discount}}/g, Math.floor( dis )).replace(/{{discountText}}/g, ( translation['discountText'] || 'İNDİRİM' ));

		return k;
	}, 
	getTemplate: function( o ){
		var _t = this, prc = o['price'] || '', dPrc = o['dprice'] || ''; 
		if( prc == dPrc ) prc = ''; 
		return _t.template.list.replace(/{{prdcode}}/g, o['code'] || '').replace(/{{uri}}/g, _t.setUri( o['dest_url'] || '' )).replace(/{{src}}/g, _t.setImg( o['img'] || '' )).replace(/{{title}}/g, o['title'] || '').replace(/{{urunListe_brutFiyat}}/g, _t.getPrice({ wrpCls: _t.cls['priceWrp'], cls: _t.cls['price'], cur: o['cur'] || '', price: prc })).replace(/{{urunListe_satisFiyat}}/g, _t.getPrice({ wrpCls: _t.cls['discountWrp'], cls: _t.cls['discount'], cur: o['dcur'] || '', price: dPrc })).replace(/{{class}}/g, _t.getClass( o )).replace(/{{discountWrp}}/g, _t.getDiscount( o ));
	},
	get: function( o ){
		var _t = this, htm = '';
		$.each(o, function( i, k ){
			htm += _t.getTemplate( k );
		});
		return htm;				
	}
};

/* PLUGINS */

(function($) {
    $.fn.extend({
        minusCounter: function(options, callback) {
            var defaults = {};
            var options = $.extend(defaults, options);
            return this.each(function() {
                var el = $( this ),
					_min = el.attr('min') || 1,
					_max = el.attr('max') || 0,
                    o = options,
					uty = {
						cleanText: function( k ){ return k.replace(/\s+/g, ''); },
						cleanChar: function( k ){ return k.replace(/[^0-9]/g, ''); }
					},
					main = {
						template: {
							bottom: '<a class="counter-btn bottom-btn" rel="dec" href="javascript:void(0);"><span><i class="icon-1 ico_bottom-arrow"></i></span></a>',
							top: '<a class="counter-btn top-btn" rel="inc" href="javascript:void(0);"><span><i class="icon-1 ico_top-arrow"></i></span></a>'
						},
						check: function(){
							var _t = main, ths = $( this ), rel = ths.attr('rel') || '', val = parseFloat( uty.cleanChar( uty.cleanText( el.val() ) ) );
								
							if( isNaN( val ) ) val = _min;
							
							if( rel == 'inc' ) val++;
							else if( rel == 'dec' ) val--;
							
							if( _max != 0 )
								if( val >= _max ) val = _max;
								
							if( val <= _min ) val = _min;	
							
							el.val( val );
						},
						addEvent: function(){
							var _t = this;
							el
							.siblings('.counter-btn')
							.bind('click', _t.check);
							
							el
							.bind('blur', _t.check);
						},
						add: function(){
							var _t = this;
							el
							.before( _t.template.bottom )
							.after( _t.template.top );
						},
						init: function(){
							var _t = this;
								_t.add();
								_t.addEvent();
						}
					};
					
				main.init();
            })
        }
    })
})(jQuery, window);

(function($){
		$.fn.extend({
			
			minusCustomScroller : function( options, callback ){
				
				var defaults = {
                    con: '> ul',
					items: '> li',
                    speed: 333,
                    childIndex: 0,
					minWidth: null
				};
				
				var options = $.extend( defaults, options );
				
				return this.each(function(){
					
					var o = options,
						wrp = $( this ),
                        con = wrp.find( o.con ),
                        items = con.find( o.items ),
                        scroll = null,
						current = 0,
						total = 0,
						main = {
							template: {
								nav: '<div class="nav-btn-wrp"><a href="javascript:void(0);" rel="prev" class="prev-btn nav-btn"><i></i></a><a href="javascript:void(0);" rel="next" class="next-btn nav-btn"><i></i></a></div>'
							},
							adjust: function(){
								var _t = this, k = wrp.siblings('.nav-btn-wrp'), total = _t.get();
                                con.width( total );
                                if( total <= wrp.width() ) k.hide();
								else k.show();
								
								if( scroll != null )
                                    setTimeout(function(){ scroll.refresh(); }, 0);
							},
							events: function(){
								var _t = this;
								$( window ).resize(function(){ _t.adjust(); });
								_t.adjust();
							},
                            get: function(){
                                var _t = this, total = 0;
                                items.each(function(){ 
									var ths = $( this );
									if( o.minWidth ){
										var k = Math.round( wrp.width() / Math.floor( wrp.width() / o.minWidth ) );
										ths.width( k );	
										total += Math.round( k + 1 ); 
									}else
									total += Math.round( $( this ).outerWidth( true ) + 1 ); 
								});
                                return total;
                            },
                            initPlugins: function(){
                                scroll = new IScroll(wrp.get( 0 ), { probeType: 3, eventPassthrough: true, scrollX: true, scrollY: false, momentum: true, snap: true, preventDefault: false }, o.childIndex);
                            },
							add: function(){
								var _t = this;
								wrp.after( _t.template.nav );
							},
							addEvent: function(){
								var _t = this;
								wrp.siblings('.nav-btn-wrp').find('a').bind('click', function(){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( rel != '' ){
										if( scroll != null ){
											if( rel == 'next' )	
												scroll.next()
											else 
												scroll.prev()
										}
									}
								})
							},
							set: function(){
								total = items.length;
							},
							init: function(){					
								var _t = this;
                                if( con.length > 0 && items.length > 0 ){
									_t.set();
                                   	_t.add();
									_t.addEvent();
								    _t.initPlugins();
                                    _t.events();
                                }
							}	
						};
						
						main.init();
				});
			}
		})
	})(jQuery, window);


(function($) {
    $.fn.extend({
        minusGuest: function( options, callback ){
            var defaults = {
				speed: 333,
				easing: 'easeInOutExpo'
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var o = options, 
					el = $( this ),
					acc = el.find('.questAccBtn'),
					list = el.find('.listInner'),
					listItems = el.find('.questListItems'),
					win = $( window ),
					uty = {
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						pageScroll: function( ID ){
							if( ID.length > 0 ){
								$('html, body').stop().animate({ scrollTop: ID.offset().top }, 222, 'easeInOutExpo', function(){ 
									if( typeof callback !== 'undefined' )
										callback();  
								});
							}
						}
					},
					resetDom = {
						k: true,
						isVisible: '.mbHeader',
						visibleControl: function(){
							var _t = this, b = false;
							if( _t.isVisible !== '' ){
								var e = $( _t.isVisible );
								if( uty.detectEl( e ) )
									if( e.is(':visible') )
										b = true;	
							}
							return b;
						},
						onResize: function(){ 
							var _t = this;
							if( !_t.k && _t.visibleControl() ){
								// mobi
								_t.k = true;
								main.mobiEvent();console.log('mobi');
								
							}else if( _t.k && !_t.visibleControl() ){
								// pc
								_t.k = false;
								main.pcEvent();console.log('pc');
							}
						},
						init: function(){
							var _t = this;
							if( _t.visibleControl() ) 
								_t.k = false;
						}
					},
					main = {
						cls: { opened: 'opened', selected: 'selected' },
						mobiEvent: function(){
							var _t = this;
								_t.destroy();
							el
							.find('.quest-tab-Btn > li')
							.unbind('click')
							.bind('click', function(){
								var ths = $( this );
									ths.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
									acc.find('> li:eq('+ ths.index() +')').addClass( _t.cls['opened'] ).siblings('li').removeClass( _t.cls['opened'] );
							})
							.eq( 0 )
							.click();
							
							el
							.find('.questListItems > .acc-btn')
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ), prt = ths.parent('.questListItems');
								if( prt.hasClass( _t.cls['selected'] ) )
									prt.add( prt.siblings('.questListItems') ).removeClass( _t.cls['selected'] );
								else
									prt.addClass( _t.cls['selected'] ).siblings('.questListItems').removeClass( _t.cls['selected'] );
							});
							
							el
							.find('.rightCol .acc-btn')
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ), prt = ths.parent('li');
								if( prt.hasClass( _t.cls['selected'] ) )
									prt.add( prt.siblings('li') ).removeClass( _t.cls['selected'] );
								else
									prt.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
							});
						},
						pcEvent: function(){
							var _t = this;
							 	_t.destroy();
								
							 el
							 .find('.questAccBtn > li > a')
							.unbind('click')
							.bind('click', function( e ){
									var ths = $( this ).parent('li');
									if( ths.hasClass( _t.cls['opened'] ) ) 
											ths.add( ths.siblings('li') ).removeClass( _t.cls['opened'] );
									else{
											ths.addClass( _t.cls['opened'] ).siblings('li').removeClass( _t.cls['opened'] );
											setTimeout(function(){ uty.pageScroll( ths ); }, 0);
									}
							});
							
							el
							.find('.questStep li')
							.unbind('click')
							.bind('click', function( e ){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( rel != '' ){
											var e = el.find('.questList > div[rel="'+ rel +'"]');
											if( e.length > 0 )
												ths.add( e ).addClass( _t.cls['selected'] ).siblings('li, div').removeClass( _t.cls['selected'] );
									}
							});
							
							el
							.find('.questStep').each(function(){	$('li', this).eq( 0 ).click(); });
							
							el
							.find('.questList .leftCol li')
							.unbind('click')
							.bind('click', function( e ){
									var ths = $( this ), ind = ths.index(), prts = ths.parents('.questListItems');
									ths.add( $('.rightCol li:eq('+ ind +')', prts ) ).addClass( _t.cls['selected'] ).siblings('li, div').removeClass( _t.cls['selected'] );
									uty.pageScroll( $('.rightCol', prts ) );
							})
							.eq( 0 )
							.click();    
							
							el
							.find('.questList .leftCol').each(function(){ $('li', this).eq( 0 ).click(); });
						},
						add: function(){

							var _t = this, tmp = '<ul class="quest-tab-Btn">';
							acc.find('> li > a').each(function(){
									tmp += ( '<li>' + $( this ).get( 0 ).outerHTML + '</li>' );
							});
							tmp += '</ul>';
							acc.before( tmp );
							/**********/
							
							list.each(function(){
								var ths = $( this ), stp = ths.find('.questStep > li'), lst = ths.find('.questList');
								stp.each(function(){
									var ths = $( this ), e = ths.attr('rel') || '';
									if( e != '' ){
										e = lst.find('> div[rel="'+ e +'"]');
										if( uty.detectEl( e ) )
											e.prepend('<a class="list-acc-btn acc-btn" href="javascript:void(0);">' + ths.find('a').html() + '</a>');
										
									}
								});
							});
							/**********/
							listItems.each(function(){
								var ths = $( this ), lft = ths.find('.leftCol > ul > li > a'), rght = ths.find('.rightCol > ul');
								lft.each(function( i ){
									var ths = $( this );
									rght.find('li:eq('+ i +')').prepend('<a class="list-item-acc-btn acc-btn" href="javascript:void(0);">' + ths.html() + '</a>');
								});
							});
						},
						destroy: function(){
							var _t = this;
							el.find('li, div').removeClass( _t.cls['selected'] ).removeClass( _t.cls['opened'] );
							el.find('.quest-tab-Btn > li, .questListItems > .acc-btn, .rightCol .acc-btn, .questList .leftCol li, .questStep li, .questAccBtn > li > a').unbind('click');
						},
						addEvents: function(){
							var _t = this;
							win.bind('resize', _t.adjust).resize();
						},
						adjust: function(){
							var _t = main;
							resetDom.onResize();
						},
						init: function(){
							var _t = this;
							_t.add();
							resetDom.init();	
							_t.addEvents();
						}
					};
				main.init();
				
            })
        }
    })
})(jQuery, window);


(function($) {
    $.fn.extend({
        minusAccordion: function( options, callback ){
            var defaults = {
				btn: '> ul > li > a',
				prt: 'li'
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var o = options, 
					el = $( this ),
					main = {
						btn: el.find( o.btn ),
						cls: { opened: 'opened' },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						pageScroll: function( k, callback ){
							var _t = this;
							$('html, body').stop().animate({ scrollTop: k }, o['speed'] , o['easing'], function(){ 
								if( typeof callback !== 'undefined' )
									callback();  
							});
						},
						addEvent: function(){
							var _t = this;
							_t.btn.bind('click', function(){
								var ths = $( this ), prt = ths.parents( o.prt ).eq( 0 ), sib = prt.siblings( o.prt );
								if( prt.hasClass( _t.cls['opened'] ) )
									prt.add( sib ).removeClass( _t.cls['opened'] );
								else{
									sib.removeClass( _t.cls['opened'] );
									prt.addClass( _t.cls['opened'] );	
								}	
							})
						},
						init: function(){
							var _t = this;
							if( _t.detectEl( _t.btn ) )
								_t.addEvent();
						}
					};
				main.init();
				
            })
        }
    })
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusCustomDropDown: function(options, callback) {
            var defaults = {};
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					el = $( this ),
					clickedElem = el.find('> span'),
					items = el.find('> ul li'),
					uty = {
						detectEl: function( ID ){ return ID.length > 0 ? true : false; }
					},
                    main = {
						drp: '.dropdown',
						cls: { opened: 'opened', selected: 'selected' },
						addEvent: function(){
							var _t = this, drp = $( _t.drp ), opCls = _t['cls']['opened'], sCls = _t['cls']['selected'];
							
							clickedElem
							.bind('click', function(){
								var ths = $( this ).parent();
								if( ths.hasClass( opCls ) ) 
									drp.removeClass( opCls );
								else{
									drp.removeClass( opCls );
									ths.addClass( opCls );
								}
							});
							
							items
							.bind('click', function(){
								var ths = $( this );
									ths.addClass( sCls ).siblings('li').removeClass( sCls ).parents('.dropdown').find('> span').html( ths.text() + '<i class="icon-ico_arrow1"></i>' );
								drp.removeClass( opCls );
							});
							
							var e = el.find('> ul li.selected');
							if( uty.detectEl( e ) )
								e.click();
							else
								items.eq( 0 ).click();
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( clickedElem ) && uty.detectEl( items ) )
								_t.addEvent();
						}
					};
				main.init();                
            })
        }
    })
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusDropDown: function(options, callback) {
            var defaults = {
				closeElem: '',
                type: "hover",
                customClass: "hover",
				bdyCls: "",
				bdyCls2: "",
                delay: 555,
                openedDelay: 0,
                className: "",
                clicked: "",
                openedControl: "",
                hideDropDown: [],
                attachmentDiv: null,
                isVisible: null,
				overlay: null,
				parents: null,
				toggle: true,
				bdyClicked: true 
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                
				var holder = $(this),
                    o = options,
                    attachmentDiv = o.attachmentDiv != null ? $(o.attachmentDiv) : null,
                    stm = null,
                    bdy = $('body');
				
				if( holder.hasClass('activePlug') ) return false;
									
                function init() {
                    if (o.type == "hover") {
                        holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                        if (attachmentDiv != null) attachmentDiv.mouseenter(events.mouseenter).mouseleave(events.mouseleave)
                    } 
					else if (o.type == "click"){ 
						$(o.clicked, holder).bind('click', events.clicked);
						if( o.bdyClicked )
							$("body, html").bind('click touchstart', events.bodyClicked);
					}else if (o.type == "hoverClick"){ 
						holder.mouseenter(events.onMouseenter).mouseleave(events.onMouseleave);
						$(o.clicked, holder).bind('click', events.onClicked);
						if( o.bdyClicked )
							$("body, html").bind('click touchstart', events.bodyClicked);
					}
                 }
                var animate = {
                    opened: function() {
                        controls();
                        if (attachmentDiv != null) attachmentDiv.addClass(o.customClass);
                        holder.addClass(o.customClass);
						if( o.parents != null ) holder.parents( o.parents ).addClass(o.customClass);
						overlayControls('opened');
						if (callback != undefined) callback("opened")
                    },
                    closed: function() {
                        if (attachmentDiv != null) attachmentDiv.removeClass(o.customClass);
                        holder.removeClass(o.customClass);
						if( o.parents != null ) holder.parents( o.parents ).removeClass(o.customClass);
						overlayControls('closed');
						if (callback != undefined) callback("closed");
						bdy.removeClass(o.bdyCls2);
                    }
                };
				
				function closeElem(){
					if( o.closeElem != '' )
						$( o.closeElem ).each(function(){
							var ths = $( this ).get( 0 );
							if( typeof ths.closed !== 'undefined' )	
                            	ths.closed();
                        });
				}
                var events = {
					
					onMouseenter: function() {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function() {
							closeElem();
                            overlayControls('opened');
                        }, o.openedDelay)
                    },
                    onMouseleave: function() {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function() {
							if (!holder.hasClass(o.customClass))
								overlayControls('closed');
							
                        }, o.delay)
                    },
					onClicked: function() {
						animate.opened();
						bdy.addClass( o.bdyCls2 );
                    },
                    mouseenter: function() {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function() {
                            animate.opened()
                        }, o.openedDelay)
                    },
                    mouseleave: function() {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function() {
                            animate.closed()
                        }, o.delay)
                    },
                    clicked: function() {
                        if( o.toggle ){
							if (holder.hasClass(o.customClass)) animate.closed();
                     	   	else animate.opened()
						}else
							animate.opened()
                    },
                    bodyClicked: function( e ){
						if( !holder.is( e.target ) && holder.has( e.target ).length === 0 )
							animate.closed();
                    }
                };
				
				function overlayControls( k ){
					if( o.overlay != null ){
						if( k == 'opened' ) bdy.addClass( o.bdyCls );
						else bdy.removeClass( o.bdyCls );
					}
				}
				
                function visibleControls() {
                    if (o.isVisible != null)
                        if ($(o.isVisible).is(":visible")) return true
                }

                function controls() {
                    if (o.hideDropDown.length > 0)

                        for (var i = 0; i < o.hideDropDown.length; ++i)
                            if (o.hideDropDown[i].length > 0) o.hideDropDown[i][0].closed()
                }
							
                this.opened =
                    function() {
                        animate.opened()
                    };
                this.closed = function() {
                    if (stm != null) clearTimeout(stm);
                    animate.closed()
                };
                this.dispose = function() {
                    if (o.type == "hover") holder.unbind("mouseenter").unbind("mouseleave");
                    else $(o.clicked, holder).unbind("click")
                };
                this.live = function() {
                    if (o.type == "hover") holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                    else $(o.clicked, holder).click(events.clicked)
                };
				
                init();
            })
        }
    })
})(jQuery, window);


(function($) {
    $.fn.extend({
        minusGallery: function(options, callback) {
            var defaults = {
				ratioTyp: 1,
				triggerBtn: '[rel="minusGallery"]',
				customClass: ''
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					bdy = $('body'),
					win = $( window ),
					el = $( this ),
					btn = el.find( o.triggerBtn ),
					cls = { loadImg: 'gallery-load-image', ready: 'gallery-ready', animate: 'gallery-animate', closed: 'gallery-closed' },
					items = '',
					currentItems = 0,
					uty = {
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
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
						loadImg: function( k, callback ){
							var  _t = this, img = new Image();
							el.addClass( cls['loadImg'] );
							img.onload = function(){
								if( typeof callback !== 'undefined' )
									callback({ typ: 'success', val: this });
								el.removeClass( cls['loadImg'] );	
							};
							img.onerror = function(){  
								if( typeof callback !== 'undefined' )
									callback({ typ: 'error' });
								el.removeClass( cls['loadImg'] );	
							};
							img.src = k;
						}
					},
                    main = {
						scroller: null,
						current: { w: 0, h: 0, r: 0, elem: null },
						destroy: function(){ 
							var _t = this;
								_t.current['w'] = 0;
								_t.current['h'] = 0;
								_t.current['r'] = 0;
								_t.current['elem'] = null;
								items = '';
								currentItems = 0;
								
							if( _t.scroller !== null ){ 
								_t.scroller.destroy();
								_t.scroller = null;
							}
						},
						template: {
							gallery: '<div class="minus-gallery '+ o.customClass +'"><div class="minus-gallery-inner"><div class="minus-gallery-header"><a class="gallery-close-btn" href="javascript:void(0);"></a><a rel="next" class="gallery-next-btn gallery-nav-btn" href="javascript:void(0);"><i></i></a><a rel="prev" class="gallery-prev-btn gallery-nav-btn" href="javascript:void(0);"><i></i></a></div><div class="minus-gallery-body"><div class="minus-gallery-body-inner"></div></div><div class="minus-gallery-footer"></div></div></div>'
						},
						adjust: function(){
							var _t = this, ths = _t.current['elem'] || null;
							if( ths !== null ){
								var con = el.find('.minus-gallery'), wt = con.width(), ht = con.height(), ratio = _t.current['r'], wR = 0, hR = 0, k = '';
								
								if( o.ratioTyp == 0 ){
									if( wt / ht >= ratio ){
										wR = ht * ratio;
										hR = ht;
									}else{
										wR = wt;
										hR = wt / ratio;
									}
								}else{
									if ( wt / ht >= ratio ){
										wR = wt;
										hR = wt / ratio;
									}else{
										wR = ht * ratio;
										hR = ht;
									}
								}
								
								k = Math.round( ( wt - wR ) * .5 ) + 'px,' + Math.round( ( ht - hR ) * .5 ) + 'px';
	
								$( ths )
								.parent()
								.width( Math.round( wR ) )
								.height( Math.round( hR ) )
								.css({ '-webkit-transform': 'translate('+ k +')', '-ms-transform': 'translate('+ k +')', 'transform': 'translate('+ k +')' });	
								
								if( _t.scroller !== null ) 
									setTimeout(function(){ _t.scroller.refresh(); }, 0);				
							}
						},
						animate: function( k ){
							var _t = this;
							if( k == 'opened' )
								uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[cls['ready'], cls['animate']] });
							else
								uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[cls['animate'], cls['ready']] });		
						},
						set: function( k ){						
							var _t = this;
							if( k !== '' )
								uty.loadImg(k, function( d ){
									if( d['typ'] == 'success' ){
										var con = el.find('.minus-gallery-body-inner'), ths = d['val'];
										con.html( ths );
										_t.current['elem'] = ths;
										_t.current['w'] = ths.width;
										_t.current['h'] = ths.height;
										_t.current['r'] = ( _t.current['w'] / _t.current['h'] ).toFixed( 2 );
										_t.adjust();
										_t.animate('opened');
										setTimeout(function(){ _t.initPlugins(); }, 10);
									}
								});
						},
						addEvent: function(){
							var _t = this;
							
							if( uty.detectEl( btn ) )
								btn.bind('click', function( e ){
									e.preventDefault();
									var ths = $( this ), uri = ths.attr('rel') || ths.attr('href') || '';
									if( uri !== '' )
										_t.set( uri );	
								});
							
							el.find('.gallery-close-btn').bind('click', function(){
								bdy.addClass( cls['closed'] );
								setTimeout(function(){
									bdy.removeClass( cls['closed'] ).removeClass( cls['ready'] ).removeClass( cls['animate'] );
									_t.destroy();
								}, 333);								
							});
							
							el.find('.gallery-nav-btn').bind('click', function(){
								var ths = $( this ), rel = ths.attr('rel') || '', le = items.length - 1;
								if( rel !== '' ){
									if( rel == 'next' ) currentItems++;
									if( rel == 'prev' ) currentItems--;
									if( currentItems < 0 ) currentItems = le;
									if( currentItems > le ) currentItems = 0;
									_t.set( items[ currentItems ] );
								}
							});
							
							win.bind('resize', function(){ _t.adjust(); });	
						},
						add: function(){
							el.append( this.template.gallery );
						},
						initPlugins: function(){
							var _t = this;
							if( _t.scroller !== null ) 
								_t.scroller.refresh();
							else		
								_t.scroller = new IScroll(el.find('.minus-gallery-body').get( 0 ), {
									zoom: true,
									scrollX: true,
									scrollY: true,
									mouseWheel: true,
									wheelAction: isMobile ? 'zoom' : ''
								});
						},
						init: function(){
							var _t = this;
								_t.add();
								_t.addEvent();
						}
					};
				main.init();    
				
				///////// PUBLIC FUNC
				this.loadImg = function( o ){
					items = o['items'] || '';
					if( items != '' )
						main.set( items[ 0 ] );
					else	
						main.set( o['uri'] );  
				};            
            })
        }
    })
})(jQuery, window);

$('body').minusGallery();

(function($) {
    $.fn.extend({
        minusMap: function( options, callback ){
            var defaults = {
				begin: 0
			};
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var o = options, 
					el = $( this ),
					uty = {
						trimText: function( k ){	return k.replace(/(^\s+|\s+$)/g,'');	},
						cleanText: function( k ){ return k.replace(/\s+/g, ''); },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						setCookie: function( o ){
							var date = new Date(), minutes = o['minutes'] || 15;
								date.setTime( date.getTime() + ( minutes * 60 * 1000 ) );
							$.cookie(o['name'] || '', o['value'] || '', { expires: date, path: '/' });
						},
						getCookie: function( o ){
							return $.cookie( o['name'] || '' );
						},
						ajx: function( o, callback ){
							$.ajax({
								type: o['type'] || 'GET',
								dataType: o['dataType'] || 'html',
								url: o['uri'] || '',
								data : o['param'] || {},
								contentType: o['contentType'] || '',
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
						}
					},
					main = {
						btn: el.find('.service-type li'),
						searchBtn: el.find('.search-btn'),
						newSearchBtn: el.find('.new-search-btn'), 
						city: el.find('.city-list'),
						county: el.find('.county-list'),
						serviceList: el.find('.service-list'),
						distanceList: el.find('.distance-list'),
						locationSearch: el.find('.locator-query-input'),
						changeSearch: el.find('.change-search-btn'),
						serviceView: el.find('.service-view li'),
						locationShare: el.find('.location-share-btn'),
						location: null,
						currentLocation: null,
						//currentLocation: { lat: 41.0202218, long: 28.8901934 },
						cls: { selected: 'selected', loading:'ajx-service', drpCustomClass: 'dropdown', drpOpened: 'opened', searchTyp1: 'search-typ-1', searchTyp2: 'search-typ-2', noResult: 'service-no-result', found: 'service-found', view1: 'service-view-list', view2: 'service-view-map', noCoor: 'no-coor', allowLocationBtn: 'allow-share-location-btn' },
						param: { svt: '' },
						clicklable: true,
						uri: {
							typ1: '/uyeBilgi/ajxUlkeSehir.aspx?ulk={{ulk}}&shr={{shr}}&tip={{tip}}&lang={{lang}}&svt={{svt}}&tum={{tum}}',
							typ2: '/moduls/servis/servisAjx.aspx?sec=&tip=liste&svt={{svt}}&dst={{dist}}&ulk={{ulk}}&shr={{shr}}&ilc={{ilc}}&lang={{lang}}&lat={{lat}}&long={{long}}&itext='
						},
						getUri: function( o ){
							var _t = this;	
							return _t['uri'][ o['typ'] || 'typ1' ].replace(/{{ulk}}/g, o['ulk'] || 1).replace(/{{shr}}/g, o['shr'] || '').replace(/{{tip}}/g, o['tip'] || '').replace(/{{lang}}/g, lang).replace(/{{svt}}/g, o['svt'] || '').replace(/{{tum}}/g, encodeURIComponent( translation['serviceListAll'] || 'Tümü')).replace(/{{dist}}/g, o['dist'] || -1).replace(/{{ilc}}/g, o['ilc'] || '').replace(/{{lat}}/g, o['lat'] || '').replace(/{{long}}/g, o['long'] || '');
						},
						loading: function( k ){
							var _t = this;
							if( k == 'add' ){
								_t.clicklable = false;
								el.addClass( _t['cls']['loading'] );
							}else{
								_t.clicklable = true;
								el.removeClass( _t['cls']['loading'] );
							}
						},
						selectBoxToHtml: function( k ){
							var _t = this, e = $('option', k), htm = '<span>'+ $('option:selected', k).text() +'</span><ul>';
							e.each(function(){
								var ths = $( this ), val = ths.val() || '', rel = ths.attr('rel') || '', txt = uty.trimText( ths.text() ), cls = ths.is(':selected') ? _t['cls']['selected'] : '' ;
								htm += '<li class="'+ cls +'" data-val="'+ val +'" data-coor="'+ rel +'"><a href="javascript:void(0)"><span>'+ txt +'</span></li></li>'
							});
							htm += '</ul>';
							return htm;
						},
						clearParam: function( k ){ return k.replace(/<\/SHR_INPUT>/g, '').replace(/<SHR_INPUT>/g, ''); },
						changeHtml: function( ID ){ 
							var _t = this;
							ID = $( ID );
							$('.pServisListe', ID)
							.each(function( i ){
                                var ths = $( this ), k = ths.find('.divServisListe_Telefon');
									ths
									.attr('data-id', i)
									.find('.divServisListe_Koordinat a')
									.removeAttr('onclick');
									 
									if( uty.detectEl( k ) )
										k.html('<a href="tel:'+ uty.cleanText( k.text() ) +'"><span>'+ k.html() +'</span></a>');
									
									k = ths.find('.divServisListe_Email');
									if( uty.detectEl( k ) )
										k.html('<a href="mailto:'+ uty.cleanText( k.text() ) +'"><span>'+ k.html() +'</span></a>');	
									
									k = ths.find('.divServisListe_Koordinat a').attr('href', 'javascript:void(0);').attr('rel') || '';	
									if( k === '' ) ths.addClass( _t['cls']['noCoor'] );
										
                            })
							.prepend('<span class="distance-service"></span><span class="service-close-btn"><i></i></span>');
							return ID;
						},
						add: function( o ){
							var _t = this, k = _t.clearParam( o['val'] );
							if( o['typ'] == 'city' ) 
								_t.city.find('.dropdown').html( _t.selectBoxToHtml( k ) );
							else if( o['typ'] == 'county' ) 
								_t.county.find('.dropdown').html( _t.selectBoxToHtml( k ) );
							else if( o['typ'] == 'serviceList' ){  
								_t.serviceList.html( _t.changeHtml( k ) );	
								_t.contentAddEvent();
								_t.setDistance();
								maps.set();
							}
						},
						distanceFrom: function( o ){
							var _t = this;
							if( _t.currentLocation != null ){
								var	c = { lat1: _t.currentLocation['lat'] || '', lat2: o['lat'] || '', lng1: _t.currentLocation['long'] || '', lng2: o['lng'] || '' },
									R = 6378137,
									dLat = ( c.lat2 - c.lat1 ) * Math.PI / 180,
									dLng = ( c.lng2 - c.lng1 ) * Math.PI / 180,
									a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
										Math.cos( c.lat1 * Math.PI / 180 ) * Math.cos( c.lat2 * Math.PI / 180 ) *
										Math.sin( dLng / 2 ) * Math.sin( dLng / 2 ),
									c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) ),
									d = R * c;
					
								return d;	
							}
							return null;
						},
						setDistance: function(){
							var _t = this;
							if( _t.currentLocation != null )
								$('.pServisListe', el)
								.each(function( i ){
									var ths = $( this ), k = ths.find('.divServisListe_Koordinat a').attr('rel') || '';
									if( k != '' ){
										k = k.split('|');
										k = _t.distanceFrom( { lat: k[ 0 ], lng: k[ 1 ] } );
										if( k !== null )
											ths.find('.distance-service').html( '<i>' + ( k / 1000 ).toFixed( 1 ) + ' km<\/i>'  );	
									}
								});
						},
						focusContent: function( k ){
							var _t = this, e = $('[data-id="'+ k +'"]', _t.serviceList);
							if( uty.detectEl( e ) )
								e.addClass( _t['cls']['selected'] ).siblings().removeClass( _t['cls']['selected'] );
						},
						clearContent: function(){
							var _t = this;
								_t.serviceList.html('');	
								maps.deleteMarkers();
						},
						contentAddEvent: function(){
							var _t = this;
							$('.pServisListe .divServisListe_Koordinat a', el).unbind('click').bind('click', function(){
								var id = $( this ).parents('.pServisListe').attr('data-id') || '';
								if( id != '' ){
									maps.focusMarkers( id );
									el.removeClass( _t['cls']['view1'] ).addClass( _t['cls']['view2'] );
								}
							});
							$('.service-close-btn', el).unbind('click').bind('click', function(){
								$( this ).parents('.pServisListe').removeClass( _t['cls']['selected'] );
							});
						},
						drpAddEvent: function(){
							var _t = this, cls = _t['cls']['drpCustomClass'], opCls = _t['cls']['drpOpened'], sCls = _t['cls']['selected'], drp = el.find('.' + cls);
							
							$('.' + cls + ' > span', el)
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ).parent('.' + cls);
								if( ths.hasClass( opCls ) ) drp.removeClass( opCls );
								else{
									drp.removeClass( opCls );
									ths.addClass( opCls );
								}
							});
							
							$('.' + cls + ' > ul li', el)
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ), target = ths.parents('[data-target]').attr('data-target') || '';
									ths.addClass( sCls ).siblings('li').removeClass( sCls ).parents('.' + cls).find('> span').text( ths.text() );
								drp.removeClass( opCls );
								
								if( _t.clicklable && target != '' ){
									_t.loading('add');
									var uri = _t.getUri({ typ: 'typ1', shr: ths.attr('data-val'), tip: ths.parents('[data-type]').attr('data-type') || '', svt: _t.param['svt'] });
									uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' ){											
												_t.add({ typ: target, val: o['val'] });
												_t.loading('remove');
												_t.drpAddEvent();
											}else
												_t.loading('remove');
										});
								}
							});
							
						},
						addEvent: function(){
							var _t = this;
							
							/* konum paylaş */
							if( navigator.geolocation && window.location.protocol == 'https:' ){
								if( uty.detectEl( _t.locationShare ) ){
									
									var onShareClick = function(){
										var uri = _t.getUri({ typ: 'typ2', shr: '', ulk: '', ilc: '', dist: $('.selected', _t.distanceList).attr('data-val') || 5, svt: _t.param['svt'], lat: _t.currentLocation.lat, long: _t.currentLocation.long });
										_t.loading('add');
										uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' )											
												_t.add({ typ: 'serviceList', val: o['val'] });
											_t.loading('remove');
										});
									};
									
									el.addClass( _t['cls']['allowLocationBtn'] );
									_t.locationShare.bind('click', function(){
										
										if( _t.currentLocation != null ) onShareClick();
										else										
											navigator.geolocation.getCurrentPosition(function( position ){
												if( position.coords ){
													_t.currentLocation = { lat: position.coords.latitude, long: position.coords.longitude };
													uty.setCookie({ name: 'myCurrentPosition', value: JSON.stringify( _t.currentLocation ) });
													onShareClick();
												}else
													_t.currentLocation = null;
											});
									});
								}
								
							}
							
							/* servis görünümü: liste - harita */
							if( uty.detectEl( _t.serviceView ) )
								_t.serviceView.bind('click', function(){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( rel !== '' ){
										if( rel == 'list' )
											el.addClass( _t['cls']['view1'] ).removeClass( _t['cls']['view2'] );
										else	
											el.removeClass( _t['cls']['view1'] ).addClass( _t['cls']['view2'] );
									}	
								}).
								eq( 0 )
								.click();							
							
							/* yetkili servis - arcelik magazalar */
							if( uty.detectEl( _t.btn ) ){
								var cls = '';
								_t.btn.each(function(){ cls += ( ( $( this ).attr('data-cls') || '' ) + ' '); });
								_t.btn.bind('click', function(){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( _t.clicklable && rel != '' ){ 
										el.removeClass( cls ).addClass( ths.attr('data-cls') || '' );
										ths.addClass( _t['cls']['selected'] ).siblings('li').removeClass( _t['cls']['selected'] );
										var uri = _t.getUri({ typ: 'typ1', tip: 'servisSehir', svt: rel });
										_t.loading('add');
										_t.param['svt'] = rel;
										uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' ){
												var uri = _t.getUri({ typ: 'typ1', tip: 'servisIlce', svt: rel });
												_t.add({ typ: 'city', val: o['val'] });
												uty.ajx({ uri: uri }, function( o ){
													if( o['type'] == 'success' ){
														_t.add({ typ: 'county', val: o['val'] });
														_t.loading('remove');
														_t.drpAddEvent();
														_t.clearContent();
													}
												});
											}else
												_t.loading('remove');
										});
									}
								});
								
								var id = minusLoc.get('?', 'svt', urlString) || '';
								if( id !== '' ){
									var e = el.find('.service-type li[rel="'+ id +'"]');
									if( uty.detectEl( e ) )
										e.click();
								}else
									_t.btn
									.eq( o.begin )
									.click();
							}
							
							/* listele buton; il/ilçe dropdown veya yazarak */
							if( uty.detectEl( _t.searchBtn ) )
								_t.searchBtn.bind('click', function(){
									if( _t.clicklable ){
										var uri = _t.getUri({ typ: 'typ2', shr: _t.city.find('li.selected').attr('data-val') || '', ilc: _t.county.find('li.selected').attr('data-val') || '', svt: _t.param['svt'] });
										
										if( el.hasClass( _t['cls']['searchTyp2'] ) ){
											if( _t.location !== null )
												uri = _t.getUri({ typ: 'typ2', shr: '', ulk: '', ilc: '', dist: $('.selected', _t.distanceList).attr('data-val') || 5, svt: _t.param['svt'], lat: _t.location.lat, long: _t.location.long });
											else{
												alert( translation['locationSearch'] );
												return false;
											}
										}
										
										_t.loading('add');
										uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' )											
												_t.add({ typ: 'serviceList', val: o['val'] });
											_t.loading('remove');
										});
									}
								});
						
							/* yazarak arama */
							if( uty.detectEl( _t.locationSearch ) ){
								var location = new google.maps.places.Autocomplete(_t.locationSearch[0], { types: ['geocode'] });
									location.addListener('place_changed', function(){
										var place = location.getPlace();
										if( place.geometry && place.geometry.location )
											_t.location = { lat: place.geometry.location.lat(), long: place.geometry.location.lng() };	
										else{
											_t.locationSearch.val('');
											_t.location = null;
										}
									});
							}
							
							/* arama tipleri arası eçiş için il/ilçe dropdown veya yazarak */
							if( uty.detectEl( _t.changeSearch ) )
								_t.changeSearch.bind('click', function(){
									if( el.hasClass( _t['cls']['searchTyp1'] ) )
										el.removeClass( _t['cls']['searchTyp1'] ).addClass( _t['cls']['searchTyp2'] );
									else	
										el.addClass( _t['cls']['searchTyp1'] ).removeClass( _t['cls']['searchTyp2'] );
								})
								.click();
							
							/* yeniden arama yapmak için başa döndürür */	
							if( uty.detectEl( _t.newSearchBtn ) )
								_t.newSearchBtn.bind('click', function(){
									el.removeClass( _t['cls']['found'] );
								});	
								
							/* body clicked dropdown kapatmak için */	
							$('body, html').bind('click touchstart', function( e ){
								var m = el.find('.' + _t['cls']['drpCustomClass']); 
								if( !m.is( e.target ) && m.has( e.target ).length === 0 )
									m.removeClass( _t['cls']['drpOpened'] );
							});																						
						},
						setCurrentLocation: function(){
							var _t = this, k = uty.getCookie({ name: 'myCurrentPosition' }) || '';
							if( k !== '' )
								_t.currentLocation = JSON.parse( k );
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( _t.city ) && uty.detectEl( _t.county ) ){
								_t.setCurrentLocation();
								_t.addEvent();
							}
						}
					},
					maps = {
						content: '.pServisListe',
						markersArr: [],
						speed: 100,
						zoomout: null,
						zoomin: null,
						map: null,
						infowindow: null,
						mapDiv: el.find('.service-map'),
						settings: {
						  zoom: 7,
						  center: { lat: 39.08719, lng: 35.177914 },
						  mapTypeId: 'terrain'
						},
						iconSrc: { 'default': '/images/frontend/map_icon.png', 'active': '/images/frontend/map_icon.png', 'my': '/images/frontend/map_icon.png' },
						getPosition: function( k ){
							var _t = this;
							k = k.replace(/\,/, '.').split('|');
							return new google.maps.LatLng( k[ 0 ], k[ 1 ] );
						},
						addMarker: function( o ){
							var _t = this,
								id = o['id'] || '', 
								htm =  o['htm'] || null,
								ico =  o['ico'] || 'default',
								marker = new google.maps.Marker({ id: id, position: o['pos'], map: _t.map, html: htm, title: o['name'], draggable: false, shadow: null, animation: google.maps.Animation.DROP, icon: _t.iconSrc[ ico ] });
								_t.markersArr.push( marker );
								
							google.maps.event.addListener(marker, 'click', function(){
								var ths = this;
								main.focusContent( ths.id );
								_t.infowindow.close();
								_t.moveToPointZoom( ths.position, 14, { x: 0, y: 0 }, function(){
									_t.infowindow.setContent('<div class="marker-customize">' + ths.html + '</div>' );
									_t.infowindow.open( _t.map, ths );
								});
							});
						},
						focusMarkers: function( k ){
							var _t = this;
							if( _t.markersArr.length > 0 ){
								for( i in _t.markersArr ){
									var m = _t.markersArr[ i ];
									if( m.id == k ){
										google.maps.event.trigger(m, 'click');
										break;
									}
								}	
							}
						},
						deleteMarkers: function(){
							var _t = this;
							if( _t.markersArr.length > 0 ){
								for( i in _t.markersArr )
									if( _t.markersArr[ i ] != null ) 
										_t.markersArr[ i ].setMap( null );
								_t.markersArr.length = 0;
							}
						},
						set: function(){
							var _t = this, e = el.find( _t.content ), bnd = new google.maps.LatLngBounds();
							
							_t.control( e );
							_t.deleteMarkers();
								
							e.each(function( i, k ){
                                var ths = $( this ), pos = uty.trimText( $('.divServisListe_Koordinat a', ths).attr('rel') || '' );
								if( pos !== '' ){
									pos = _t.getPosition( pos );
									bnd.extend( pos );
									_t.addMarker({ id: ths.attr('data-id') || '', name: uty.trimText( $('.divServisListe_FirmaAdi', ths).text() || '' ), htm: ths.html(), pos: pos });
								}
							});
							
							_t.map.fitBounds( bnd );	
							if( _t.map.getZoom() > 15 ) 
								_t.map.setZoom( 15 );
						},
						clearInt: function(){
							var _t = this;
							if( _t.zoomout != null ) 
								clearInterval( _t.zoomout );
							if( _t.zoomin != null ) 
								clearInterval( _t.zoomin );
						},	
						moveToPointZoom: function( point, zmax, offset, callback ){
							
							var _t = this, currentZoom = _t.map.getZoom(), currentBounds;
								
								_t.clearInt();
								
								_t.zoomout = setInterval(function(){
									currentBounds = _t.map.getBounds();
									if( !currentBounds.contains( point ) ){
										_t.map.setZoom( currentZoom );
										currentZoom--;
									}else{
										
										_t.clearInt();
										
										if(offset){
											var point1 = _t.map.getProjection().fromLatLngToPoint( point ),
												point2 = new google.maps.Point(
													( ( typeof( offset.x ) == 'number' ? offset.x : 0) / Math.pow( 2, zmax ) ) || 0,
													( ( typeof( offset.y ) == 'number' ? offset.y : 0) / Math.pow( 2, zmax ) ) || 0
												);
											point = _t.map.getProjection().fromPointToLatLng( new google.maps.Point( point1.x - point2.x, point1.y + point2.y ) );
										}
						
										_t.map.panTo( point );
										currentZoom = _t.map.getZoom();
										_t.zoomin = setInterval(function(){
											
											if( currentZoom < zmax ){
												_t.map.setZoom( currentZoom );
												currentZoom++;
											}else{
												_t.clearInt();
												if( typeof callback !== 'undefined' ) callback();
											}
						
										}, _t.speed);
									}
						
								}, _t.speed);
						},
						control: function( ID ){
							if( uty.detectEl( ID ) )
								el.addClass( main['cls']['found'] ).removeClass( main['cls']['noResult'] );
							else
								el.removeClass( main['cls']['found'] ).addClass( main['cls']['noResult'] );	
						},
						init: function(){
							var _t = this;	
								_t.map = new google.maps.Map( _t.mapDiv.get( 0 ), _t.settings );
								_t.infowindow = new google.maps.InfoWindow({ content: translation['infoWindowMap'] || 'Loading Content...', maxWidth: 350 });	
						}
					};
				maps.init();
				main.init();
				
            })
        }
    })
})(jQuery, window);

$('.footer-map').html('<div class="service-sidebar"> <div class="service-nav"> <ul class="service-view"> <li rel="list"><a href="javascript:void(0);">LİSTE</a></li><li rel="map"><a href="javascript:void(0);">HARİTA</a></li></ul> <ul class="service-type"> <li rel="1860"><a href="javascript:void(0);">YETKİLİ SERVİSLER</a></li><li rel="1859"><a href="javascript:void(0);">ARÇELİK MAĞAZALARI</a></li></ul> <ul class="service-location"> <li class="location-search-input"> <input placeholder="İL / İLÇE" name="query" type="text" class="locator-query-input" autocomplete="off"> </li><li class="city-list" data-target="county" data-type="servisIlce"> <div class="dropdown"><span>Tümü</span> <ul> </ul> </div></li><li class="county-list"> <div class="dropdown"><span>Tümü</span> <ul> </ul> </div></li><li class="distance-list"> <div class="dropdown"><span>SEÇİNİZ</span> <ul> <li data-val="-1"><a href="javascript:void(0)"><span>SEÇİNİZ</span></a></li><li class="selected" data-val="5"><a href="javascript:void(0)"><span>5 KM</span></a></li><li data-val="10"><a href="javascript:void(0)"><span>10 KM</span></a></li><li data-val="15"><a href="javascript:void(0)"><span>15 KM</span></a></li><li data-val="20"><a href="javascript:void(0)"><span>20 KM</span></a></li></ul> </div></li><li class="location-search-btn"><a href="javascript:void(0);" class="search-btn">LİSTELE</a></li><li class="location-change-search"><a href="javascript:void(0);" class="change-search-btn"><span class="type-1">YAZARAK ARAMA...</span><span class="type-1">İL İLÇE İLE ARAMA...</span></a></li><li class="new-search"><a href="javascript:void(0);" class="new-search-btn"><span>Yeni Arama Yap</span></a></li><li class="location-share"><a href="javascript:void(0);" class="location-share-btn"><span>Konum Paylaş</span></a></li></ul></div><div class="service-list"></div></div><div style="width:100%;height:100%;" id="map" class="service-map"></div>');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// PLUGINS
(function($){
	$.fn.extend({
		minusSlider : function(options){
			var defaults = {	};
			
			var option = $.extend( defaults, options );
			
			return this.each(function( e ){
				var o = option,
					con = $( this ),
					main = {
						auto: false,
						current: null,
						typ: {
							main: { 
								prop: {
									nextText: '<i class="ems-icon next"></i>', 
									prevText: '<i class="ems-icon prev"></i>', 
									mode: 'horizontal', 
									pager: true, 
									adaptiveHeight: true,
									video: true,
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderLoad: function(){ 
										var ths = this;
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
									},
									onSlideBefore: function(){ 
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths );
									},
									onSlideAfter: function(){ 
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							},
							alpha: { 
								prop: {
									nextText: '<i class="ems-icon next"></i>', 
									prevText: '<i class="ems-icon prev"></i>', 
									mode: 'horizontal', 
									pager: true,
									adaptiveHeight: true,
									video: true, 
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderLoad: function(){ 
										var ths = this;
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
									},
									onSlideBefore: function(){ 
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths );
									},
									onSlideAfter: function(){ 
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							},
							widget: { 
								prop: { 
									nextText: '<i class="ems-icon next"></i>', 
									prevText: '<i class="ems-icon prev"></i>',
									pager: true, 
									slideWidth: 225,
									minSlides: 3,
									maxSlides: 5,
									moveSlides: 3,
									slideMargin: 0,
									infiniteLoop: false,
									hideControlOnEnd: true,
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderResize: function(){
										var ths = this;
										main['events']['sliderResize']( ths );
									},
									onSliderLoad: function(){ 
										var ths = this;
											ths.slides = 5; 
										main['events']['sliderResize']( ths );
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
										
									},
									onSlideBefore: function(){
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths ); 
									},
									onSlideAfter: function(){  
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							}	
						},
						cls: { activePlugins: 'plugins-active', activeVideo: 'video-active', isPause: 'isPause', isPlay: 'isPlay', noControls: 'no-controls' },
						addPager: function( ID ){ ID.append('<div class="sld-pager"><strong></strong><span></span></div>'); },
						addOrder: function( ID ){ ID.each(function( i, k ){ $( this ).attr('data-order', i);  }); },
						customThumb: function( ID ){
							if( !uty.detectEl( $('.thumb-pager', ID) ) ) 	return false;
							var _t = this, drp = $('.thumb-pager', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
							s.each(function( i, k ){
								var ths = $( this ), tt = ths.attr('data-thumb') || '';
								if( tt != '' )
									htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);"><img src="'+ tt +'" border="0"/></a></li>';
							});
							drp.find('ul').html( htm );
							
							var sld = null;
							if( drp.find('ul > li').length > 3 )
								sld = uty.slider({ ID: drp.find('ul'), prop: { mode: 'vertical', infiniteLoop: true, slideWidth: 155, minSlides: 3, maxSlides: 3, moveSlides: 1, slideMargin: 5, pager: false, controls: true } });
															
							$('ul li', drp).bind('click', function(){
								var ths = $( this ), k = ths.attr('data-order') || 0;
								$('.bx-pager a[data-slide-index="'+ k +'"]', ID).click();
								if( sld != null ){
									if( $('.bx-viewport', drp).offset().top != ths.offset().top )
										sld.goToNextSlide();
									else
										sld.goToPrevSlide();	
								}
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
						customContentClosed: function( ID ){
							if( !uty.detectEl( $('.swiper-content-close', ID) ) ) return false;
							var btn = $('.swiper-content-close', ID), cls = { closed: 'swiper-content-closed' };
							
							btn
							.bind('click', function(){
								var ths = $( this ), k = ths.parents('[data-order]').attr('data-order') || '';
								if( k != '' ){
									k = $('[data-order="'+ k +'"]', ID);
									if( uty.detectEl( k ) )
										k.toggleClass( cls['closed'] );
								}
							})
						},
						customLargeBtn: function( ID ){
							var btn = $('.imageSize a', con);
							if( !uty.detectEl( btn ) ) return false;
							 
							ID
							.find('.swiper-img a')
							.bind('click', function( e ){ e.preventDefault(); });
							 
							btn
							.bind('click', function(){ 
								var e = con.find('.swiper-inner [aria-hidden="false"]'), k = e.find('.swiper-img a').attr('href') || '';
								if( k != '' ){
									
									var arr = [];
										arr.push( k );	
									e.siblings().each(function(index, element) {
										var ths = $( this ), hrf = ths.find('.swiper-img a').attr('href') || ''
                                        if( hrf !== '' && !ths.hasClass('bx-clone') )
											arr.push( hrf )
                                    });	
									
									bdy.get( 0 ).loadImg( { uri: k, items: arr } );
								}
							});
						},
						lazy: function( ID ){
							var _t = this, img = $('.lazy-load', ID);	
							if( uty.detectEl( img ) )
								 img
								 .css({'opacity': 0})
								 .attr('src', img.attr('data-original'))
								 .one('load', function(){ 
								 	var ths = $( this );
								 
									ths
									.addClass('load-image')
									.removeClass('lazy-load')
									.stop()
									.animate({ 'opacity': 1 }, 222);
									
									var ord = ths.parents('li').eq( 0 ).attr('data-order') || '';
									if( ord !== '' )
										$('.swiper-inner [data-order="'+ ord +'"]', con).css('background-image', 'url('+ ( ths.attr('data-original') || '' ) +')').addClass('load-back-image');
									
									
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
						detectVideo: function(){
							var _t = this;
							$('ul li.type-video', con)
							.each(function(){
                                var ths = $( this ), s = $('.swiper-content', ths);
								if( uty.detectEl( $('.youtubePlayer', s) ) ){
									s.off('playerState');
									s.get( 0 ).stopVideo();
									ths.removeClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] ).removeClass( _t.cls['activeVideo'] );
								}
                            });
						},
						activeVideo: function(){
							var _t = this, el = con.find('[aria-hidden="false"]'), s = $('.youtubePlayer', el);
							if( uty.detectEl( s ) ){
								$('.swiper-content', el)
								.off('playerState')
								.on('playerState', function( events, k ){
									if( k == 'ended' && _t.current !== null )
										_t.current.goToNextSlide();
									else if( k == 'playing' || k == 'buffering' ){ 
										_t.autoControl.clear();
										el.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
									}else if( k == 'paused' )
										el.removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
								});
							}
						},
						events: {
							
							onTouchStart: function(){
								main.detectVideo();
								main.autoControl.clear();
							},
							
							onTouchMove: function(){
							
							},
							
							onTouchEnd: function(){
							
							},
							
							slideBefore: function(){
								main.detectVideo();
								main.autoControl.clear();
							},
							
							slideAfter: function(){
								main.activeVideo();
								main.autoControl.init();
							},
							
							sliderDisabled: function( k ){
								setTimeout(function(){
									if( k == 'add' ) con.addClass('disabled');
									else con.removeClass('disabled');
								}, 10);
							},
					
							sliderLoad: function( ths ){
								setTimeout(function(){ 
									$('li.bx-clone', ths).each(function(){ main.lazy( $( this ) ); }); 
									main.autoControl.init();
								}, 0);
							},
					
							sliderControl: function( ths ){
								
								setTimeout(function(){
									
									var pager = con.find('.sld-pager'), act = con.find('[aria-hidden="false"]'), cnt = con.find('.headline-holder'), drp = $('.ems-custom-dropdown', con), thumb = $('.thumb-pager', con), current = ths.getCurrentSlide(), bx = $('.bx-viewport', con);
									
									if( uty.detectEl( cnt ) )
										$('> ul > li[data-order="'+ current +'"]', cnt).addClass('active').siblings('li').removeClass('active');
									
									if( uty.detectEl( pager ) ){
										pager.find('strong').text( current + 1 );
										pager.find('span').text( '/ ' + ths.getSlideCount() );
									}
									
									if( ths.slides !== undefined ) 
										act = main.activeElements({ el: ths, c: current, k: ths.slides });
									
									if( uty.detectEl( bx ) && ths.slides === undefined )	
										bx.height( act.height() );	
										
									if( uty.detectEl( drp ) ){
										var k = $('.ems-custom-dropdown-header a', drp), e = $('.ems-sub li[data-order="'+ current +'"]', drp);
										if( uty.detectEl( k ) && uty.detectEl( e ) ){
											k.html( e.text() );
											e.addClass('selected').siblings('li').removeClass('selected');
										}
									}
									
									if( uty.detectEl( thumb ) ){
										$('li', thumb).removeClass('selected');
										$('li[data-order="'+ current +'"]', thumb).addClass('selected');
									}
									
									if( uty.detectEl( act ) )
										$.each(act, function(){ main.lazy( $( this ) ); });
								}, 0);
							},
					
							sliderResize: function( ths ){
								setTimeout(function(){ 
									con.find('.swiper-inner').css('max-width', parseFloat( con.find('.bx-wrapper').css('max-width') ));
									if( con.find('.bx-default-pager > div').length > 1 )
										con.removeClass( main.cls['noControls'] );
									else
										con.addClass( main.cls['noControls'] );
								}, 0);
							}
						},
						set: function( ID ){
							var _t = this, typ = 'main', duration = ID.attr('data-duration') || '';
							if( ID.hasClass('visilabs-widget') ) typ = 'widget';
							else if( ID.hasClass('swiper-alpha') ) typ = 'alpha';
							
							if( duration !== '' ) _t.auto = true;
			
							var s = $('.swiper-inner > ul', ID);
							if( $('> li', s).length > 1 ){ 
								ID.addClass( _t['cls']['activePlugins'] );
								_t.addPager( ID );
								_t.addOrder( $('> li', s) );
								_t.customDropDown( ID );
								_t.customThumb( ID );
								_t.customContentClosed( ID );	
								_t.customLargeBtn( ID );								
								_t.current = s.bxSlider( _t.typ[ typ ]['prop'] || {} );
							}else
								_t.lazy( ID );
						},
						addEvents: function(){
							var _t = this, videoBtn = $('.btn-video-play', con);
							
							if( uty.detectEl( videoBtn ) ){
								videoBtn.bind('click', function(){
									var ths = $( this ), prt = ths.parents('li'), s = ths.siblings('.swiper-content'), vid = ths.attr('data-video') || '';
									if( vid != '' ){
										prt.addClass( _t.cls['activeVideo'] );
										if( !uty.detectEl( $('.youtubePlayer', s) ) ){
											s.minusPlayer({ videoId: vid, controls: 0, autoplay: isMobile ? 0 : 1, customClass: 'yt-video-player', orientation: 'vertical' });
											prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
											
										}else{
											var k = s.get( 0 );
											if( k.state() ){
												k.pauseVideo();
												prt.removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
											}
											else{
												k.playVideo();
												prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
											}
										}
										_t.activeVideo();
										_t.autoControl.clear();	
									}
								});
							}
						},
						autoControl: {
							stm: null,
							delay: con.attr('data-duration') || 5000,
							clear: function(){
								var _t = this;
								if( _t.stm != null )
									clearTimeout( _t.stm );
							},
							start: function(){
								var _t = this;
								
								if( main.auto ){
									_t.clear();
									_t.stm = setTimeout(function(){
										if( main.current !== null )
											main.current.goToNextSlide();
									}, _t.delay);	
								}
							},
							init: function(){
								this.start();
							}
						},						
						init: function(){
							var _t = this;
								_t.set( con );
								_t.addEvents();
						}
					};
					main.init();
			});
		}
	});
})(jQuery);


(function($) {
    $.fn.extend({
        minusTabMenu: function( options, callback ){
            var defaults = {
				speed: 222,
				easing: 'easeInOutExpo',
				begin: 0,
				dropdown: false
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var o = options, 
					el = $( this ),
					wrp = el.find('> .ems-tab-inner'),
					main = {
						nav: wrp.find('.navigation-js'),
						con: wrp.find('> .content-js'),
						cls: { selected: 'selected' },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						pageScroll: function( k, callback ){
							var _t = this;
							$('html, body').stop().animate({ scrollTop: k }, o['speed'] , o['easing'], function(){ 
								if( typeof callback !== 'undefined' )
									callback();  
							});
						},
						getNavigationTemplate: function(){
							var _t = this;
							$('> li', _t.con).each(function(){
								var ths = $( this ), rel = ths.attr('rel') || '', e = ths.find('> a');
								htm += '<li rel="'+ rel +'"><a href="javascript:void(0);">'+ e.html() +'</a></li>';
							});
							return htm;	
						},
						setNavigation: function(){
							var _t = this;
							if( _t.detectEl( _t.nav ) )
								if( !_t.detectEl( $('li', _t.nav) ) )
									_t.nav.html( _t.getNavigationTemplate() );
						},
						addEvent: function(){
							var _t = this;
							$('> li', _t.nav).bind('click', function(){
								var ths = $( this ), rel = ths.attr('rel') || '';
								if( rel != '' )
									$('> li[rel="'+ rel +'"]', _t.con).add( ths ).addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
							})
							.eq( o.begin )
                            .click();
							
							$('> li > a', _t.con).bind('click', function(){
								var ths = $( this ).parent('li'), rel = ths.attr('rel') || '';
								if( rel != '' ){
									if( ths.hasClass( _t.cls['selected'] ) )
										$('> li[rel="'+ rel +'"]', _t.nav).add( ths ).removeClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
									else{
										$('> li[rel="'+ rel +'"]', _t.nav).add( ths ).addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
										_t.pageScroll( ths.offset().top );	
									}
								}
							});
						},
						add: function(){
							var _t = this;
							if( wrp.find('> .dropdown').length == 0 && _t.nav.length > 0 && o.dropdown ){
								wrp.prepend('<div class="dropdown mobi-ver"><span></span><ul class="navigation-js">'+ _t.nav.html() +'</ul></div>');
								_t.nav = wrp.find('.navigation-js');
								wrp.find('> .dropdown').minusCustomDropDown();
							}
							
							$('> li', _t.con).each(function(){
                                var ths = $( this );
								if( ths.find('> a').length == 0 ){
									var e = $('> li[rel="'+ ( ths.attr('rel') || '' ) +'"]', _t.nav);
									if( e.length > 0 )
										ths.prepend( e.find('a').clone() );
								}
                            });
						},
						init: function(){
							var _t = this;
							if( _t.detectEl( _t.con ) ){
								_t.add();
								_t.setNavigation();
								_t.addEvent();
							}
						}
					};
				main.init();
				
            })
        }
    })
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusMenu: function(options, callback) {
            var defaults = {
				closeElem: '',
				items: '> ul > li',
				siblings: 'li',
				controls: '> ul, > div',
				customClass: 'selected',
				openedDelay: 200,
				closedDelay: 555,
				eventType: 'hover',
				clickedElem: '> a',
				bdyClicked: false,
				isVisible: '',
				setPos: false,
				overlay: false,
				bdyCls: ''
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					el = $( this ),
					items = el.find( o.items ),
                    main = {
						stm: null,
						clearTm: function(){
							var _t = this;
							if( _t.stm != null )
								clearTimeout( _t.stm );
						},
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						isVisible: function(){
							var _t = this, b = false;
							if( o.isVisible !== '' ){
								var e = $( o.isVisible );
								if( _t.detectEl( e ) )
									if( e.is(':visible') )
										b = true;	
							}
							return b;
						},
						overlayControls: function( k ){
							var _t = this;
							if( o.overlay ){
								if( k == 'opened' ) bdy.addClass( o.bdyCls );
								else{ 
									var e = el.find( o.items + '.' + o.customClass );
									if( !_t.detectEl( e ) ) 
										bdy.removeClass( o.bdyCls );
								}
							}
						},
						setPos: function( ID ){
							if( o.setPos ){
								var _t = this, k = $(o.controls, ID);
								if( _t.detectEl( k ) ){
									var e = $('.site-header-inner-top'), x1 = ID.offset().left + 810, x2 = e.width() + e.offset().left;
									if( x1 >= x2 ) k.css({ 'left': x2 - x1 });
								}
							}
						},
						closeElem: function(){
							if( o.closeElem != '' )
								$( o.closeElem ).each(function(){
									var ths = $( this ).get( 0 );
									if( typeof ths.closed !== 'undefined' )	
										ths.closed();
								});
						},
						events: {
							onMouseEnter: function(){
								var _t = main, ths = $( this );
								
								if( _t.isVisible() ) return false;
								
								if( _t.detectEl( $(o.controls, ths) ) ){
									_t.clearTm();
									_t.stm = setTimeout(function(){
										_t.closeElem();
										ths.addClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.setPos( ths );
										_t.overlayControls('opened');
									}, o.openedDelay);
								}
							},
							onMouseLeave: function(){
								var _t = main, ths = $( this );
									if( _t.isVisible() ) return false;
									_t.clearTm();
									_t.stm = setTimeout(function(){
										ths.add( ths.siblings( o.siblings ) ).removeClass( o.customClass );
										_t.overlayControls('closed');
									}, o.closedDelay);
							},
							onClick: function( e ){
								var _t = main, ths = $( this ).parent( o.siblings );
								if( _t.detectEl( $(o.controls, ths) ) && !_t.isVisible() ){
									e.preventDefault();
									if( ths.hasClass( o.customClass ) ){
										ths.removeClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.overlayControls('closed');
									}else{
										ths.addClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.setPos( ths );
										_t.overlayControls('opened');
									}
								}
							},
							bdyClicked: function( e ){
								var _t = main;
								if( !el.is( e.target ) && el.has( e.target ).length === 0 && !_t.isVisible() ){
									$('.' + o.customClass, el).removeClass( o.customClass );
									_t.overlayControls('closed');
								}
							}
						},
						addEvent: function(){
							var _t = this;
							
							if( o.eventType == 'hover' )
								items.bind('mouseenter', _t.events.onMouseEnter).bind('mouseleave', _t.events.onMouseLeave);
							else if( o.eventType == 'click' )
								$(o.clickedElem, items).bind('click', _t.events.onClick);		
							
							if( o.bdyClicked )
								$('body, html').bind('click touchstart', _t.events.bdyClicked);
						},
						destroy: function(){
							var _t = this;
							$('.' + o.customClass, el).removeClass( o.customClass );
							_t.overlayControls('closed');
						},
						init: function(){
							var _t = this;
								_t.addEvent();
						}
					};  
				
				
				this.closed = function() {
                    if( main.stm != null ) clearTimeout( main.stm );
                    main.destroy()
                };
				
				main.init();              
            })
        }
    })
})(jQuery, window);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
				data : o['param'] || {},
				contentType: o['contentType'] || '',
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
		getScript: function( o, callback ){
			$.getScript(o['uri'], function(){
				if( typeof callback !== 'undefined' ) 
					callback();
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
		unVeil: function( ID ){
			var _t = this;
			if( _t.detectEl( $('img.lazyload', ID) ) )
				$('img.lazyload', ID).unveil().trigger('unveil');
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
		clearScriptTag: function( k ){
			var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
			while( SCRIPT_REGEX.test( k ) )
				k = k.replace(SCRIPT_REGEX, '');	
			return k;
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
				if (t === 1)
					newArr.push(f);
				
			}
			return newArr;
		},
		getCat: function(){
			return minusLoc.get('?', 'kat', urlString) || '';
		},
		isVisible: '.mbHeader',
		visibleControl: function(){
			var _t = this, b = false;
			if( _t.isVisible !== '' ){
				var e = $( _t.isVisible );
				if( uty.detectEl( e ) )
					if( e.is(':visible') )
						b = true;	
			}
			return b;
		},
		Cookies: function( o ){ 
			var typ = o['typ'] || '', name = o['name'] || '';
			if( typ == 'set' ){ 
				var date = new Date(), minutes = o['minutes'] || 5;
					date.setTime( date.getTime() + ( minutes * 60 * 1000 ) );
				$.cookie(name, o['value'] || '', { expires: date, path: '/' });
			}else if( typ == 'get' )
				return $.cookie( name );
		}
	},
	management = {
		form: {
			arr: [				
				{ el: '.kutuBultenCont [id$="txtUYE_EMAIL"]', mask: null, required: null, placeHolder: translation['eBulten_txtUYE_EMAIL'] || 'E-mail adresinizi giriniz...' },
			],
			set: function( o ){
				var _t = this, el = $( o['el'] );
				if( uty.detectEl( el ) ){
					var msk = o['mask'] || '', plc = o['placeHolder'] || '', rqrd = o['required'] || '';
					
					if( msk != '' ){
						el.removeAttr('maxlength');
						el.mask(msk, { autoclear: false });
					}
					if( plc != '' ) 
						el.attr('placeholder', plc );
					
					if( rqrd != '' )	
						el.attr('required', rqrd );	
				}
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );	
			}
		},
		class: {
			arr: [				
				//{ main: '.ems-tab .content-js [rel="productInfo"] > .content > img.lazy-load', target: '.ems-tab .content-js [rel="productInfo"] > .content > img.lazy-load', type: 'add', cls: 'lazy' },
			{ main: '[id$="lblHCK_HATA"]', target: '.ems-cart-coupon', type: 'add', control: 'textControl', cls: 'opened' }
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), type = o['type'] || 'add', cls = o['cls'] || '', control = o['control'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){
					if( control == 'textControl' ){
						if( uty.cleanText( main.html() ).length == 0 )
							return false;
					}
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
				{ main: '.ems-prd-list-count', target: '.kutuKategori', add: 'before' },
				{ main: '.ems-prd-description-full', target: '.page-detail .row-3', add: 'prepend' },	
				{ main: '[id$="lblNavigation"] a:last', target: '.ems-prd-cat-name', add: 'append', clone: true },
				{ main: '.prd-awards', target: '.ems-prd-zoom .thumb-pager', add: 'append' },		
				{ main: '.popupDefault.popupTaksit', target: '.mod-payment-options', add: 'append' },
				{ main: '.ems-prd-list-count', target: '.section-single-cat .lvl1 li:eq(0)', add: 'append', clone: true },
				/* MRT Teslimat Bilgileri */
				{ main: '.clone-bottom-btns .next > a', target: '.ems-col-right .bottom-step .next', add: 'append' },
				{ main: '.clone-bottom-btns .prev > a', target: '.ems-col-right .bottom-step .prev', add: 'append' },
				
				
				{ main: '.popupTaksit', target: '[rel="paymentOptions"] .content', add: 'append' },
				{ main: '.ems-prd-list-sort', target: '.page-list .row-2', add: 'prepend' },
				{ main: '.ems-prd-zoom .swiper-inner li:eq(1) .swiper-img img', target: '.ems-tab .content-js [rel="productInfo"] > .content', add: 'prepend', clone: true },
				{ main: '.fb-login-wrapper', target: '.fb-login-wrapper-append', add: 'append', clone: true },
				{ main: '.cart-section-right', target: '.cart-section-right-append', add: 'append' },
				{ main: '.page-cart.step1 .row-2 .bottom-step', target: '.page-cart.step1 .ems-cart-summary', add: 'append' },
				{ main: '.pageOdemeBilgi_odemeTaksit', target: '.tableOdemeBilgiKrediKarti', add: 'after' },
				{ main: '.ems-prd-social', target: '.detailShare', add: 'append' },
				{ main: '.detailShare', target: '.content-js [rel="productInfo"] img', add: 'after', clone: true }
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), clone = o['clone'] || '', type = o['add'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){ 
					main = main.eq( 0 );
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
				{ main: '.ems-tab .content-js [rel="productInfo"] > .content > img.lazy-load', attr: 'src', value: 'data-original', typ: 'change' }
			],
			set: function( o ){
				var _t = this, main = $( o['main'] || '' ), typ = o['typ'] || '';
					if( uty.detectEl( main ) ){
						if( typ == 'change' )
							main.attr( o['attr'], main.attr( o['value'] || '' ) );
						else
							main.attr( o['attr'], o['value'] );
					}
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		pageScroll: {
			arr: [
				{ main: "a.go-all-features", target: ".all-features" },
				{ main: ".downArrow", target: ".downArrow", offset: 70 }
			],
			set: function( o ){
				var _t = this, main = $( o['main'] || '' ), target = $( o['target'] || '' );
					if( uty.detectEl( main ) && uty.detectEl( target ) )
						main
						.attr('data-target', o['target'] )
						.attr('data-offset', o['offset'] || 0 )
						.unbind('click')
						.bind('click', function(){
							var ths = $( this ), target = $( ths.attr('data-target') || '' ), off = parseFloat( ths.attr('data-offset') || 0 );
							if( uty.detectEl( target ) )
								uty.pageScroll({ scrollTop: target.offset().top + off })
						});
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		init: function(){
			var _t = this;
				_t.form.init();
				_t.append.init();
				_t.class.init();
				_t.template.init();
				_t.setAttr.init();
				_t.pageScroll.init();
		}
	},
	plugin = {
		cls: { active: 'plugins-active' },
		
		counter: {
			arr: [				
				{ ID: '.ems-grid-favorites [id$="txtURN_ADET"]' }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ); 
				if( uty.detectEl( ID ) ){
					ID.each(function(){
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] )  ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusCounter( o['prop'] || {} );
						}		
					})
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		
		customScroller: {
			arr: [				
				{ ID: '.listeGrup .scroller', total: 2 },
				{ ID: '.UrunListeGrup_listeUrunDetayGrup', prop: { childIndex: 1, minWidth: 50 } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ), total = o['total'] || 5; 
				if( uty.detectEl( ID ) ){
					ID.each(function(){
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] ) && ths.find('li').length >= total ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusCustomScroller( o['prop'] || {} );
						}		
					})
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		
		guest: {
			arr: [				
				{ ID: '.questWrapper' }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ); 
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( plugin['cls']['active'] ) ){
						ID.addClass( plugin['cls']['active'] );
						ID.minusGuest( o['prop'] || {} );
					}
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		memberMenu: {
			el: '.member-menu a',
			cls: { selected: 'selected' },
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el
					.each(function(){ 
						var ths = $( this ), hrf = ths.attr('href') || '';
						if( hrf != '' && urlString.indexOf( hrf ) != -1 )
							ths.parent('li').addClass( _t.cls['selected'] ).parents('li').eq( 0 ).addClass( _t.cls['selected'] );
					});
			}
		},
		dropDown: {
			arr: [				
				{ ID: '.mod-mini-cart', prop: { closeElem: '.pageFav, .mod-mini-login, .lngWrp, .nav-main', type: isMobile ? 'click' : 'hoverClick', customClass: 'opened', bdyCls: 'mini-cart-opened', bdyCls2: 'mini-cart-ready', clicked: '.mod-mini-cart-header', overlay: true, openedDelay: 222  } },
				
				{ ID: '.pageFav', prop: { closeElem: '.mod-mini-cart, .mod-mini-login, .lngWrp, .nav-main', type: isMobile ? 'click' : 'hoverClick', customClass: 'opened', bdyCls: 'mini-fav-opened', bdyCls2: 'mini-fav-ready', clicked: 'a', overlay: true, openedDelay: 222  } },
				
				{ ID: '.ems-login .mod-mini-login', prop: { closeElem: '.mod-mini-cart, .pageFav, .lngWrp, .nav-main', type: isMobile ? 'click' : 'hoverClick', customClass: 'opened', bdyCls: 'mini-login-opened', bdyCls2: 'mini-login-ready', clicked: '.mod-mini-login-header', overlay: true, openedDelay: 222  } },
				
				{ ID: '.lngWrp', prop: { closeElem: '.mod-mini-cart, .pageFav, .mod-mini-login, .nav-main', type: isMobile ? 'click' : 'hoverClick', customClass: 'opened', bdyCls: 'mini-lang-opened', bdyCls2: 'mini-lang-ready', clicked: '> a', overlay: true, openedDelay: 222  } },
				
				//{ ID: '.mod-mini-cart', prop: { type: 'click', customClass: 'opened', clicked: '.mod-mini-login-header'  } },
				//{ ID: '.lngWrp', prop: { type: 'click', customClass: 'opened', clicked: '> a'  } },
				{ ID: '.ems-cart-coupon', prop: { type: 'click', customClass: 'opened', clicked: 'span[id$="lbfHCK_KEY"]', bdyClicked: false } },
				{ ID: '.onBilgilendirmeForm', prop: { type: 'click', customClass: 'opened', clicked: '[id$="lbfONBILGILENDIRMEFORM_DEC"]', bdyClicked: false } },
				{ ID: '.siparisOnaySozlesme', prop: { type: 'click', customClass: 'opened', clicked: '[id$="lbfSATISSOZLESMESI_DEC"]', bdyClicked: false } },
				{ ID: '.detailShare', prop: { type: 'click', customClass: 'opened', clicked: '> a' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ); 
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( plugin['cls']['active'] ) ){
						ID.addClass( plugin['cls']['active'] );
						ID.minusDropDown( o['prop'] || {} );
					}
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		menu: {
			arr: [
				{ ID: '.nav-main', prop: { closeElem: '.mod-mini-cart, .pageFav, .mod-mini-login, .lngWrp', setPos: true, bdyClicked: true, eventType: isMobile ? 'click' : 'hover', isVisible: '.mbHeader', overlay: true, 	bdyCls: 'main-menu-opened' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ), b = o['unbind'] || '', s = o['selectionFirst'] || ''; 
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( plugin['cls']['active'] ) ){
						ID.addClass( plugin['cls']['active'] );
						ID.minusMenu( o['prop'] || {} ); 
						if( b != '' ) 
							$(b, ID)	.unbind('mouseleave')
						
						if( s != '' )	
							$(s, ID).each(function(){ $( this ).find('> li:eq( 0 )').addClass('selected'); });
					}
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		tabMenu: {
			el: '.ems-tab-horizontal-content, .ems-tab-vertical',
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					el.each(function(){ 
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] ) ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusTabMenu(); 
						}
					});
				}
			}
		},
		slider: {
			el: '.swiper-container',
			target: '.swiper-inner ul li',
			set: function( ID ){
				var _t = this;
				if( !ID.hasClass( plugin['cls']['active'] ) && uty.detectEl( ID.find( _t.target ) ) ){
					ID.addClass( plugin['cls']['active'] );
					ID.minusSlider(); 
				}
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					el.each(function(){ 
						var ths = $( this );
						_t.set( ths );
					});
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
					if( !ths.hasClass( plugin['cls']['active'] ) )
						uty.imageLoaded({ el: ths }, function( o ){
							if( o['type'] == 'done' ){
								var e = o['elem']; 
									e.isotope( _t['typ']['main'] );					
									e.addClass( _t['cls']['loaded'] ).addClass( plugin['cls']['active'] ); 
							}
						});			    
                });
			}	
		},
		DropDown: {			
			el: '.dropdown',
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					el.each(function(){ 
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] ) ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusCustomDropDown(); 
						}
					});
				}
			}
		},
		accordion: {
			arr: [
				{ ID: '.pages-template.hotels .pages-banners-generic' }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ); 
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( plugin['cls']['active'] ) ){
						ID.addClass( plugin['cls']['active'] );
						ID.minusAccordion( o['prop'] || {} ); 
					}
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		prdListSort: {
			el: '.popup-sort li',
			mobiBtn: '.ems-prd-list-sort-btn .btn-sort',
			mobiCloseBtn: '.popup-sort .btn-close',
			cls: { selected: 'selected', ready: 'sort-popup-ready', animate: 'sort-popup-animate' },
			param: 'srt',
			popup: function( k ){
				var _t = this;
				if( k == 'opened' )
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				else
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
			},
			control: function(){
				var _t = this, k = minusLoc.get('?', _t.param) || '';
				$( _t.el + '[rel="'+ k +'"]' ).addClass( _t.cls['selected'] );
			},
			addEvent: function(){
				var _t = this, el = $( _t.el ), mobiBtn = $( _t.mobiBtn ), mobiCloseBtn = $( _t.mobiCloseBtn );
				el.unbind('click').bind('click', function(){
					var ths = $( this ), rel = ths.attr('rel') || '', uri = '';
					if( rel != '' ){
						var loc = window.location.search;
						if( loc.indexOf( _t.param + '=' + rel ) != -1 )
							uri = minusLoc.remove('?', _t.param);	
						else
							uri = minusLoc.put('?', rel, _t.param);
							
						if( uri != '' )
							modules.filter.ajx({ uri: uri, target: modules.filter['target']['list'], historyPush: true });
					}
				});	
				if( uty.detectEl( mobiBtn ) )
					mobiBtn.unbind('click').bind('click', function( e ){
						e.preventDefault();
						if( bdy.hasClass(  _t['cls']['ready'] ) )
							_t.popup('closed');
						else
							_t.popup('opened');
					});
				if( uty.detectEl( mobiCloseBtn ) )
					mobiCloseBtn.unbind('click').bind('click', function( e ){
						e.preventDefault();
						_t.popup('closed');
					});
					
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					_t.control();
					_t.addEvent();
				}	
			}
		},
		viewType: {
			btn: '.gosterim ul li',
			cls: { selected: 'selected' }, 
			cookie: function( o ){ 
				var _t = this, typ = o['typ'] || '';
				if( typ == 'set' ) 
					$.cookie('viewType', o['val'] || '', { expires: 1, path: '/' });
				else if( typ == 'get' ) 
					return $.cookie('viewType') || '';
			},
			addEvent: function(){
				var _t = this, btn = $( _t.btn ), cls = '';
				btn
				.each(function(){
					var ths = $( this ), rel = ths.attr('rel') || '';
					if( rel != '' )
                    	cls += rel + ' '; 
                })
				.unbind('click')
				.bind('click', function(){
					var ths = $( this ), rel = ths.attr('rel') || '';
						ths.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
					bdy.removeClass( cls ).addClass( rel );
					_t.cookie({ typ: 'set', val: rel });
					setTimeout(function(){ win.resize() }, 10);
				});
				
				var k = _t.cookie({ typ: 'get' }), ind = 1;
				if( k != '' ){
					k = $( _t.btn + '[rel="'+ k +'"]');
					if( uty.detectEl( k ) )
						ind = k.index();	
				}
				
				btn
				.eq( ind )
				.click();
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.btn ) ) )
					_t.addEvent();
			}
		},
		init: function(){
			var _t = this;
				_t.counter.init();
				_t.customScroller.init();
				_t.guest.init();
				_t.dropDown.init();
				_t.isotop.init();
				_t.slider.init();
				_t.prdListSort.init();
				_t.tabMenu.init();
				_t.menu.init();
				_t.viewType.init();
				_t.memberMenu.init();
				_t.DropDown.init();
				_t.accordion.init();
		}
	},
	api = {
		youtube: {
			el: '.btn-video-play',
			cls: 'yt-api-active',
			set: function(){
				var _t = this;
				if( !uty.detectEl( $('script[src*="//www.youtube.com/iframe_api"]') ) ) 
		 			uty.getScript({ uri: '//www.youtube.com/iframe_api' }, function(){ bdy.addClass( _t.cls ); });
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					_t.set();
			}	
		},
		maps: {
			el: '.footer-map',
			stm: null,
			delay: 500,
			clearTimeOut: function(){
				var _t = this;
				if( _t.stm !== null ) 
					clearTimeout( _t.stm );
			},
			timeOut: function(){
				var _t = this, el = $( _t.el );
					_t.clearTimeOut();
					_t.stm = setTimeout(function(){
						el.unbind('mouseenter mouseleave');
						if( !uty.detectEl( $('script[src*="//maps.googleapis.com/maps/api"]') ) ) 
							uty.getScript({ uri: '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=AIzaSyBWA5W9FLE1IwQAPCCdfVLx2Qk8oGdPqjA' }, function(){ 
								el.minusMap();
							});
						else
							el.minusMap();	
							
					}, _t.delay);
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el
					.bind('mouseenter', function(){ _t.timeOut(); })
					.bind('mouseleave', function(){ _t.clearTimeOut(); });
					
				
				if( uty.detectEl( $('.service-list-holder') ) )
					if( !uty.detectEl( $('script[src*="//maps.googleapis.com/maps/api"]') ) ) 
						uty.getScript({ uri: '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=AIzaSyBWA5W9FLE1IwQAPCCdfVLx2Qk8oGdPqjA' }, function(){ 
							$('.service-list-holder').minusMap();
						});	
			}
		},
		init: function(){
			var _t = this;
				_t.youtube.init();
				_t.maps.init();
		}
	},
	modules = {
			mobiMenu: {
				wrp: '.nav-main',
				btn: '.mbHeader .mbMenu',
				closeBtn: '.mobile-header-close',
				backBtn: '.nav-main .catBack',
				cls: { ready: 'mobi-menu-ready', animate: 'mobi-menu-animate', selected: 'selected', opened: 'opened', lvl1: 'lvl1', lvl2: 'lvl2', subMenu: 'sub-menu' },
				isVisible: '.mbHeader',
				visibleControl: function(){
					var _t = this, b = false;
					if( _t.isVisible !== '' ){
						var e = $( _t.isVisible );
						if( uty.detectEl( e ) )
							if( e.is(':visible') )
								b = true;	
					}
					return b;
				},
				animate: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });		
				},
				addEvent: function(){
					var _t = this, wrp = $( _t.wrp ), btn = $( _t.btn ), closeBtn = $( _t.closeBtn ), backBtn = $( _t.backBtn );
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							var ths = $( this );
							if( bdy.hasClass( _t.cls['ready'] ) )
								_t.animate('closed');
							else
								_t.animate('opened');	
						});
						
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ _t.animate('closed');	});	
					
					if( uty.detectEl( backBtn ) )
						backBtn.bind('click', function(){ 
							$('.nav-main ul > li').removeClass( _t.cls['selected'] );
							wrp.removeClass( _t.cls['lvl1'] ).removeClass( _t.cls['lvl2'] ); 
						});		
					
					$('.nav-main ul > li > a')
					.each(function(){
                    	var ths = $( this ), sib = ths.siblings('div, ul').find('li'), prt = ths.parent('li');  
						if( uty.detectEl( sib ) )
							prt.addClass( _t.cls['subMenu'] )
                    })
					.bind('click', function( e ){
						var ths = $( this ), sib = ths.siblings('div, ul').find('li'), prt = ths.parent('li');
						if( _t.visibleControl() )
							if( uty.detectEl( sib ) ){
								e.preventDefault();
								
								if( prt.hasClass( _t.cls['selected'] ) )
									prt.add( prt.siblings('li') ).removeClass( _t.cls['selected'] );
								else	
									prt.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
									
								var lvl = prt.parents('ul').eq( 0 ).attr('class') || '';
								if( wrp.hasClass( lvl ) ){
									wrp.removeClass( _t.cls[ lvl ] );
									if( lvl == 'lvl1' )
										wrp.removeClass( _t.cls['lvl2'] ).find('.lvl2 li').removeClass( _t.cls['selected'] );
								}else
									wrp.addClass( _t.cls[ lvl ] );
							}
						
					});					
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] ).removeClass( _t.cls['animate'] );
					$('.nav-main ul > li').removeClass( _t.cls['selected'] );
					$( _t.wrp ).removeClass( _t.cls['lvl1'] ).removeClass( _t.cls['lvl2'] ); 
				},
				init: function(){
					var _t = this;
						_t.addEvent();
				}
			},
			leftMenuDrp: {
				el: '.kutuSolMenuTree',
				cls: { opened: 'opened' },
				addEvent: function(){
					var _t = this, el = $( _t.el );
					
					el
					.find('.kutuHeaderSolMenuTree')
					.unbind('click')
					.bind('click', function(){ $( this ).parents( _t.el  ).toggleClass( _t.cls['opened'] ); })	;
					
					el
					.find('.kutuBodySolMenuTree a')
					.unbind('click')
					.bind('click', function(){ $( this ).parents( _t.el  ).removeClass( _t.cls['opened'] ); })	;
				},
				set: function(){
					var _t = this, el = $( _t.el );
					el
					.find('.kutuHeaderSolMenuTree').html( el.find('.kutuBodySolMenuTree .sev3.act a').html() );
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el ) ) ){
						_t.set();
						_t.addEvent();
					}
				}	
			},
			menuCat: {
				el: '.menuKategori',
				cls: { subitems: 'sub-items', opened: 'opened' },
				speed: 333,
				addEvent: function(){
					var _t = this, el = $( _t.el );
					el.find('li > b').bind('click', function(){
						var ths = $( this ), prt = ths.parent('li'), spd = _t.speed;
						if( prt.hasClass( _t.cls['opened'] ) ){
							prt.removeClass( _t.cls['opened'] ).find('> ul').slideUp( spd );
							prt.siblings('li').removeClass( _t.cls['opened'] ).find('> ul').slideUp( spd );
						}else{
							prt.siblings('li').removeClass( _t.cls['opened'] ).find('> ul').slideUp( spd );
							prt.addClass( _t.cls['opened'] ).find('> ul').slideDown( spd );
						}
					});
				},
				set: function(){
					var _t = this, el = $( _t.el );
					el.find('li').each(function(){
						var ths = $( this );
						if( uty.detectEl( ths.find('> ul') ) )
							ths.addClass( _t.cls['subitems'] );
					});	
				},
				control: function(){
					var _t = this, el = $( _t.el ).find('li.act'), spd = _t.speed;
					if( uty.detectEl( el ) ){
						el.addClass( _t.cls['opened'] ).find('> ul').slideDown( spd );
						el.parents('li').eq( 0 ).addClass( _t.cls['opened'] ).find('> ul').slideDown( spd );
					}
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el ) ) ){
						_t.set();
						_t.control();
						_t.addEvent();
					}
				}
			},
			cart: {
				cargoEL: '.freeCargo',
				cargoTargetEl: '.mod-mini-cart-notice',
				amoundEl: 'span#lblUrunAdet',
				amountTarget: '.mbCart b',
				priceEl: 'span#lblUrunTutari',
				priceTarget: '.moduleMiniCart .price span',
				btn: '.moduleMiniCart .title a',
				closeBtn: '.vail.vailCart',
				cls: { ready: 'mini-cart-ready', animate: 'mini-cart-animate', empty: 'basket-empty', freeCargo: 'free-cargo' },
				add: function(){
					var _t = this;
						_t.amound();
					uty.pageScroll({ scrollTop: 0 }, function(){  
						var e = $('.mod-mini-cart .mod-mini-cart-header');
						if( uty.detectEl( e ) )
							e.click();
					});	
				},
				amound: function(){
					var _t = this, amoundEl = $( _t.amoundEl ), amountTarget = $( _t.amountTarget ), priceEl = $( _t.priceEl ), priceTarget = $( _t.priceTarget ), cargoEL = $( _t.cargoEL );
					
					if( uty.detectEl( amoundEl ) && uty.detectEl( amountTarget ) ){
						var val = parseFloat( uty.trimText( amoundEl.text() ) );
						amountTarget.text( val );
					}
					if( uty.detectEl( priceEl ) && uty.detectEl( priceTarget ) ){
						var val = parseFloat( priceEl.text() );
						priceTarget.text( uty.trimText( priceEl.text() ) );
					}
					
					if( uty.detectEl( priceEl ) && uty.detectEl( cargoEL ) ){
						var amount = cargoEL.attr('data-amound') || 100, k = parseFloat( priceEl.text().replace(/\,/, '.') );
						if( k >= amount )
							$( _t.cargoTargetEl ).html( cargoEL.html() ).addClass( _t.cls['freeCargo'] );
						else	
							$( _t.cargoTargetEl ).removeClass( _t.cls['freeCargo'] );
					}
					
					amoundEl = parseFloat( amoundEl.text() )
					if( amoundEl == 0 ) 
						bdy.addClass( _t.cls['empty'] );
					else	
						bdy.removeClass( _t.cls['empty'] );
				},
				destroy: function(){
					var _t = this;
					//bdy.removeClass( _t.cls['ready'] + ' ' + _t.cls['animate'] );
				},
				opened: function(){
					var _t = this;
					//uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				},
				closed: function(){
					var _t = this;
					//uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
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
				set: function(){
					var e = $('.mod-mini-login [id$="lblUYE_ADSOYAD"]');
					if( uty.detectEl( e ) )
						e.text( e.text().split(' ')[ 0 ] );
					
					e = 	$('.msg-qty b');
					if( uty.detectEl( e ) )
						e.text( $('[id$="lblUYE_MESAJSAYISI"]').text() || 0 );					
				},
				init: function(){
					var _t = this, btn = $( _t.btn ), closeBtn = $( _t.closeBtn ), showPassBtn = $( _t.showPassBtn ), pass = $( _t.pass );
						_t.check();
					/*
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							if( bdy.hasClass( _t.cls['ready'] ) ) _t.closed();
							else _t.opened();
						});
					*/
					
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
			filter: {
				closedObj: {	},
				wrp: '.ems-page.page-list',
				target: { list: '.ems-page.page-list', filter: '.row-1-holder' },
				btn: '.urunKiyaslamaOzellik_ozellik a, .menuKategori li > a, .urunKiyaslamaOzellik_secimler > a, .urunKiyaslamaOzellik_tumunuTemizle > a, .urunPaging_pageNavigation a',
				toggleBtn: '.urunKiyaslamaOzellik_ozellikAd, .kutuKategori .kutuHeaderKategori',
				mobiBtn: '.ems-prd-list-sort-btn .btn-filter',
				mobiCloseBtn: '.popup-filter .btn-close',
				cls: { loading: 'filter-ajx-loading', filterSelected: 'filter-selected', closed: 'kapali', ready: 'filter-popup-ready', animate: 'filter-popup-animate' },
				popup: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				loading: function( k ){
					var _t = this;
					if( k == 'add' ) bdy.addClass( _t['cls']['loading'] );
					else bdy.removeClass( _t['cls']['loading'] );
				},
				addEvent: function(){
					var _t = this, btn = $( _t.btn ), toggleBtn = $( _t.toggleBtn ), mobiBtn = $( _t.mobiBtn ), mobiCloseBtn = $( _t.mobiCloseBtn );
					
					if( uty.detectEl( btn ) )
						btn.bind('click', function( e ){
							if( history.pushState ){
								e.preventDefault();
								var ths = $( this ), uri = ths.attr('href') || '', targetEl = uty.detectEl( ths.parents('.menuKategori') ) ? 'list' : 'filter';
								if( uri != '' )
									_t.ajx({ uri: uri, target: _t['target'][ targetEl ], historyPush: true });
							}
						});
					
					if( uty.detectEl( toggleBtn ) ){
						$('.kutuKategori .kutuHeaderKategori').attr('id', 'kategori');
						toggleBtn
						.removeAttr('onclick')
						.bind('click', function( e ){
							var ths = $( this ), id = ths.attr('id') || '', sib = ths.siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori');
							if( ths.hasClass( _t['cls']['closed'] ) ){
								ths.removeClass( _t['cls']['closed'] ).parent('div').removeClass( _t['cls']['closed'] );
								sib.slideDown( 333 );
								_t['closedObj'][ id ] = 1;
							}else{
								ths.addClass( _t['cls']['closed'] ).parent('div').addClass( _t['cls']['closed'] );
								sib.slideUp( 333 );
								_t['closedObj'][ id ] = 0;
							}
						});
					}
					
					if( uty.detectEl( mobiBtn ) )
						mobiBtn.bind('click', function( e ){
							e.preventDefault();
							if( bdy.hasClass(  _t['cls']['ready'] ) )
								_t.popup('closed');
							else
								_t.popup('opened');
						});
					
					if( uty.detectEl( mobiCloseBtn ) )
						mobiCloseBtn.unbind('click').bind('click', function( e ){
							e.preventDefault();
							_t.popup('closed');
						});	
					
					if( history.pushState )
						window.onpopstate = function( event ){
							_t.ajx({ uri: event.state ? event.state.Url : window.location.pathname, target:_t['target']['list'] });						
						};	
				},
				ajx: function( o ){
					var _t = this, uri = o['uri'], target = o['target'], hP = o['historyPush'] || null;
						_t.loading('add');
					uty.ajx({ uri: uri }, function( k ){
						if( k['type'] == 'success' )
							_t.ajxResult({ val: k['val'], uri: uri, target: target, historyPush: hP  });	
						_t.loading('remove');							
					});
				},				
				ajxResult: function( o ){
					var _t = this, wrp = $( o['target'] ), e = $( o['val'] ), target = e.find( o['target'] ), uri = o['uri'], ttl = document.title;
					
					if( uty.detectEl( target ) && uty.detectEl( wrp ) ){
						
						var k = e.find('[id$="hdnUrnReferrerUrl"]').val() || '';
						if( k != '' )
							urlString = k;
						
						target.find('.kutuKategori .kutuHeaderKategori').attr('id', 'kategori');	
						$.each(_t.closedObj, function( i, k ){
							if( k == 0 )
								target.find('[id="'+ i +'"]').addClass( _t['cls']['closed'] ).siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori').hide();
							else
								target.find('[id="'+ i +'"]').removeClass( _t['cls']['closed'] ).siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori').show();
						});	
	
						wrp.html( uty.clearScriptTag( target.html() ) );
						
						if( o['historyPush'] )
							history.pushState({ Url: uri , Page: ttl }, ttl, uri);
						
						setTimeout(function(){
							pages.list.init();
							addToFavorites.check();
							management.init();
							plugin.init();
							uty.unVeil( wrp );
							_t.init();
							modules.compare.set();
							modules.menuCat.init();
						}, 0);
					}
				},
				set: function(){
					var _t = this;
					$( '.' + _t['cls']['closed'] ).each(function(){ $( this ).parent('div').addClass( _t['cls']['closed'] ); });
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.wrp ) ) ){
						_t.addEvent();
						_t.set();
					}
				}
			},
			compare: {
				el: 'input[id$="chkOZS_KOD"]',
				contentWrp: '.compareHolder',
				content: '.compareHolder .compareContentList',
				countEl: '.compareHolder [rel="compareList"] small',
				target: '.emosInfinite',
				cls: { loading: 'compare-ajx-loading', noResult: 'compare-no-result', show: 'show-compare', prd: 'compare-prd-active' },
				uri: {
					list: '/usercontrols/kutu/ajxUrunTab.aspx?tip=seciliurun&ps=10&rp=10&lazyLoad=false&uKods={{uKods}}&lang={{lang}}&ozs={{ozs}}',
					compare: '/urun_kiyaslama.aspx?kat={{kat}}&uKods={{uKods}}&lang={{lang}}'
				},
				maxComp: parseFloat( $('.compareHolder').attr('data-prdmax') || 4 ),
				uKods: '',
				getUri: function( o ){
					var _t = this;
					return _t.uri[ o['typ'] || 'list' ].replace(/{{uKods}}/, o['uKods'] || '').replace(/{{ozs}}/, o['ozsKod'] || '').replace(/{{lang}}/, lang).replace(/{{kat}}/, uty.getCat())
				},
				loading: function( k ){
					var _t = this;
					if( k == 'add' ) bdy.addClass( _t['cls']['loading'] );
					else bdy.removeClass( _t['cls']['loading'] );
				},
				getUKods: function( callback ){
					var _t = this;
					uty.ajx({ uri: '/pageMethods.aspx/kiyaslaUrunKodlarAl', type: 'post', dataType: 'json', contentType: 'application/json; charset=utf-8' }, function( d ){ 
						if( d['type'] == 'success' ){
							var d = uty.trimText( d['val']['d'] ), o = {};
							if( d != '' ){
								var u = d.split(':')[ 1 ], ozs = d.split(':')[ 0 ]; 
									u = u.endsWith(',') ? u.substr( 0, u.length - 1 ) : u; 
								o['uKods'] = u;
								o['ozsKod'] = ozs;
								o['typ'] = 'list';
							}
							if( typeof callback !== 'undefined' )
								callback( o );	
						}
					});	
				},
				add: function(){
					var _t = this;
						_t.loading('add');
						_t.getUKods(function( o ){
							var u = o['uKods'] || '';
							_t.uKods = u;
							if( u != '' ){
								var uri = _t.getUri( o );
								uty.ajx({ uri: uri }, function( d ){ 
									if( d['type'] == 'success' )
										_t.ajxResult( uty.clearScriptTag( d['val'] ) );		
									_t.loading('remove');
								});
							}else{
								_t.loading('remove');
								_t.ajxResult();
							}
							
						});
				},
				ajxResult: function( o ){
					var _t = this, k = o || '';
					if( k != '' ) k = $( k ).find( _t.target ).wrapAll('<div>').parent().html(); 
					$( _t.content ).html( k );
					_t.set();
					_t.setChk();
				},
				
				set: function(){ 	
					var _t = this, el = $( _t.el ), cw = $( _t.contentWrp ), countEl = $( _t.countEl ), count = $('> ul > li', _t.content ).length;
					el
					.unbind('change')
					.bind('change', function(){
						var ths = $( this ); console.log(_t.uKods.split(',').length )
						if( _t.uKods.split(',').length >= _t.maxComp && ths.is(':checked') ){
							ths.attr('checked', false).siblings('.cStyler').removeClass('checked');
							alert( $('[id$="lbfKIYASLAMA_VLDMAX"]').text().replace('$maxCompare$', _t.maxComp) );
							if (typeof stage !== 'undefined') 
								stage.dispatchEvent("CustomEvent", "itemCompareClear", { 'type': ths.value });
						}else{
							var id = ths.val() + ',' + ths.is(':checked');
           					pageMethod("/pageMethods.aspx/kiyaslaUrunEkle", '{"urn":"' + id + '", "ozsKodState":"' + strOzsKodState + '"}', kiyaslaUrunEkleSuccess, kiyaslaUrunEkleError);  
						}						
					});
					//compareChkChange();/* sys. func */
					
					countEl.text( count );
					if( count == 0 ) bdy.addClass( _t['cls']['noResult'] ).removeClass( _t['cls']['prd'] );
					else bdy.removeClass( _t['cls']['noResult'] ).addClass( _t['cls']['prd'] );
				},
				setChk: function(){
					var _t = this, arr = _t.uKods.split(','), el = $( _t.el );
					
					if( uty.detectEl( el ) )
						el.attr('checked', false).siblings('.cStyler').removeClass('checked');
					
					for( var i = 0; i < arr.length; ++i ){
						el = $( _t.el + '[value="'+ arr[ i ] +'"]' );
						if( uty.detectEl( el ) )
							el.attr('checked', true).siblings('.cStyler').addClass('checked');
					}
				},
				addEvent: function(){
					var _t = this, clrBtn = $('.compareHolder .btnClear'), compareBtn = $('.compareHolder .btnCompare'), toggleBtn = $('.compareHolder .openCloseBtn');
					
					clrBtn.bind('click', function(){
						_t.loading('add');
						uty.ajx({ uri: '/pageMethods.aspx/kiyaslaUrunKodlarTemizle', type: 'post', dataType: 'json', contentType: 'application/json; charset=utf-8' }, function( d ){ 
							_t.uKods = '';
							_t.ajxResult();
							_t.loading('remove');
						});
					});
					
					compareBtn.bind('click', function(){
						var u = _t.uKods.split(',');
						if( u.length > 1 )
							location.href = _t.getUri({ typ: 'compare', uKods: _t.uKods }); 
						else 
							alert( translation['compareVld'] );	
					});
					
					toggleBtn.bind('click', function(){
						bdy.toggleClass( _t['cls']['show'] );
					});
				},
				init: function(){
					var _t = this, el = $( _t.el );
					if( uty.detectEl( el ) ){
						doc.ready(function( e ){ setTimeout(function(){ _t.set(); }, 1); });
						//bdy.append('<div class="compareHolder"> <div class="compareMenuHolder"> <div class="compareMenu"> <i class="openCloseBtn"><span class="addItems">Ürün Ekle</span></i> <ul> <li class="tab-2" rel="compareList"><span class="tabBtn">Karşılaştırma Listesi <small></small></span><a class="btnDefault btnCompare"><span>Karşılaştır</span></a> <a class="btnDefault btnClear" href="javascript:void(0);"><span class="clear">Temizle</span></a> </li></ul> <div class="floatFixer"></div></div></div><div class="compareContent"> <div class="compareContentList"></div></div></div>');	
						_t.add();
						_t.addEvent();
					}
				}
			},
			prdCompact: {
				wrp: '.page-detail',
				el: '.prd-compact',
				target: '.ems-prd-detail-tab',
				offset: 0,
				cls: { ready: 'compact-ready' },
				template: '<div class="prd-compact"> <div class="prd-compact-inner"> <div class="prd-compact-image">{{image}}</div><div class="prd-compact-cart-btn"></div><div class="prd-compact-group"> <div class="prd-compact-group-inner"> <div class="prd-compact-name">{{name}}</div><div class="prd-compact-code">{{code}}</div><div class="prd-compact-price">{{price}}</div></div></div></div></div>',
				getTemplate: function(){
					var _t = this;
					return _t.template.replace(/{{image}}/g, '<img src="' + ( $('.ems-prd-zoom .swiper-inner li:eq( 0 )').attr('data-thumb') || '' ) + '" border="0">' ).replace(/{{name}}/g, uty.trimText( $('.ems-prd-name h1').text() || '' ) ).replace(/{{code}}/g, uty.trimText( $('.ems-prd-code').text() || '' ) ).replace(/{{price}}/g, uty.trimText( $('.urunDetay_satisFiyat').html() || '' ) );
				},
				add: function(){
					var _t = this;
					bdy.append( _t.getTemplate() );
				},
				onScroll: function(){
					var _t = this, el = $( _t.el );
					if( uty.detectEl( el ) && !uty.visibleControl() ){
						var target = $( _t.target );
						if( uty.detectEl( target ) ){
							target = target.offset().top + _t.offset;
							var k = $('.ems-prd-add-to-cart-inner');
							if( wst >= target && !el.hasClass( _t.cls['ready'] ) ){
								el.addClass( _t.cls['ready'] );
								$('.prd-compact-cart-btn').append( k );
							}else if( wst < target && el.hasClass( _t.cls['ready'] ) ){ 
								 el.removeClass( _t.cls['ready'] ); 
								 $('.ems-prd-add-to-cart').append( k );
							}
						}	
					}
				},
				destroy: function(){
					var _t = this, el = $( _t.el );
					if( uty.detectEl( el ) ){
						el.removeClass( _t.cls['ready'] ); 
						$('.ems-prd-add-to-cart').append( $('.ems-prd-add-to-cart-inner') );
					}
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.wrp ) ) && !uty.detectEl( $( _t.el ) ) ){
						_t.add();
						_t.onScroll();
					}
				}
			},
			langSelection: {
				wrp: '.lngWrp',
				drp1: '.langSelect.slct1',
				drp2: '.langSelect.slct2',
				btn: '.langLink .langBtn',
				cls: { none: 'ems-none', selected: 'selected' },
				addEvent: function(){
					var _t = this, drp1 = $( _t.drp1 ).find('li'), drp2 = $( _t.drp2 );
					drp1
					.bind('click', function(){
						var ths = $( this ), val = ths.attr('data-val') || -1;
						drp2.find('li[data-lang]').addClass( _t.cls['none'] );
						drp2.find('li[data-lang].' + val).removeClass( _t.cls['none'] );
						drp2.find('li:eq(0)').click();
					});
					$( _t.btn )
					.bind('click', function(){
						var k = drp2.find('li[data-lang].' + _t.cls['selected']).attr('data-lang') || '';
						if( k != '' )
							window.location.href = '/?lang=' + k;
					})	
				},
				init: function(){
					var _t = this, wrp = $( _t.wrp );
					if( uty.detectEl( wrp ) )
						_t.addEvent();
				}
			},
			destroy: function(){
				var _t = this;
					_t.mobiMenu.destroy();
					_t.prdCompact.destroy();
			},
			init: function(){
				var _t = this;
					_t.mobiMenu.init()
					_t.menuCat.init();
					_t.leftMenuDrp.init();
					_t.login.init();
					_t.cart.init();
					_t.filter.init();
					_t.compare.init();
					_t.prdCompact.init();
					_t.langSelection.init();
			}
			
	},
	pages = {
		question: {
			wrp: '.sorumVarTemp',
			btn: '.ssPopupBtn',
			uri: '/popup/popup_mesajGonder.aspx?lang={{lang}}&title={{title}}&spr={{spr}}',
			getUri: function(){
				var _t = this;
				return _t.uri.replace(/{{lang}}/g, lang).replace(/{{spr}}/g, $('.questAccBtn > li.opened').attr('rel') || 0).replace(/{{title}}/g, $('.questAccBtn > li.opened .questStep > li.selected > a > span').text() || '');
			},
			addEvent: function(){
				var _t = this;
				$( _t.btn ).bind('click', function( e ){
					e.preventDefault();
					openPopup( _t.getUri(), 'popup_mesajGonder', 'popup_mesajGonder');
				});
			},
			init: function(){
				var _t = this;
				if( $( _t.wrp ) )
					_t.addEvent();
			}
		},	
		cart: {
			cls: { selected: 'selected' },
			wrp: '.page-cart.step1',
			row: '.ems-grid-address .ems-grid-row',
			checkRow: function(){
				var _t = this, row = $( _t.row );
				row
				.removeClass( _t.cls['selected'] )	
				.each(function(){
					var ths = $( this );
					if( uty.detectEl( ths.find('.emos_selected') ) )
						ths.addClass( _t.cls['selected'] );
				})
			},
			addEvent: function(){
				var _t = this, wrp = $( _t.wrp );	
				$('.btnTesAdrSec, .btnFatAdrSec', wrp)
				.bind('click', function(){ setTimeout(function(){ _t.checkRow(); }, 10); });
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.wrp ) ) )
					_t.addEvent();
			}	
		},
		detail: {
			wrp: '.page-detail',
			target: '.UrunListeGrup_listeUrunDetayGrup',
			cls: { selected: 'selected' },
			getTemplate: function(){
				var _t = this, el = $( _t.target ).find('li'), htm = '';
				if( uty.detectEl( el ) ){
					htm = '<div class="dropdown prd-list-group"><span></span><ul>';
					el.each(function( i ){
						var ths = $( this ), cls = ths.hasClass( _t.cls['selected'] ) ? _t.cls['selected'] : '';
							ths.attr('data-id', i);
						htm += '<li class="'+ cls +'"><a href="javascript:void(0);">'+ uty.trimText( ths.find('.URN_AD').text() ) +'</a></li>';
						
					});
					htm += '</ul></div>'
				}
				return htm;
			},
			addEvent: function(){
				var _t = this, e = $('.prd-list-group li a');
				
				if( uty.detectEl( e ) )
					e
					.bind('click', function(){
						var ths = $( this );
						$( _t.target + ' [data-id="'+ ths.parent('li').index() +'"]').find('.URN_RESIM').get( 0 ).click();
					});
				
				e = $('.ems-prd-social a')
				if( uty.detectEl( e ) )
					e.bind('click', function( e ){
						e.preventDefault();
						var ths = $( this ), uri = ths.attr('href') || '';
						if( uri != '' )
							window.open(uri, 'Share', 'width=500,height=300');
					});
				
			},
			add: function(){
				var _t = this;
				$( _t.target ).after( _t.getTemplate() );
			},
			init: function(){
				var _t = this;
				if( $( _t.wrp ) ){
					_t.add();
					_t.addEvent();
				}
			}
		},
		login: {
			wrp: '.page-login',
			btn: { signup: '.ems-login .btn-login-page', signin: '.ems-signup .btn-login-page' },
			cls: { signup: 'ems-signup-body' },
			control: function(){
				var _t = this, k = minusLoc.get('?', 'signup');
				if( k == 'true' )
					bdy.addClass( _t.cls['signup'] );
			},
			addEvent: function(){
				var _t = this;
				$( _t.btn.signup ).bind('click', function(){ bdy.addClass( _t.cls['signup'] ); });
				$( _t.btn.signin ).bind('click', function(){ bdy.removeClass( _t.cls['signup'] ); });
			},
			init: function(){
				var _t = this;
				if( $( _t.wrp ) ){
					_t.control();
					_t.addEvent();
				}
			}
		},
		main: {
			el: '.ems-page.page-home',
			initPlugins: function(){
				
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					_t.initPlugins();
				}	
			}
		},
		list: {
			target: '.ems-prd .ems-prd-code',
			init: function(){
				var _t = this, target = $( _t.target );
				if( uty.detectEl( target ) )
					target.each(function(){
						var ths = $( this ); 
							ths.parents('.ems-prd').attr('data-id', uty.trimText( ths.text() ));
					});
			}
		},
		init: function(){
			var _t = this;
				_t.question.init();
				_t.main.init();
				_t.login.init();
				_t.detail.init();
				_t.cart.init();
				_t.list.init();
		}
	},
	visManagement = {
		ajxTarget: '.emosInfinite',
		target: '.swiper-inner',
		arr: [
			/* anasayfa */
			{ info: 'favori kategori çok satanlar', ttl: 'SİZİN İÇİN SEÇTİKLERİMİZ', mdl: 'fv_cat_top_seller', zoneid: 16, target: '.page-home .fv-cat-top-seller' },
			
			{ info: 'şu anda gezilenler', ttl: 'ŞU ANDA GEZİLEN ÜRÜNLER', mdl: 'RealTime_widget', zoneid: 3, target: '.page-home .real-time' },
			
			{ info: 'en son bakılan ürün ve ilgili ürünler', ttl: 'İNCELEDİĞİNİZ ÜRÜNLERİN BENZERLERİ', mdl: 'you_viewed', zoneid: 4, target: '.page-home .you-viewed' },
			
			{ info: 'diğer kategorilerin çok satanları', ttl: 'BEĞENEBİLECEĞİNİZ DİĞER ÜRÜNLER', mdl: 'cross_cat_top_seller', zoneid: 9, target: '.page-home .cross-cat-top-seller' },
			
			
			/* ürün detay */
			{ info: 'BU ÜRÜNE BAKANLAR BU ÜRÜNE BAKTI', ttl: 'İLGİLİ ÜRÜNLER', mdl: 'alternative_products', zoneid: 1, target: '.page-detail .alternative-products', typ: 'prdCode' },
			
			{  info: 'EN ÇOK SATANLAR', ttl: 'EN ÇOK SATANLAR', mdl: 'category_topsellers_productpage', zoneid: 5, target: '.page-detail .category-topsellers-productpage', typ: 'prdCode' },
			
			{  info: 'BU ÜRÜNÜ SATIN ALANLAR BU ÜRÜNÜ SATIN ALDI', ttl: 'BU ÜRÜNÜ SATIN ALANLAR BU ÜRÜNÜ SATIN ALDI', mdl: 'also_bought', zoneid: 7, target: '.page-detail .also-bought', typ: 'prdCode' },
			
			
			/* ürün liste */
			{ info: 'KATEGORI LISTE EN COK SATANLAR', ttl: 'EN ÇOK SATANLAR', mdl: 'category_top_sellers', zoneid: 2, target: '.page-list .category-top-sellers', typ: 'catCode' },
			
			{  info: 'ŞU ANDA GEZİLEN ÜRÜNLER', ttl: 'BU ÜRÜNÜ SATIN ALANLAR BU ÜRÜNÜ SATIN ALDI', mdl: 'category_real_time', zoneid: 13, target: '.page-list .category-real-time', typ: 'catCode' },
			
			/* arama sayfası */
			{ info: 'BENZER SONUÇLAR', ttl: 'BENZER SONUÇLAR', mdl: 'alternative_product_view', zoneid: 8, target: '.page-search .alternative-product-view', typ: 'searchText' },
			
			/* sepet sayfası */
			{ info: 'İLGİLİ ÜRÜNLER', ttl: 'BU ÜRÜNÜ ALANLAR BUNLARI DA ALDI', mdl: 'also_addto_basket', zoneid: 16, target: '.page-cart .also-addto-basket', typ: 'cart' },
			
			/* blog ve bulten */
			{ info: 'favori kategori çok satanlar', ttl: 'Size Özel Ürünlerimiz', mdl: 'fv_cat_top_seller', zoneid: 16, target: '.page-blog .fv-cat-top-seller' },
			
			{ info: 'KATEGORI INDIRIMLI URUNLER', ttl: 'İndirimli Ürünlerimiz', mdl: 'fv_cat_top_discounted', zoneid: 11, target: '.page-blog .fv-cat-top-discounted' },
			
			{ info: 'FAVORI KATEGORI YENI URUNLER', ttl: 'Yeni Ürünlerimiz', mdl: 'fv_cat_top_newProduct', zoneid: 12, target: '.page-blog .fv-cat-top-new-product' },
			
			/* indirim sayfasına özel bunlar sayfa tipinde olmalı http://www.englishhome.com.tr/indirim/*/
			{ info: 'KATEGORI INDIRIMLI URUNLER', ttl: 'İndirimli Ürünlerimiz', mdl: 'fv_cat_top_discounted', zoneid: 11, target: '.page-discounted .fv-cat-top-discounted', targetAppend: '.content' },
			
			/* yeni sayfasına özel bunlar sayfa tipinde olmalı http://www.englishhome.com.tr/yeni/*/
			{ info: 'FAVORI KATEGORI YENI URUNLER', ttl: 'Yeni Ürünlerimiz', mdl: 'fv_cat_top_newProduct', zoneid: 12, target: '.page-new .fv-cat-top-new-product', targetAppend: '.content' }
			
		],
		cls: { loading: 'ajx-loading', noResult: 'no-result', found: 'results-found', active: 'widget-active' },
		uri: '/usercontrols/kutu/ajxUrunTab.aspx?lang={{lang}}&tip=seciliurun&mdl={{mdl}}&cacheDakika={{cacheDakika}}&ps={{ps}}&rp=1&pcl={{pcl}}',
		getUri: function( o ){
			var _t = this;
			return _t.uri.replace(/{{lang}}/g, lang).replace(/{{mdl}}/g, decodeURI( o['mdl'] || '' )).replace(/{{cacheDakika}}/g, decodeURI( o['cacheDakika'] || 30 )).replace(/{{ps}}/g, decodeURI( o['ps'] || 100 )).replace(/{{pcl}}/g, decodeURI( o['code'] || '' ));
		},
		getCode: function( o ){
			var arr = [];
			$.each(o['data'], function( i, k ){
				var code = k['code'] || '';
				if( i >= o['begin'] && code != '' )	
					arr.push( code );
			});
			return arr.toString();
		},
		getPrdCode: function(){	return uty.trimText( $('.prd-detail-top .ems-prd-code').text() || '' ); },
		getCatCode: function(){ return uty.trimText( minusLoc.get('?', 'kat', urlString) ); },
		getSearchText: function(){ return uty.trimText( minusLoc.get('?', 'text', urlString ) ); },
		getCartCode: function(){ 
			var _t = this, k = '';
			$('.ems-grid-row').find('.ems-grid-code').each(function( i ){
				var ths = $( this );
				k += ( ( i > 0 ? '~' : '' ) + uty.trimText( ths.text() ) );
			});
			return k;
		},
		getVisilabs: function( o ){
			var _t = this;				
			/* vislabs aktifleşince devreye alınacak */
			var vlc = new Visilabs(), _t = this, typ = o['typ'] || '', prm1 = null, prm2 = null;
				vlc.AddParameter('json', true);
				if( typ == 'prdCode' ) prm2 = _t.getPrdCode();
				else if( typ == 'catCode' ){
					vlc.AddParameter('cat' , _t.getCatCode());
					prm1 = 'vlcontent';
				}else if( typ == 'searchText' ) 
					prm2 = _t.getSearchText();
				else if( typ == 'cart' ) 
					prm2 = _t.getCartCode();
				
				vlc.Suggest(o['zoneid'], prm1, prm2, function( d ){ 
					if( d.length > 0 ){
						if( siteSettings['visilabsTemplateActive'] ){
							o['data'] = d;
							_t.addVisTemplate( o );
						}else{
							o['code'] = _t.getCode({ data: d, begin: o['begin'] || 0 }) || '';
							_t.add( o );
						}
					}
				});
				
		},
		addVisTemplate: function( o ){
			var _t = this, target = $( o['target'] || '' ), targetAppend = o['targetAppend'] || _t.target;
			target
			.addClass( _t.cls['found'] )
			.addClass( _t.cls['active'] )
			.find( targetAppend )
			.html('<ul>' + visTemplate.get( o['data'] ) + '</ul>'); 
			_t.initPlugins( target );
		},
		add: function( o ){
			var _t = this, uri = _t.getUri( o ), target = $( o['target'] || '' );
			target.addClass( _t.cls['loading'] );
			uty.ajx({ uri: uri }, function( d ){
				if( d['type'] == 'success' ){
					var e = $( d['val'] ).find( _t.ajxTarget ), li = $('li', e);
					if( uty.detectEl( li ) ){
						var targetAppend = o['targetAppend'] || _t.target;
						target
						.addClass( _t.cls['found'] )
						.addClass( _t.cls['active'] )
						.find( targetAppend )
						.html('<ul>' + uty.clearScriptTag( e.html() ) + '</ul>'); 
						_t.initPlugins( target );
					}else 
						target.addClass( _t.cls['noResult'] );
				}
				target.removeClass( _t.cls['loading'] );
			})
		},
		initPlugins: function( ID ){
			uty.unVeil( ID );
			plugin.slider.set( ID );
		},
		init: function(){
			var _t = this, arr = _t.arr;
			for( var i = 0; i < arr.length; ++i ){
				var o = arr[ i ], target = $( o['target'] || '' );
				if( uty.detectEl( target ) )
					_t.getVisilabs( o );
			}
		}
	},
	customNewsLetter = {
		cleanText: function( k ){ return k.replace(/\s+/g, ''); },
		trimText: function( k ){ return k.replace(/(^\s+|\s+$)/g, ''); },
		mailGonder: function( k ){
			var _t = this, ths = $( k ), con = ths.parents('.ebulten-form'), email = $('.kutuBulten_email input', con), val = _t.trimText( email.val() || '' ), sending = $('.kutuBulten_mesaj span', con);
			if( _t.cleanText( val ) != '' ){
				sending.html('');
				if( checkEmail( val ) ){
					sending.html( $('[id$="lbfHBB_GONDERILIYOR"]').html() );
					con.addClass('sending');
					pageMethod("/pageMethods.aspx/bultenKaydet", '{"strEmail":"' + val + '"}',
						function success( result ){
							if( result.d == '' ) sending.html( strHBB_GONDERILIYOR_BASARILI );
							else sending.html( strHBB_GONDERILIYOR_BASARISIZ );
							con.removeClass('sending');
						}, 
						function error( result ){
							sending.html( strHBB_GONDERILIYOR_BASARISIZ ); 
							con.removeClass('sending');
						}
					);
                    email.val('');
				}
			}else{
                alert( $('[id$="lbfHBB_BOSGECILEMEZ"]').html() );
                return false;
			}
		}
	},
	addToFavorites = {
		wrp: '.page-list, .page-detail, .ems-page-member-favorites',
		allow: '.ems-page-member-favorites', 
		data: null,
		uri: '/WebServices/dataService.aspx/addFavorite',
		cls: { selected: 'selected', ajx: 'ajx-fav' },
		clicked: function( k ){
			
			if( bdy.hasClass('ems-logoff') ){
				window.location.href = '/login.aspx?lang=' + lang;
				return false;
			}
				
			var _t = this, ths = $( k ), prt = ths.parents('.ems-prd').eq( 0 ), obj = {}, typ = '', id = uty.trimText( prt.find('.ems-prd-code').text() || '' );
			
			if( ths.hasClass( _t.cls['selected'] ) ){
				typ = 'remove';
				ths.removeClass( _t.cls['selected'] );
				_t.set({ typ: 'remove', id: id });
			}else{
				typ = 'add';
				ths.addClass( _t.cls['selected'] );
				_t.set({ typ: 'add', id: id });
			}
			
			obj['cups'] = '';
			obj['urnKod'] = id;
			obj['type'] = typ;
			obj['name'] = uty.trimText( prt.find('.ems-prd-name').text() || '' );
			
			prt.addClass	( _t.cls['ajx'] );	
			pageMethod(_t.uri, decodeURIComponent( JSON.stringify( obj ) ), function success( o ){
				prt.removeClass	( _t.cls['ajx'] );	
				//console.log('add')
			});
		},
		check: function(){
			var _t = this;
			if( _t.data != null ){
				$.each(_t.data, function( i, k ){
					if( k != 0 ){
						var e = $('.ems-prd[data-id="'+ i +'"]');
						if( uty.detectEl( e ) )
							e.find('.listeFavori > a').addClass( _t.cls['selected'] );
					}
				});
			}		
		},
		set: function( o ){
			var _t = this, typ = o['typ'] || '';
			if( _t.data != null ){
				if( typ == 'add' ) _t.data[ o['id'] ] = 1;
				else _t.data[ o['id'] ] = 0;
				/*http://stackoverflow.com/questions/208105/how-to-remove-a-property-from-a-javascript-object*/
				uty.Cookies({ typ: 'set', name: 'prdFav', value: JSON.stringify( _t.data ) });
			}	
		},
		ajx: function(){
			var _t = this;
			uty.ajx({ uri: '/member-fav-ajx.html' }, function( d ){
				if( d['type'] == 'success' ){
					var val = d['val'];
					if( uty.cleanText( val ).length > 0 ){ 
						_t.data = JSON.parse( val );
						uty.Cookies({ typ: 'set', name: 'prdFav', value: val });
						_t.check();
					}
				}
			});	
		},
		init: function(){
			var _t = this;
			if( uty.detectEl( $( _t.wrp ) ) && bdy.hasClass('ems-login') ){		
				var k = uty.Cookies({ typ: 'get', name: 'prdFav' }) || '';
				if( uty.detectEl( $( _t.allow ) ) ){	
					_t.ajx();
					return false;
				}
				if( k != '' ){ 
					_t.data = JSON.parse( k );
					_t.check();
				}else
					_t.ajx();
			}
		}
	},
	combine = {
		wrp: '.kombinSlider',
		target: '.kombinSlider > ul > li',
		el: '.kombinNav',
		btn: '.kombinNav li',
		offset: -20,
		cls: { selected: 'selected' },
		template: {
			top: '<a onclick="combine.events.focused(this);" href="javascript:void(0);" class="nav-btn top-btn" rel="top"><i></i></a>',
			bottom: '<a onclick="combine.events.focused(this);" href="javascript:void(0);" class="nav-btn bottom-btn" rel="bottom"><i></i></a>',
			li: '<li class="nav-item" onclick="combine.events.clicked(this);"><a href="javascript:void(0);"></a></li>'	
		},
		getTemplate: function(){
			var _t = this, htm = '';
			$( _t.target ).each(function(){
			   htm += _t.template.li; 
			});
			return htm;
		},
		events: {
			clicked: function( k ){
				var _t = combine, ind = $( k ).index(), e = $( _t.target ).eq( ind );
				if( uty.detectEl( e ) )	
					uty.pageScroll({ scrollTop: e.offset().top + _t.offset });
			},
			focused: function( k ){
				var _t = combine, ths = $( k ), rel = ths.attr('rel') || '', e = $( _t.btn + '.' + _t.cls['selected'] ), ind = 0;
				if( rel != '' ){
					if( rel == 'top' ) e = e.prev();
					else e = e.next(); 
					if( uty.detectEl( e ) )	
						e.click();
				}
			},
		},
		add: function(){
			var _t = this;
			$( _t.el ).html( _t.template.top + '<ul>' + _t.getTemplate() + '</ul>' + _t.template.bottom ); 
		},
		detectPosition: function( ID ){			        
            var b = false,
                o1 = { x: 0, y: wst, width: wt, height: ht },
                o2 = { x: 0, y: ID.offset().top, width: wt, height: ID.height() };  
            if( o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y ){
                b = true;       
            }
            
            return b;
        },
        adjust: function(){
            var _t = this, wrp = $( _t.wrp );
            if( uty.detectEl( wrp ) ){
                if( wst >= wrp.offset().top ){
                    $( _t.target ).each(function(index, _this){     
                        var ths = $( this );
                        if( _t.detectPosition( ths ) && ths.is(':visible') ){                           
							var e = $( _t.btn ).eq( ths.index() );
							if( uty.detectEl( e ) )
								e.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
                           
                            return false;
                        }
                    });
                }else 
                    $( _t.btn ).removeClass( _t.cls['selected'] ).eq( 0 ).addClass( _t.cls['selected'] );
                
            }
        },
		init: function(){
			var _t = this;
			if( uty.detectEl( $( _t.wrp ) ) ){
				_t.add();
				//_t.initPlugins();
			}
		}
	},	
	resetDom = {
		k: true,
		onResize: function(){
			var _t = this;
			if( !_t.k && uty.visibleControl() ){
				// mobi
				_t.k = true;
				modules.destroy();
			}else if( _t.k && !uty.visibleControl() ){
				// pc
				_t.k = false;
				//modules.destroy();
				//plugin.destroy();
			}
		},
		init: function(){
			var _t = this;
			if( uty.visibleControl() )
				_t.k = false;
		}
	},
	events = {
		bdyClicked: function(){
			$('body, html').bind('click touchstart', function( e ){
				var m = $('.dropdown'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('opened');
				
				m = $('.kutuSolMenuTree'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('opened');	
			});	
		},
		loaded: function(){
			uty.lazyLoad( { ID: 'body' } );
		},
		onResize: function(){
			wt = parseFloat( win.width() );
			ht = parseFloat( win.height() );
			
			combine.adjust();
			modules.prdCompact.onScroll();
			resetDom.onResize();
		},
		onScroll: function(){
			wst = parseFloat( win.scrollTop() );
			sRatio = wst / ( doc.height() - ht );
			
			combine.adjust();
			modules.prdCompact.onScroll();
		},
		init: function(){
			var _t = this;
				_t.bdyClicked();
			win.load( _t.loaded );
			win.resize( _t.onResize ).resize();
			win.scroll( _t.onScroll ).scroll();	
		}
	},
	initialize = function(){
		management.init();
		combine.init();
		pages.init();
		api.init();
		plugin.init();
		modules.init();
		resetDom.init();
		events.init();
		addToFavorites.init();
	};
	
	initialize();
	
/****** DISPATCH ******/

stage.addEventListener("CustomEvent", [{type:"visilabsLoad", handler:"onVisilabsLoad"}]); 
function onVisilabsLoad(){ visManagement.init(); }

/* CART */	
stage.addEventListener("CustomEvent", [ { type: "sepetDoldur", handler: "cartAmound" } ]);
stage.addEventListener("CustomEvent", [ { type: "sepeteEkle", handler: "cartAdd" } ]);	
function cartAmound(){ modules.cart.amound(); }
function cartAdd(){ modules.cart.add(); }
cartAmound();

/* COMPARE */
stage.addEventListener("CustomEvent", [ { type: "kiyaslaUrunEkle", handler: "onComparePrdAdd" } ]);
function onComparePrdAdd(){	modules.compare.add(); }

/* LOGIN */
stage.addEventListener("CustomEvent", [ { type: "uyeLogin", handler: "onUyeLogin" } ]);
function onUyeLogin(){ modules.login.set(); }
onUyeLogin();