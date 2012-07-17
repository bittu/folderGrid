/*
 *  Project			:		folderGrid
 *
 *  Description		: 		folderGrid is a jQuery Plugin used for dynamic creation of folders 
 *							and files structure in a grid format instead of tree.
 *
 *  Author			:		Sandeep Vemula
 *
 *  License			:		Copyright 2012, Sandeep Vemula
 * 			 				Licensed under the GNU-GPL licenses.
 * 			 				You must have received a copy of the GNU General Public License
 *			 				along with this plugin as COPYING.txt
 *		 	 				If not, see <http://www.gnu.org/licenses/>.
 *
 *	Required Files	:		jquery.js,
 *							jquery.folderGrid.js or jquery.folderGrid.min.js,
 *							jquery.folderGrid.css,
 *							images/folder.gif, images/leaf.gif
 *
 *	Note			:		Please follow the documentation clearly.
 */


;(function ( $, window, document, undefined ) {
    
	$.fn.folderGrid = function(settings){

		var $obj = $(this);

		var config = {
			colModel:[],
			url:'',
			headerTitle:'/',
			openFileFn : {},
			parentID : 0,
			param : 'id',
			imageCfg : ''
		};
		
		if (settings){$.extend(config, settings);}
		
		var $error = false;
		
		var $opID = config.parentID;
		var $pIDs = new Array();
		$pIDs.push($opID);
		$pIDs.push($opID);
		var $concatParam = false;

		var init = function(){
			$obj.append(createHeader());
			$obj.append(createTable());
			if(config.colModel.length>0)
			{
				$('#'+$selector+'-folderGrid-table').append(createTableHeader());
			}
			else
			{
				$('#'+$selector+'-folderGrid-table').append($('<tr>').append($('<td>',{text:'colModel not specified', style:'border : 1px solid red;'})));
				$error = true;
			}
			if((typeof config.imageCfg)=='object')
				createCustomCSS();
		};
		
		var fetch = function(){
			if(config.url=='')
			{
				$('#'+$selector+'-folderGrid-table').append($('<tr>').append($('<td>',{text:'url not specified', style:'border : 1px solid red;', colspan : config.colModel.length+1, align : 'center'})));
				$error = true;
			}
			else
			{
				if(config.url.indexOf('?')!=-1)
					$concatParam = true;
				var pid = $pIDs.pop();
				$.ajax({
					url : config.url+($concatParam?'&':'?')+config.param+'='+pid,
					success : function(response){								
								var data = $.parseJSON(response);
								var tbody = $('<tbody>');
								for(var i=0; i<data.length; i++)
								{
									var tr = $('<tr>');
									var tmpData = data[i];
									if((typeof config.imageCfg)=='object')
									{
										tr.append($('<td>').addClass(tmpData[config.imageCfg.cfg]));
									}
									else{
										tr.append($('<td>').addClass(tmpData['isFolder']==="true"?'folder':'leaf'));
										}
									for(var j=0; j<config.colModel.length; j++)
									{
										var tmpHead = config.colModel[j];
										var td = $('<td>',{text:tmpData[tmpHead.index]});
										tr.append(td);
									}
									tbody.append(tr.attr({'id' : tmpData['id'], 'isFolder' : tmpData['isFolder']}));
								}
								
								if(!data.length>0)
									tbody.append($('<tr>').append($('<td>',{text:'no records found', style:'border : 1px solid red;', colspan : config.colModel.length+1, align : 'center'})));
								
								if($('#'+$selector+'-folderGrid-table').find('tbody'))									
									$('#'+$selector+'-folderGrid-table').find('tbody').remove();
								$('#'+$selector+'-folderGrid-table').append(tbody);
								
								$pIDs.push(pid);
								showHideBackButton(pid);
								addEventListeners();
							}
				});
			}
		};

		var createHeader = function(){
			var headerDiv = $('<div>',{
								id : $selector+'-folderGrid-header'
							}).addClass('folderGrid-header');
			var headerBackDiv = $('<div>',{
									id : $selector+'-folderGrid-header-back',
									text : 'Back'
								}).addClass('folderGrid-header-back');
			var headerTitleP = $('<p>',{
									id : $selector+'-folderGrid-header-title',
									text : config.headerTitle
								}).addClass('folderGrid-header-title');
			headerDiv.append(headerBackDiv);
			headerDiv.append(headerTitleP);
			return headerDiv;
		};

		var createTable = function(){
			return $('<table>',{
						id : $selector+'-folderGrid-table',
						cellspacing : '0',
						cellpadding : '5',
						border : '1',
						align : 'center'
					}).addClass('folderGrid-table');
		};
		
		var createTableHeader = function(){
			var folderGridTableHeader = $('<thead>');
			var tr = $('<tr>');
			tr.append($('<th>'));
			for(var i=0; i<config.colModel.length; i++)
			{
				var tmpHead = config.colModel[i];
				var th = $('<th>',{text:tmpHead.colName});
				tr.append(th);
			}
			folderGridTableHeader.append(tr);
			return folderGridTableHeader;
		};
		
		var addEventListeners = function(){
			$('#'+$selector+'-folderGrid-table').find('tbody > tr').each(function(){
			
				$(this).click(function(){
					clearRowSelection();
					$(this).addClass('rSelected');
				});
				
				$(this).dblclick(function(){
					clearTextSelection();
					if($('#'+$selector+'-folderGrid-table').find('.rSelected').attr('isFolder')=='true')
					{
						$pIDs.push($('#'+$selector+'-folderGrid-table').find('.rSelected').attr('id'));
						fetch();
					}
					else
						if(typeof config.openFileFn == 'function')
							config.openFileFn($('#'+$selector+'-folderGrid-table').find('.rSelected').attr('id'));
						
				});
			});
		};
		
		function clearRowSelection()
		{
			$('#'+$selector+'-folderGrid-table').find('tbody > tr').each(function(){
				$(this).removeClass('rSelected');
			});
		}
	
		function clearTextSelection()
		{
			if (window.getSelection) {
				  if (window.getSelection().empty) {  // Chrome
					window.getSelection().empty();
				  } else if (window.getSelection().removeAllRanges) {  // Firefox
					window.getSelection().removeAllRanges();
				  }
				} else if (document.selection) {  // IE?
				  document.selection.empty();
				}
		}
		
		var genRand = function () {
			var length = 3;
			var iteration = 0;
			var password = "";
			var randomNumber;
			
			while(iteration < length){
				randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
				if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
				if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
				if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
				if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
				iteration++;
				password += String.fromCharCode(randomNumber);
			}
			return password;
		};
		
		function showHideBackButton(pID)
		{
			if(pID==$opID)
				$('#'+$selector+'-folderGrid-header-back').hide();
			else{
				$('#'+$selector+'-folderGrid-header-back').show();
				$('#'+$selector+'-folderGrid-header-back').unbind('click');
				$('#'+$selector+'-folderGrid-header-back').click(function(){
					$pIDs.pop();
					fetch();
				});
			}
		}

		function createCustomCSS()
		{
			var style = $("<style>",{ type : 'text/css', rel : 'folderGrid'});
			for(var i=0; i<config.imageCfg.images.length; i++)
			{
				var imgObj = config.imageCfg.images[i];
				if(!findCSSClass(imgObj.type))
					style.append('.'+imgObj.type+' { background : url(\''+imgObj.image+'\') no-repeat 50% 50% scroll transparent; } ');
			}
			style.appendTo("head");
		}

		function findCSSClass(className)
		{
			if(!document.styleSheets) return false;
			var A, S, DS= document.styleSheets, n= DS.length, SA= [];
				while(n){
					S= DS[--n];
					if(S.ownerNode.attributes.rel && S.ownerNode.attributes.rel.childNodes[0].wholeText == "folderGrid"){
						A= (S.rules)? S.rules: S.cssRules;
						for(var i= 0, L= A.length; i<L; i++){
								tem= A[i].selectorText? [A[i].selectorText, A[i].style.cssText]: [A[i]+''];
						if('.'+className == tem[0])
							return true;
						}
					}
				}
				return false;
			}
		
		var $selector = $obj.selector.substring(1, $obj.selector.length)+genRand();

		return this.each(function() {      
			init();
			if(!$error)
				fetch();
		});
	};

})(jQuery, window, document);