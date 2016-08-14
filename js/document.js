/*

    Set of functions to manipulate documents -
    create, save, delete, load

*/

var reload_list = true;
var loaded = false;
var loaded_html;

/**
* saves current document (via ajax)
*/
function saveDocument()
{
    var form = getElement('save_form');

    showGrStatusBar();

    xajax_save_model
    (
        form['id'].value,
        form['title'].value,
        Project.dump(),
        (form['display'].checked ? 1 : 0),
        Project.ratio * 100
    );
}

/**
* creates new blank document
*/
function newDocument()
{
    Project._delete();

    Project = new ProjectClass('A4', 1, 'vertical');
    Project.setRatio(getSelectedValue('ratio'));

    getElement('doc_id').value = '';
    getElement('doc_title').value = '';
    getElement('doc_title').disabled = false;
}

/**
* makes documents' list for 'Open' menu (via ajax)
*/
function documentsList()
{
    if (reload_list)
    {
        showGrStatusBar();

        getElement('doc_list').innerHTML = '';
        xajax_models_list();
        reload_list = false;
    }

    popupOptionsDiv('open_doc');
}

/**
* makes a single list item in 'Open' menu
*/
function documentsListItem(id, title, dt, last_saved)
{
    var cont = getElement('doc_list');

    var div = createElement('div');

    var a = createElement('a');
    a.href    = 'javascript://';
    a.onclick = function ()
    {
        openDocument(id);
    }

    a.style.color = 'blue';

    appendChild(a, document.createTextNode(title));
    appendChild(div, a);
    appendChild(div, document.createTextNode(' created: ' + dt + '; last saved: ' + last_saved));
    appendChild(cont, div);
}

/**
* open previously saved document (ajax)
*/
function openDocument(id)
{
    deletePages();
    showGrStatusBar();

    xajax_load_model(id);
}

/**
* loads document from DB into work space
*/
function loadDocument(id, title, ratio)
{
//	alert(BlockGroups);

    pages              = new Array();
    text_blocks_count  = 0;
    image_blocks_count = 0;
    blocks_count       = 0;
    selected_page      = false;
    selected_block     = false;
    BlockGroups        = {};
    cachedObjects      = {};

    var ws = getElement('work_space');

    ws.innerHTML = getElement('dtmp').value;

    for (var j = 0; j < ws.childNodes.length; j++)
    {
        pages.push(ws.childNodes[j]);

        var page_body = ws.childNodes[j].firstChild;

        for (var i = 0; i < page_body.childNodes.length; i++)
        {
            var block = page_body.childNodes[i];

            aggregateBlockFunction(block);

            block.ondblclick = blockOnDoubleClick;

            blocks_count++;
            var parts = block.className.split(' ');

            if (typeof BlockGroups[parts[2]] == "undefined")
            {
                BlockGroups[parts[2]] = new blocksGroup;
                BlockGroups[parts[2]].setId(parts[2]);
                BlockGroups[parts[2]].setName(block.getAttribute(group_name_attr));
            }

            BlockGroups[parts[2]].add(block);

            if (block.isTextBlock())    text_blocks_count++;
            else                        image_blocks_count++;;

            repositionBlock(block);
        }
    }

    setSelectedOption('ratio', ratio);
    getElement('pages_num').value = pages.length;

    getElement('doc_id').value = id;
    getElement('doc_title').value = title;
    getElement('doc_title').disabled = true;

    hideOptionsDivs();
}

/**
* loads predefined document model (calendar, photo album, etc.)
*/
function useModel(model)
{
    if (model == '') return false;
    Project._delete();
    eval(model + '()');
}