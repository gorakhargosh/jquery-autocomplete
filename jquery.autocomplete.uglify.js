(function($){function Autocomplete(a,b){this.el=$(a),this.el.attr("autocomplete","off"),this.suggestions=[],this.data=[],this.badQueries=[],this.selectedIndex=-1,this.currentValue=this.el.val(),this.intervalId=0,this.cachedResponse=[],this.onChangeInterval=null,this.ignoreValueChange=!1,this.serviceUrl=b.serviceUrl,this.isLocal=!1,this.options={autoSubmit:!1,minChars:1,maxHeight:300,deferRequestBy:0,width:0,highlight:!0,queryWord:"query",params:{},fnFormatResult:fnFormatResult,delimiter:null,zIndex:9999},this.initialize(),this.setOptions(b)}function fnFormatResult(a,b,c){var d="("+c.replace(reEscape,"\\$1")+")";return a.replace(new RegExp(d,"gi"),"<strong>$1</strong>")}var reEscape=new RegExp("(\\"+["/",".","*","+","?","|","(",")","[","]","{","}","\\"].join("|\\")+")","g");$.fn.autocomplete=function(a){return new Autocomplete(this.get(0)||$("<input />"),a)},Autocomplete.prototype={killerFn:null,initialize:function(){var a,b,c;a=this,b=Math.floor(Math.random()*1048576).toString(16),c="Autocomplete_"+b,this.killerFn=function(b){$(b.target).parents(".autocomplete").size()===0&&(a.killSuggestions(),a.disableKillerFn())},this.options.width||(this.options.width=this.el.width()),this.mainContainerId="AutocompleteContainter_"+b,$('<div id="'+this.mainContainerId+'" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="'+c+'" style="display:none; width:300px;"></div></div></div>').appendTo("body"),this.container=$("#"+c),this.fixPosition(),window.opera?this.el.keypress(function(b){a.onKeyPress(b)}):this.el.keydown(function(b){a.onKeyPress(b)}),this.el.keyup(function(b){a.onKeyUp(b)}),this.el.blur(function(){a.enableKillerFn()}),this.el.focus(function(){a.fixPosition()})},setOptions:function(a){var b=this.options;$.extend(b,a),b.lookup&&(this.isLocal=!0,$.isArray(b.lookup)&&(b.lookup={suggestions:b.lookup,data:[]})),$("#"+this.mainContainerId).css({zIndex:b.zIndex}),this.container.css({maxHeight:b.maxHeight+"px",width:b.width})},clearCache:function(){this.cachedResponse=[],this.badQueries=[]},disable:function(){this.disabled=!0},enable:function(){this.disabled=!1},fixPosition:function(){var a=this.el.offset();$("#"+this.mainContainerId).css({top:a.top+this.el.innerHeight()+"px",left:a.left+"px"})},enableKillerFn:function(){var a=this;$(document).bind("click",a.killerFn)},disableKillerFn:function(){var a=this;$(document).unbind("click",a.killerFn)},killSuggestions:function(){var a=this;this.stopKillSuggestions(),this.intervalId=window.setInterval(function(){a.hide(),a.stopKillSuggestions()},300)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},onKeyPress:function(a){if(!this.disabled&&!!this.enabled){switch(a.keyCode){case 27:this.el.val(this.currentValue),this.hide();break;case 9:case 13:if(this.selectedIndex===-1){this.hide();return}this.select(this.selectedIndex);if(a.keyCode===9)return;break;case 38:this.moveUp();break;case 40:this.moveDown();break;default:return}a.stopImmediatePropagation(),a.preventDefault()}},onKeyUp:function(a){if(!this.disabled){switch(a.keyCode){case 38:case 40:return}clearInterval(this.onChangeInterval);if(this.currentValue!==this.el.val())if(this.options.deferRequestBy>0){var b=this;this.onChangeInterval=setInterval(function(){b.onValueChange()},this.options.deferRequestBy)}else this.onValueChange()}},onValueChange:function(){clearInterval(this.onChangeInterval),this.currentValue=this.el.val();var a=this.getQuery(this.currentValue);this.selectedIndex=-1;this.ignoreValueChange?this.ignoreValueChange=!1:a===""||a.length<this.options.minChars?this.hide():this.getSuggestions(a)},getQuery:function(a){var b,c;b=this.options.delimiter;if(!b)return $.trim(a);c=a.split(b);return $.trim(c[c.length-1])},getSuggestionsLocal:function(a){var b,c,d,e,f;c=this.options.lookup,d=c.suggestions.length,b={suggestions:[],data:[]},a=a.toLowerCase();for(f=0;f<d;f++)e=c.suggestions[f],e.toLowerCase().indexOf(a)===0&&(b.suggestions.push(e),b.data.push(c.data[f]));return b},getSuggestions:function(a){var b,c;b=this.isLocal?this.getSuggestionsLocal(a):this.cachedResponse[a],b&&$.isArray(b.suggestions)?(this.suggestions=b.suggestions,this.data=b.data,this.suggest()):this.isBadQuery(a)||(c=this,c.options.params[c.options.queryWord]=a,$.get(this.serviceUrl,c.options.params,function(a){c.processResponse(a)},"text"))},isBadQuery:function(a){var b=this.badQueries.length;while(b--)if(a.indexOf(this.badQueries[b])===0)return!0;return!1},hide:function(){this.enabled=!1,this.selectedIndex=-1,this.container.hide()},suggest:function(){if(this.suggestions.length===0)this.hide();else{var a,b,c,d,e,f,g,h,i;a=this,b=this.suggestions.length,d=this.options.fnFormatResult,e=this.getQuery(this.currentValue),h=function(b){return function(){a.activate(b)}},i=function(b){return function(){a.select(b)}},this.container.hide().empty();for(f=0;f<b;f++)g=this.suggestions[f],c=$((a.selectedIndex===f?'<div class="selected"':"<div")+' title="'+g+'">'+d(g,this.data[f],e)+"</div>"),c.mouseover(h(f)),c.click(i(f)),this.container.append(c);this.enabled=!0,this.container.show()}},processResponse:function(text){var response;try{response=eval("("+text+")")}catch(err){return}$.isArray(response.data)||(response.data=[]),q=response[this.options.queryWord],this.options.noCache||(this.cachedResponse[q]=response,response.suggestions.length===0&&this.badQueries.push(q)),q===this.getQuery(this.currentValue)&&(this.suggestions=response.suggestions,this.data=response.data,this.suggest())},activate:function(a){var b,c;b=this.container.children(),this.selectedIndex!==-1&&b.length>this.selectedIndex&&$(b.get(this.selectedIndex)).removeClass(),this.selectedIndex=a,this.selectedIndex!==-1&&b.length>this.selectedIndex&&(c=b.get(this.selectedIndex),$(c).addClass("selected"));return c},deactivate:function(a,b){a.className="",this.selectedIndex===b&&(this.selectedIndex=-1)},select:function(a){var b,c;b=this.suggestions[a],b&&(this.el.val(b),this.options.autoSubmit&&(c=this.el.parents("form"),c.length>0&&c.get(0).submit()),this.ignoreValueChange=!0,this.hide(),this.onSelect(a))},moveUp:function(){if(this.selectedIndex!==-1){if(this.selectedIndex===0){this.container.children().get(0).className="",this.selectedIndex=-1,this.el.val(this.currentValue);return}this.adjustScroll(this.selectedIndex-1)}},moveDown:function(){this.selectedIndex!==this.suggestions.length-1&&this.adjustScroll(this.selectedIndex+1)},adjustScroll:function(a){var b,c,d,e;b=this.activate(a),c=b.offsetTop,d=this.container.scrollTop(),e=d+this.options.maxHeight-25,c<d?this.container.scrollTop(c):c>e&&this.container.scrollTop(c-this.options.maxHeight+25),this.el.val(this.getValue(this.suggestions[a]))},onSelect:function(a){var b,c,d,e;b=this,c=b.options.onSelect,d=b.suggestions[a],e=b.data[a],b.el.val(b.getValue(d)),$.isFunction(c)&&c(d,e,b.el)},getValue:function(a){var b,c,d,e;e=this,b=e.options.delimiter;if(!b)return a;c=e.currentValue,d=c.split(b);if(d.length===1)return a;return c.substr(0,c.length-d[d.length-1].length)+a}}})(jQuery)