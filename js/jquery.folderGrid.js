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
 * 			 				You should have received a copy of the GNU General Public License
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
			headerTitle:'',
			openFileFn : {},
			parentID : 0,
			param : 'id'
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
								//var dummyData = '[{"id" : "val1", "SI_TITLE" : "Folder1", "SI_KIND" : "Folder", "SI_OWNER" : "Administrator", "isFolder" : "true"}, {"id" : "val2", "SI_TITLE" : "Webi1", "SI_KIND" : "Webi", "SI_OWNER" : "Administrator"}, {"id" : "val3", "SI_TITLE" : "Webi2", "SI_KIND" : "Webi", "SI_OWNER" : "Administrator"}]';
								var data = $.parseJSON(response);
								var tbody = $('<tbody>');
								for(var i=0; i<data.length; i++)
								{
									var tr = $('<tr>');
									var tmpData = data[i];
									tr.append($('<td>').addClass(tmpData['isFolder']?'folder':'leaf'));
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
		
		var $selector = $obj.selector.substring(1, $obj.selector.length)+genRand();

		return this.each(function() {      
			init();
			if(!$error)
				fetch();
		});
	};

})(jQuery, window, document);