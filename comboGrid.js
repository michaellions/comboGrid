/**
 * @preserve jQuery combotable plugin v0.2.0
 * @homepage
 * (c) 2016, micros.
 */
(function( $ ) {
	'use strict';
	var default_options  = {
		gridtype:"table",
		/*gridtype-grid模式
		* 默认：table-表格模式
		* 其他：pic-图片模式
		*           desc-描述模式
		* */
	maintable:function () {},//关联主表table名-例:maintableid:xshztable,用此function () {}方法可获得外部的实例为参数
	maintablerowindex:-1,//主表当前行索引
	maintablecols:[],//主表列名称-例:maintablecols:['sgjmax','sgjmin','xgjmax','xgjmin'],如果只有一列数据要填入主表，请将此属性设置为空即maintablecols:[]
	curtablecols:[],//当前combogrid表格列名称-例:curtablecols:['sgjmax','sgjmin','xgjmax','xgjmin'] 注意:需与主表列名称数量一致。将当前表格列中的数据传到主表对应列中
        inputcol:"",//主表当前input要得到值的列name，请注意inputcol中的值不能出现在maintablecols和curtablecols中
        url:'',
	//ajax:{},
	data:[],
        processing:false,
        columns:[],
	columnDefs:[],
        createdRow: function ( row, data, index ) {},//创建行回调-设置行的style
        serverSide:true,
        ordering:false,
        aLengthMenu: [[-1], ["全部"]],
	scrollY: 200,//同时开启垂直(表格高度)和水平滚动条
	scrollX: "100%",
	sScrollXInner: "100%",
	scrollCollapse:true,
	width:224,
	language:{
		"sProcessing": "处理中,请稍后...",
		"sLengthMenu": "&nbsp;显示&nbsp;_MENU_",
		"sZeroRecords": "没有匹配结果",
		"sInfo": "显示_START_至_END_条,共_TOTAL_条记录&nbsp;",
		"sInfoEmpty": "显示0至0,共0条记录",
		"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
		"sInfoPostFix": "",
		"sSearch": "搜索:",
		"sUrl": "",
		"sEmptyTable": "表中数据为空",
		"sLoadingRecords": "载入中,请稍后...",
		"sInfoThousands": ",",//千分位符号
		"oPaginate": {
			"sFirst": "<i class='yong-icon fa fa-angle-double-left bigger-140'></i>",
			"sPrevious": "<i class='yong-icon fa fa-angle-left bigger-140'></i>",
			"sNext": "<i class='yong-icon fa fa-angle-right bigger-140'></i>",
			"sLast": "<i class='yong-icon fa fa-angle-double-right bigger-140'></i>",
			"sJump":"跳转"},
		"oAria": {
			"sSortAscending": ": 以升序排列此列",
			"sSortDescending": ": 以降序排列此列"}
	},
        dom:'t',
	tableid:'micros',//当前表格id-应用时可不设置
	value:'',
	closeOnDataSelect:0,
	closeOnWithoutClick:true,
	tablepicker:true,
	opened:false,
	inline:false,
	onShow:function() {},
	onClose:function() {},
	withoutCopyright:true,
	inverseButton:false,
	scrollInput:true,
	validateOnBlur:true,
	style:'',
	id:'',
	className:''
 };
	// fix for ie8
	if ( !Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(obj, start) {
			 for (var i = (start || 0), j = this.length; i < j; i++) {
				 if (this[i] === obj) { return i; }
			 }
			 return -1;
		}
	}
	$.fn.comboGrid = function( opt ) {
		var KEY0 = 48,
			KEY9 = 57,
			_KEY0 = 96,
			_KEY9 = 105,
			CTRLKEY = 17,
			DEL = 46,
			ENTER = 13,
			ESC = 27,
			BACKSPACE = 8,
			ARROWLEFT = 37,
			ARROWUP = 38,
			ARROWRIGHT = 39,
			ARROWDOWN = 40,
			TAB = 9,
			F5 = 116,
			AKEY = 65,
			CKEY = 67,
			VKEY = 86,
			ZKEY = 90,
			YKEY = 89,
			ctrlDown	=	false,
			options = ($.isPlainObject(opt)||!opt)?$.extend(true,{},default_options,opt):$.extend({},default_options),
			createcombotable = function( input ) {
				var combotable = $('<div '+(options.id?'id="'+options.id+'"':'')+' '+(options.style?'style="'+options.style+'"':'')+' class="micros_combotable micros_noselect '+options.className+'"></div>'),
					micros_copyright = $('<div class="micros_copyright"><a target="_blank" href="http://micros.net/jqplugins/combotable/">micros.net</a></div>'),
					tablepicker = $('<div class="micros_tablepicker active" style="width:'+options.width+'px;"></div>');
				// set options
				combotable.setOptions = function( _options ) {
					options = $.extend(true,{},options,_options);
					if( (options.open||options.opened)&&(!options.inline) ) {
						input.trigger('open.micros');
					}
					if( options.inline ) {
						combotable.addClass('micros_inline');
						input.after(combotable).hide();
						combotable.trigger('afterOpen.micros');
					}
					if( options.tablepicker )
						tablepicker.addClass('active');
					else
						tablepicker.removeClass('active');
					if( options.value ){
						input&&input.val&&input.val(options.value);
					}
					combotable
						.trigger('mchange.micros');
				};
				combotable
					.data('options',options)
					.on('mousedown.micros',function( event ) {
						event.stopPropagation();
						event.preventDefault();
						return false;
					});
				combotable.append(tablepicker);
				if( options.withoutCopyright!==true )
					combotable.append(micros_copyright);
				$('body').append(combotable);

				// base handler - generating a table and tablepicker
				combotable.on('mchange.micros',function( event ) {
				  //generate table
				  var tablehtml ='';
				  switch (options.gridtype){
					case "table":
				      tablehtml ='<table id="'+options.tableid+'" class="table table-striped table-bordered table-hover" style="table-layout:fixed" cellspacing="0"></table>';
					break;
					case "desc":
					  tablehtml ='<table id="'+options.tableid+'" class="table table-hover" style="table-layout:fixed" cellspacing="0"></table>';
					break;
					case "pic":
					  tablehtml ='<table id="'+options.tableid+'" class="table table-striped table-bordered table-hover" style="table-layout:fixed" cellspacing="0"></table>';
					break;
					}
				  tablepicker.html(tablehtml);
				  var curtableElement=$('#'+options.tableid);
				  switch (options.gridtype){
					case "table":
					  curtableElement.DataTable({
					    "ajax":{"url":options.url},
						"processing":options.processing,
						"columns":options.columns,
						"columnDefs":options.columnDefs,
						"serverSide": options.serverSide,
						"ordering": options.ordering,
						"aLengthMenu":options.aLengthMenu,
						"scrollY": options.scrollY,//同时开启垂直(表格高度)和水平滚动条
						"scrollX":options.scrollX,
						"sScrollXInner":options.sScrollXInner,
						"scrollCollapse":options.scrollCollapse,
						"language":options.language,
						"dom": options.dom+'<"microscopyright">'
					  });
					break;
					case "desc":
					  curtableElement.DataTable({
						"data":options.data,
						"processing":options.processing,
						"columns":options.columns,
					    "columnDefs":options.columnDefs,
						"serverSide": options.serverSide,
						"ordering": options.ordering,
						"aLengthMenu":options.aLengthMenu,
						"scrollY": options.scrollY,//同时开启垂直(表格高度)和水平滚动条
						"scrollX":options.scrollX,
						"sScrollXInner":options.sScrollXInner,
						"scrollCollapse":options.scrollCollapse,
						"language":options.language,
						"dom": options.dom+'<"microscopyright">'
					  });
					  $("#micros_wrapper").find(".dataTables_scrollHead").addClass("hide");//隐藏表头
					break;
				  }
				  $("div.microscopyright").html('版权所有&copy; Micros');
				});
				tablepicker.on('click.micros','td',function() {//表格单元格单击时
					var $this = $(this);
					var table= $('#'+options.tableid).DataTable();
					var $row = table.row($this.closest('tr'));
					var $data = $row.data();
					if (/*options.maintableid!=='' && */options.maintablecols.length>0 && options.curtablecols.length>0){//将点击的值导入到主表中
						for (var i=0;i<options.maintablecols.length;i++){
							//var maintable=$(options.maintableid).DataTable();
                            options.maintable.cell(options.maintablerowindex,options.maintable.column(options.maintablecols[i]+":name")).data($data[options.curtablecols[i]]);
						}
					}
                    input.val($data[options.inputcol]);//赋值给input元素
					if( $this.hasClass('micros_disabled') )
						return false;
					if( (options.closeOnDataSelect===true|| options.closeOnDataSelect===0 )&&!options.inline ) {
						combotable.trigger('close.micros').remove();
					}
					combotable.trigger('mchange.micros');
				});
				var setPos = function() {//定位
					var offset = combotable.data('input').offset(), top = offset.top+combotable.data('input')[0].offsetHeight-1, left = offset.left;
					if( top+combotable[0].offsetHeight>$(window).height()+$(window).scrollTop() )
						top = offset.top-combotable[0].offsetHeight+1;
					if( left+combotable[0].offsetWidth>$(window).width() )
						left = offset.left-combotable[0].offsetWidth+combotable.data('input')[0].offsetWidth;
					combotable.css({
						left:left,
						top:top
					});
				};
				combotable.on('open.micros', function() {
						var onShow = true;
						if( options.onShow&&options.onShow.call) {
							onShow = options.onShow.call(combotable,combotable.data('input'));
						}
						if( onShow!==false ) {
							combotable.show();
							combotable.trigger('afterOpen.micros');
							setPos();
							$(window)
								.off('resize.micros',setPos)
								.on('resize.micros',setPos);
							if( options.closeOnWithoutClick ) {
								$([document.body,window]).on('mousedown.micros',function() {
									combotable.trigger('close.micros').remove();
									$([document.body,window]).off('mousedown.micros');
								});
							}
						}
					})
					.on('close.micros', function( event ) {
						event.stopPropagation();
					})
					.data('input',input);
				combotable.setOptions(options);
				combotable.trigger('afterOpen.micros');
				input
					.data( 'micros_combotable',combotable )
					.on('open.micros focusin.micros mousedown.micros',function(event) {
						if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible') )
							return;
							combotable.trigger('open.micros');
					})
			},
			destroycombotable = function( input ) {
				var combotable = input.data('micros_combotable');
				if( combotable ) {
					input
						.data( 'micros_combotable',null )
						.off( 'open.micros focusin.micros focusout.micros mousedown.micros blur.micros keydown.micros' );
					$(window).off('resize.micros');
					$([window,document.body]).off('mousedown.micros');
					input.unmousewheel&&input.unmousewheel();
					combotable.remove();
				}
			};
		return this.each(function() {
			var combotable;
			if( combotable = $(this).data('micros_combotable') ) {
				if( $.type(opt) === 'string' ) {
					switch(opt) {
						case 'show':
							$(this).select().focus();
							combotable.trigger( 'open.micros' );
						break;
						case 'hide':
							combotable.trigger('close.micros').remove();
						break;
						case 'destroy':
							destroycombotable($(this));
						break;
						case 'reset':
							this.value = this.defaultValue;
							if(!this.value)
								combotable.data('changed',false);
						break;
					}
				}else{
					combotable.setOptions(opt);
				}
				return 0;
			}else
				($.type(opt) !== 'string')&&createcombotable($(this));
		});
	};
})( jQuery );
(function(factory) {if(typeof define==='function'&&define.amd) {define(['jquery'],factory)}else if(typeof exports==='object') {module.exports=factory}else{factory(jQuery)}}(function($) {var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'];var toBind='onwheel'in document||document.documentMode>=9?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'];var lowestDelta,lowestDeltaXY;if($.event.fixHooks) {for(var i=toFix.length;i;) {$.event.fixHooks[toFix[--i]]=$.event.mouseHooks}}$.event.special.mousewheel={setup:function() {if(this.addEventListener) {for(var i=toBind.length;i;) {this.addEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function() {if(this.removeEventListener) {for(var i=toBind.length;i;) {this.removeEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn) {return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn) {return this.unbind("mousewheel",fn)}});function handler(event) {var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0,absDeltaXY=0,fn;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta) {delta=orgEvent.wheelDelta}if(orgEvent.detail) {delta=orgEvent.detail*-1}if(orgEvent.deltaY) {deltaY=orgEvent.deltaY*-1;delta=deltaY}if(orgEvent.deltaX) {deltaX=orgEvent.deltaX;delta=deltaX*-1}if(orgEvent.wheelDeltaY!==undefined) {deltaY=orgEvent.wheelDeltaY}if(orgEvent.wheelDeltaX!==undefined) {deltaX=orgEvent.wheelDeltaX*-1}absDelta=Math.abs(delta);if(!lowestDelta||absDelta<lowestDelta) {lowestDelta=absDelta}absDeltaXY=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDeltaXY||absDeltaXY<lowestDeltaXY) {lowestDeltaXY=absDeltaXY}fn=delta>0?'floor':'ceil';delta=Math[fn](delta/lowestDelta);deltaX=Math[fn](deltaX/lowestDeltaXY);deltaY=Math[fn](deltaY/lowestDeltaXY);args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}}));
