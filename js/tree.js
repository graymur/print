function showTree()
{
    var div = getElement('tree');

    div.innerHTML = '';

    for (var p = 0; p < Project.pages.length; p++)
    {
        var Page = Project.pages[p];

        // containter for page's info
        var container = createElement('div');
        appendChild(div, container);

        // plus / minus switch for page's info
        var plus = getElement('switch_sample').cloneNode(true);
        plus.onclick = treeShowNode;
        plus.id = 'switch_' + (p + 1);

        appendChild(container, plus);
        appendChild(container, textNode(' Page ' + (p + 1)));

        var options = getElement('tree_page_options_sample').cloneNode(false);
        options.id = 'tree_options_' + (p + 1);
        appendChild(container, options);

        // plus / minus switch for page's options
        var switch_opt = getElement('page_opt_switch_sample').cloneNode(false);
        switch_opt.onclick = treeShowPageOptions;
        switch_opt.id = 'switch_opt_' + (p + 1);

        appendChild(options, switch_opt);
        appendChild(options, textNode(' Page options'));

        var page_options = getElement('page_options_sample').cloneNode(false);
        page_options.id = 'page_options_' + (p + 1);

//        page_options.style.display = 'block';   // debug

        // page background
        var page_bg = getElement('tree_page_bg_sample').cloneNode(false);
        page_bg.id = 'tree_page_bg_'  + (p + 1);
        page_bg.style.cursor = 'pointer';
        page_bg.style.backgroundColor = Page.page.style.backgroundColor;

        appendChild(page_options, page_bg);
        appendChild(page_options, textNode(' - page background'));

        clearingDiv(page_options, 1);

        // page body background
        var page_body_bg = getElement('tree_page_body_bg_sample').cloneNode(false);
        page_body_bg.id = 'tree_page_body_bg_'  + (p + 1);
        page_body_bg.style.cursor = 'pointer';
        page_body_bg.style.backgroundColor = Page.body.style.backgroundColor;

        appendChild(page_options, page_body_bg);
        appendChild(page_options, textNode(' - page body background'));

        clearingDiv(page_options, 1);

        // page margins
        var page_margins = createElement('div');

        page_margins.innerHTML = '<b>Margins:</b>';
        clearingDiv(page_margins, 1);

        var margins = ['left', 'right', 'top', 'bottom'];

        for (var i = 0; i < margins.length; i++)
        {
            var margin = getElement('tree_page_margins_sample').cloneNode(true);
            margin.id = 'tree_page_margin_' + margins[i];
            margin.style.marginRight = '3px';
            margin.getElementsByTagName('SPAN')[0].innerHTML = margins[i] + ':';
            margin.getElementsByTagName('INPUT')[0].value   = Page.getAttribute('cmmargin' + margins[i]);
            margin.getElementsByTagName('INPUT')[0].onkeyup = treeUpdatePageMargin;
            margin.getElementsByTagName('INPUT')[0].PageObject = Page;
            appendChild(page_margins, margin);

//            var IBox = new IncrementingBox;
//            IBox.replace('cmmargin' + margins[i]);
        }

        clearingDiv(page_margins);

        appendChild(page_options, page_margins);

        appendChild(options, page_options);

        if (Page.blocks.length == 0)
        {
            continue;
        }

        clearingDiv(options);

        // plus / minus switch for page's blocks
        var switch_opt = getElement('page_chld_switch_sample').cloneNode(false);
        switch_opt.onclick = treeShowPageBlocks;
        switch_opt.id = 'switch_chl_' + (p + 1);

        appendChild(options, switch_opt);
        appendChild(options, textNode(' Blocks'));

        // container for page's blocks
        var page_blocks = getElement('page_children_sample').cloneNode(false);
        page_blocks.id = 'page_blocks_' + (p + 1);

        page_blocks.style.display = 'block';    // debug;

        appendChild(options, page_blocks);

        var block_groups = new Array();

        for (var i = 0; i < Project.BlockManager.groups.length; i++)
        {
            block_groups.push(Project.BlockManager.groups[i].name);
        }

        for (var b = 0; b < Page.blocks.length; b++)
        {
            var Block = Page.blocks[b];

            var tree_block_container = createElement('div');
            tree_block_container.id = 'tree_block_container_' + Block.id;
            appendChild(page_blocks, tree_block_container);

            // plus / minus switch for page's blocks
            var switch_opt = getElement('page_chld_switch_sample').cloneNode(false);
            switch_opt.onclick = treeShowBlockOptions;
            switch_opt.id = 'switch_block_' + (Block.id);

            appendChild(tree_block_container, switch_opt);

            // element with block's name
            var name_div = createElement('div');
            name_div.className = 'tree_block_name';
            name_div.id = 'tree_block_name_' + Block.id;
            name_div.ondblclick = switchBlockNameInput;
            name_div.setAttribute('xName', Block.getName());
            name_div.setAttribute('xBlockId', Block.id);
            name_div.title = Lang['tree_block_name_hint'];
            name_div.BlockObject = Block;

            appendChild(name_div, textNode(Block.getName() + ' (' + Block.getGroupName() + ')'));
            appendChild(tree_block_container, name_div);

            // container for block's options
            var block_options = createElement('div');
            block_options.className = 'tree_sub_options';
            block_options.id = 'tree_block_opt_' + (Block.id);

//            block_options.style.display = 'block';    // debug

            appendChild(tree_block_container, block_options);

            var group = createElement('span');

            var Combo = new ComboBox(block_groups);

            Combo.container_class_name  = 'tree_combo_container';
            Combo.input_class_name      = 'tree_combo_input';
            Combo.switch_class_name     = 'tree_combo_switch';
            Combo.option_class_name     = 'tree_combo_option';
            Combo.options_class_name    = 'tree_combo_options';

            group.appendChild(textNode('Move to group: '));
            group.appendChild(Combo.getDOM());

            var move = createElement('input');
            move.type = 'button';
            move.value = 'move';
            move.setAttribute('xBlockId', Block.id);
            move.setAttribute('xInputId', Combo.input_id);
            move.onclick = moveBlock;
            move.BlockObject = Block;

            appendChild(group, move);
            appendChild(block_options, group);

            clearingDiv(block_options);

            // delete button

            var del_button = createElement('input');
            del_button.type = 'button'
            del_button.value = 'Delete';
            del_button.setAttribute('xBlockId', Block.id);
            del_button.onclick = function (e)
            {
                if (confirm('Are you sure to delete this block?'))
                {
                    e = getEvent(e);

                    var Block = getElement(e.srcElement.getAttribute('xBlockId')).BlockObject;
                    Block._delete();
                }
            }

            appendChild(block_options, del_button);

            clearingDiv(block_options);

            var block_popup = createElement('div');
            block_popup.className = 'a';
            block_popup.BlockObject = Block;
            block_popup.onclick = treeShowBlockOptionsPopup;

            appendChild(block_popup, textNode(Lang['js_show_block_options']));
            appendChild(block_options, block_popup);

            var coord_popup = createElement('div');
            coord_popup.className = 'a';
            coord_popup.BlockObject = Block;
            coord_popup.onclick = showBlockCoordinatesPopup;

            appendChild(coord_popup, textNode(Lang['js_show_block_coords']));
            appendChild(block_options, coord_popup);
        }
    }

    PopupManager.createFromDOM(div);
    PopupManager.last.open();
//    onclickCallBack = treeOnclickHandler;
}


/**
* This function is executed on every mouse click while Tree window is opened.
* It checkes whether user clicked ON tree window (or window buttons, or hint
* window) or OUT of it. If user clicked out of it, tree window is closed.
*/
//function treeOnclickHandler()
//{
//    if (getElement('tree').style.display == 'none')
//    {
//        return false;
//    }
//
//    var click_in = false;
//
//    // __EVENT is a pointer to current event, set in mouseDown() function
//    // in events.js
//
//    var ids = [
//        'tree',
//        'window_buttons',
//        'hint',
//        'image_tools',
//        'text_tools',
//        'dhtmlgoodies_colorPicker',
//        'coordinates',
//        'combo_options_'
//    ];
//
//    if (!strstr(__EVENT.srcElement.id, ids))
//    {
//        var curr = __EVENT.srcElement;
//
//        while (curr.parentNode)
//        {
//            if (strstr(curr.parentNode.id, ids))
//            {
//                click_in = true;
//                break;
//            }
//            else
//            {
//                curr = curr.parentNode;
//            }
//        }
//    }
//    else
//    {
//        click_in = true;
//    }
//
//    if (!click_in)
//    {
//        getElement('tree').close();
//        removeWindowButtons();
//        getElement('coordinates').style.display = 'none';
//    }
//}

function treeSwitch(_event, container)
{
    container.style.display = container.style.display == 'block' ? 'none' : 'block';
    _event.srcElement.src = BASE_URL + '/model/images/' + (container.style.display == 'block' ? 'minus.gif' : 'plus.gif');
    getElement('tree').popupObject.positionButtons();
}

function treeShowNode(e)
{
    e = getEvent(e);

    var options = getElement('tree_options_' + e.srcElement.id.replace('switch_', ''));

    treeSwitch(e, options);
}

function treeShowPageOptions(e)
{
    e = getEvent(e);

    var options = getElement('page_options_' + e.srcElement.id.replace('switch_opt_', ''));

    treeSwitch(e, options);
}

function treeShowPageBlocks(e)
{
    e = getEvent(e);

    var options = getElement('page_blocks_' + e.srcElement.id.replace('switch_chl_', ''));

    treeSwitch(e, options);
}

function treeShowBlockOptions(e)
{
    e = getEvent(e);

    var options = getElement('tree_block_opt_' + e.srcElement.id.replace('switch_block_', ''));

    treeSwitch(e, options);
}

function switchBlockNameInput(e)
{
    e = getEvent(e);

    // e.which == 13 is 'Enter' button

    if (e.which > 2 && e.which != 13 && e.srcElement.tagName == 'INPUT')
    {
        return false;
    }

    if (e.which == 13 && e.srcElement.tagName == 'INPUT' && isIE)
    {
        return false;
    }

    if (e.srcElement.tagName == 'INPUT')
    {
        if (e.srcElement.value == '')
        {
            e.srcElement.value = e.srcElement.parentNode.BlockObject.name;
        }

        var name = e.srcElement.value;
        var name_div = e.srcElement.parentNode;

        name_div.BlockObject.setName(name);

        removeNode(e.srcElement);

        appendChild(name_div, textNode(name));
    }
    else
    {
        e.srcElement.innerHTML = '';

        var input           = createElement('input');
        input.type          = 'text';
        input.className     = 'input';
        input.ondblclick    = switchBlockNameInput;
        input.onkeyup       = switchBlockNameInput;
//        input.value         = e.srcElement.getAttribute('xName');
        input.value         = e.srcElement.BlockObject.name;
        input.title         = Lang['tree_block_input_hint'];

        appendChild(e.srcElement, input);
    }
}

function treeShowBlockOptionsPopup(e)
{
    e = getEvent(e);

    var Block = e.srcElement.BlockObject;
    Block.scrollTo();
    Project.selectBlock(Block);

    PopupManager.closeById('tree');

    if (Block.isTextBlock())
    {
        openTextBlockOptions(Block);
    }
    else
    {
        openImageBlockOptions(Block);
    }
}

var previousPageMargins = {
    top     : false,
    right   : false,
    bottom  : false,
    left    : false
};

function treeUpdatePageMargin(e)
{
    e = getEvent(e);

    var input   = e.srcElement;
    var Page    = input.PageObject;
    var type    = input.parentNode.id.replace('tree_page_margin_', '');

    value = input.value.replace(',', '.');

    if (false == previousPageMargins[type])
    {
        previousPageMargins[type] = Page.getAttribute('cmmargin' + type);
    }

    if (parseFloat(input.value) != input.value || (parseFloat(input.value) < 0))
    {
        input.value = previousPageMargins[type];
        return false;
    }

    previousPageMargins[type] = value;

    in1.value = value;

    Page.setAttribute('cmmargin' + type, value);
    Page.updateMargins();


//    updatePageMargins(page.id);
}