# folderGrid

folderGrid is a jQuery Plugin used for dynamic creation of folders 
and files structure in a grid format instead of tree.

### Requires : 
	
	jquery.folderGrid.css
	images/folder.gif, images/leaf.gif
	
	
### Usage : 

Create a div (or any container) and Fire folderGrid on the container
eg: 

    <div id="folders"></div>
    $('#folders').folderGrid({});



### Config Options : 
	
	*mandatory options
	
	*colModel : [
				{index : '<index of the column in data>', colName : '<column name for the display grid>'},
				{...},...
				]
	
	*url : '<url to fetch the data>'
	
	headerTitle : '<title for the grid to be displayed in header>'	(default : '/')
	
	openFileFn : function(){
					// code todo with the single file
				}
	
	parentID : '<value to be sent to server to fetch initial files and folders>'	(default : 0)
	
	param : '<url-parameter to be sent to server for fetching data>'	(default : 'id')
	
	
### Data Structure :

`JSON Array`

	[
	{"isFolder" : "<boolean>", "id" : "<unique value to fetch folder/file contents>", "<index of column1>" : "<value1>", "<index of column2>" : "<value2>", ...},
	{...},...
	]
	
	
### Example : 

	
	<div id="listing"></div>
	
	$('#listing').folderGrid({
		colModel : [
					{index : 'name', colName : 'Name'},
					{index : 'size', colName : 'Size'},
					{index : 'type', colName : 'Type'},
					{index : 'modified', colName : 'Date Modified'}
					],
		url : 'getData',
		headerTitle : 'My Favorities',
		openFileFn : function(id){
						alert('You have tried to open file with id - '+id);
					},
		parentID : 1,
		param : 'pID'
	});
	
`data from url 'getData?pID=1'`
	
	[
	{'id' : '2', 'isFolder' : 'true', 'name' : 'Folder1', 'size' : '', 'type' : 'folder', 'modified' : '4/6/2012'},
	{'id' : '3', 'isFolder' : 'false', 'name' : 'File1', 'size' : '4KB', 'type' : 'file', 'modified' : '4/6/2012'},
	{'id' : '4', 'isFolder' : 'false', 'name' : 'File2', 'size' : '5KB', 'type' : 'file', 'modified' : '4/6/2012'}
	]

`when double clicked on Folder1 row data from url getData?pID=2`

	[
	{'id' : '5', 'isFolder' : 'false', 'name' : 'File3', 'size' : '7KB', 'type' : 'file', 'modified' : '4/6/2012'},
	{'id' : '6', 'isFolder' : 'false', 'name' : 'File4', 'size' : '11KB', 'type' : 'file', 'modified' : '4/6/2012'}
	]

`when double clicked on a file custom function is triggered.`

# Copyright and license

Copyright 2012, Sandeep Vemula _aka_ bittu
Licensed under the GNU-GPL licenses.
You must have received a copy of the GNU General Public License
along with this plugin as COPYING.txt

If not, see http://www.gnu.org/licenses/
