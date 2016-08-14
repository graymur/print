var opened_tabs = [];
var tab_width = 150;
var tab_height = 175;

var tabs_list = {
    'tab_pages'     : Array('Pages'),
    'tab_blocks'    : Array('Block group')
};

function showTabsList()
{
    var list = getElement('tabslist');

    if (list.style.display == 'block')
    {
        list.style.display = 'none';
        return ;
    }

    var button = getElement('tabslist_swt');

    pos = findPos(button);
    list.style.left = pos[0] + 'px';
    list.style.top = pos[1] + button.offsetHeight + 'px';
    list.style.display = 'block';

    var cells = list.getElementsByTagName('TD');

    for (i = 0; i < cells.length; i++)
    {
        if (cells[i].id == '') continue;
        var tab = getElement(cells[i].id.replace('_swt', ''));

        cells[i].previousSibling.innerHTML = '';

        if (tab.style.display == 'block')
        {
            var img = createElement('img');
            img.src = 'images/tick.gif';
            appendChild(cells[i].previousSibling, img);
        }
    }
};

function showTab(tab_name)
{
    var tab = getElement('tab_' + tab_name);

    if (tab.style.display == 'block')
    {
        tab.style.display = 'none';
    }
    else
    {
        tab.style.display = 'block';
    }

    showTabsList();
};

function initTabs()
{
    var init_left = (window.innerWidth || document.body.clientWidth) - tab_width - 75;
    var init_top  = 100;

    for (tab_id in tabs_list)
    {
        getElement(tab_id).style.display = 'block';
        eval('init_' + tab_id + '()');
//        initFloatingWindowWithTabs(tab_id,tabs_list[tab_id],tab_width,tab_height,init_left,init_top,false,false,false,false,false,false);
        initFloatingWindowWithTabs(tab_id,tabs_list[tab_id],tab_width,tab_height,init_left,init_top);
        init_top += tab_height + 20;
    }
};

function reloadTabs()
{
    init_tab_blocks();
    init_tab_pages();
};

function init_tab_blocks()
{
    var container = getElement('tab_blocks_groups');

    container.innerHTML = '';

    if (Project.BlockManager.count == 0)
    {
        container.innerHTML = Lang['js_no_blocks_yet'];
        return ;
    }

    for (var i = 0; i < Project.BlockManager.groups.length; i++)
    {
        var Group = Project.BlockManager.groups[i];

        var div = createElement('div');
        div.id = Group.id + '_del';

        var button = createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'delete');
        button.GroupObject = Group;
        button.onclick = deleteBlockGroup;

        var block_name = createElement('span');
        block_name.className = 'groupName';
        block_name.ondblclick = switchBlockGroupName;
        block_name.style.fontWeight = 'bold';
        block_name.style.marginLeft = '5px';
        block_name.GroupObject = Group;
        appendChild(block_name, textNode(Group.name));

        appendChild(div, block_name);
        appendChild(container, div);

        for (var j = 0; j < Group.blocks.length; j++)
        {
            var Block = Group.blocks[j];

            var div = createElement('div');
            div.id = Group.id + '_del';

            var button = createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'delete');
            button.BlockObject = Block;
            button.onclick = deleteBlockByButton;

            var visibility = createElement('div');
            div.style.cssFloat = 'left';
            var img = createImage('images/eye.gif');
            img.BlockObject = Block;
            img.className = 'pointer';
            img.style.verticalAlign = 'middle';
            img.onclick = setBlockVisibility;

            appendChild(div, img);

            var block_name = createElement('span');
            block_name.className = 'blockName';
            block_name.ondblclick = switchBlockNameInput;
            block_name.onmousedown = dragBlockName;
            block_name.style.marginLeft = '5px';
            block_name.BlockObject = Block;

            appendChild(block_name, textNode(Block.name));

            appendChild(div, block_name);
            appendChild(container, div);
        }

        clearingDiv(container);

        var hr = createElement('hr');
        hr.size = 1;

        appendChild(container, hr);
    }
};

var blockNameDragElement;
var tabElements = [];
var initTabHeight;
var currentTab;

function dragBlockName(e, type)
{
    e = getEvent(e);

    type = (typeof type == 'undefined') ? 'groups' : 'pages';

    blockNameDragElement = e.srcElement.cloneNode(true);
    blockNameDragElement.BlockObject = e.srcElement.BlockObject;

    var container = e.srcElement.parentNode.parentNode;
    var tab = container.parentNode;
    var pos = findPos(e.srcElement);

    blockNameDragElement.id = 'blockNameDragElement';
    blockNameDragElement.style.left     = pos[0] + 'px';
    blockNameDragElement.style.top      = pos[1] + 'px';
    blockNameDragElement.style.zIndex   = ++PopupManager.zIndex;

    blockNameDragElement['tmpX'] = _parseInt(blockNameDragElement.style.left) - e.clientX;
    blockNameDragElement['tmpY'] = _parseInt(blockNameDragElement.style.top) - e.clientY;

    appendChild(document.body, blockNameDragElement);

    var new_container = createElement('div');
    new_container.id = (type == 'groups') ? 'moveBlockToNewGroup' : 'moveBlockToNewPage';
    new_container.style.fontWeight = 'bold';
    new_container.style.textAlign = 'center';

    appendChild(new_container, textNode((type == 'groups') ? 'New group' : 'New page'));
    appendChild(container, new_container);

    currentTab = container;
    initTabHeight = container.style.height;
    container.style.height = container.offsetHeight + 20 + 'px';

    tabElements = [];

    domTree2Array(getElement((type == 'groups') ? 'tab_blocks_groups' : 'tab_pages_list'));

    document.onmousemove = function (e) { mouseMoveDragBlockName(e, type) };
    document.onmouseup   = mouseUpDragBlockName;
};

function mouseMoveDragBlockName(e, type)
{
    e = getEvent(e);

    type = (typeof type == 'undefined') ? 'groups' : 'pages';

    blockNameDragElement.style.left = _parseInt(blockNameDragElement['tmpX'] + e.clientX) + 'px';
    blockNameDragElement.style.top  = _parseInt(blockNameDragElement['tmpY'] + e.clientY) + 'px';

    var below = elementsBelow(blockNameDragElement, tabElements);

    in2.value = type;

    removeNodeById('blockNameDragTip');

    for (var i = 0; i < below.length; i++)
    {
        in1.value = below[i].id;

        if (typeof below[i].GroupObject != 'undefined' || typeof below[i].PageObject != 'undefined')
        {
            var tip = createElement('div');
            tip.id = 'blockNameDragTip';
            appendChild(tip, textNode(type == 'blocks' ? 'Move block to this group' : 'Move block to this page'));
            appendChild(document.body, tip);

            tip.style.left = _parseInt(blockNameDragElement.style.left) + 'px';
            tip.style.top = _parseInt(blockNameDragElement.style.top) - tip.offsetHeight - 5 + 'px';
            tip.style.zIndex = ++PopupManager.zIndex;
        }
        else if (below[i].id == 'moveBlockToNewGroup')
        {
            in1.value = 'move to new group';
        }
        else if (below[i].id == 'moveBlockToNewPage')
        {
            in1.value = 'move to new page';
        }
        else
        {
            in1.value = '';
        }
    }
};

function mouseUpDragBlockName(e)
{
    e = getEvent(e);

    document.onmousemove = null;
    document.onmouseup   = null;

    var below = elementsBelow(blockNameDragElement, tabElements);

    for (var i = 0; i < below.length; i++)
    {
        if (typeof below[i].GroupObject != 'undefined')
        {
            blockNameDragElement.BlockObject.moveTo(below[i].GroupObject);
        }
        if (typeof below[i].PageObject != 'undefined')
        {
            blockNameDragElement.BlockObject.moveToPage(below[i].PageObject);
        }
        else if (below[i].id == 'moveBlockToNewGroup')
        {
            Project.BlockManager.createGroupFromBlock(blockNameDragElement.BlockObject);
        }
        else if (below[i].id == 'moveBlockToNewPage')
        {
            Project.createPage();
            Block = blockNameDragElement.BlockObject;
            var Page = Project.pages[(Project.pages.length - 1)];

            Block.moveToPage(Page);
        }
    }

    removeNodeById('moveBlockToNewGroup');
    removeNodeById('moveBlockToNewPage');
    currentTab.style.height = initTabHeight;
    removeNodeById('blockNameDragTip');
    removeNode(blockNameDragElement);
    blockNameDragElement = false;

    init_tab_blocks();
    init_tab_pages();
};

// get elements below current
function elementsBelow(object, elements)
{
    var divs = document.getElementsByTagName('div');
    var elementsBelow = [];

    var posX = _parseInt(object.style.left);
    var posY = _parseInt(object.style.top);

    for (i = 0; i < elements.length; i++)
    {
        if (elements[i] == object || elements[i].tagName == 'undefined')
        {
            continue;
        }

        var pos = findPos(elements[i]);

        var d_x = pos[0] - object.offsetWidth / 2;
        var d_y = pos[1] - object.offsetHeight / 2;

        if (posX >= d_x && posX <= d_x + object.offsetWidth &&  posY >= d_y && posY <= d_y + object.offsetHeight)
        {
            elementsBelow.push(elements[i]);
        }
    }

    return elementsBelow;
};


function domTree2Array(parent)
{
    for (var i = 0; i < parent.childNodes.length; i++)
    {
        var pos = findPos(parent.childNodes[i]);

        tabElements.push(parent.childNodes[i]);
        domTree2Array(parent.childNodes[i]);
    }
}

function init_tab_pages()
{
    var container = getElement('tab_pages_list');

    container.innerHTML = '';

    if (Project.pages.count == 0)
    {
        container.innerHTML = Lang['js_no_blocks_yet'];
        return ;
    }

    for (var i = 0; i < Project.pages.length; i++)
    {
        var Page = Project.pages[i];

        var div = createElement('div');
        div.id = Page.id + '_del';

        var button = createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'delete');
        button.PageObject = Page;
        button.onclick = deleteBlockGroup;

        var block_name = createElement('span');
        block_name.className = 'groupName';
//        block_name.ondblclick = switchBlockGroupName;
        block_name.style.fontWeight = 'bold';
        block_name.style.marginLeft = '5px';
        block_name.PageObject = Page;
        appendChild(block_name, textNode('Page ' + (i + 1)));

        appendChild(div, block_name);
        appendChild(container, div);

        for (var j = 0; j < Page.blocks.length; j++)
        {
            var Block = Page.blocks[j];

            var div = createElement('div');
            div.id = Page.id + '_del';

            var button = createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'delete');
            button.BlockObject = Block;
            button.onclick = deleteBlockByButton;

            var visibility = createElement('div');
            div.style.cssFloat = 'left';
            var img = createImage('images/eye.gif');
            img.BlockObject = Block;
            img.className = 'pointer';
            img.style.verticalAlign = 'middle';
            img.onclick = setBlockVisibility;

            appendChild(div, img);

            var block_name = createElement('span');
            block_name.className = 'blockName';
            block_name.ondblclick = switchBlockNameInput;
            block_name.onmousedown = function (e) { dragBlockName(e, 'page') };
            block_name.style.marginLeft = '5px';
            block_name.BlockObject = Block;

            appendChild(block_name, textNode(Block.name));

            appendChild(div, block_name);
            appendChild(container, div);
        }

        clearingDiv(container);

        var hr = createElement('hr');
        hr.size = 1;

        appendChild(container, hr);
    }
};