function onPageSelect()
{
    if (!Project.selected) return false;

    addDeletePageButton(Project.selected);
    addRulers(Project.selected);
    InfoBar.show();
    updateMarginsValues();
};

function onPageDeselect()
{
    removeDeletePageButton();
    removeRulers();
    InfoBar.hide();
    updateMarginsValues();
};

function onChangeRatio()
{
    onPageDeselect();
    onPageSelect();
    Project.updateBlocks();
    positionResizeRectangles();
};

function onChangeDirection()
{
    onPageDeselect();
    onPageSelect();
    positionResizeRectangles();
};

function onChangeFromat()
{
    onPageDeselect();
    onPageSelect();
    positionResizeRectangles();
};

function onChangeMargins()
{
    onPageDeselect();
    onPageSelect();
    positionResizeRectangles();
};

function onChangeMarginsPage(Page)
{
    InfoBar.updateMarginsValues();
};

function onBlockSelect(Block)
{
    if (!dObj)
    {
        dObj = Project.selected_block.element;
        rObj = Project.selected_block.element;
    }

    dObjects = Project.selected_block.getGroup().blocks;
    rObjects = dObjects;

    addResizeRectangles(Project.selected_block.element);
    showBlockDeleteButton(Block);

    var type_prepend = (Block.type == 'image') ? 'i_' : 't_';

    if (Block.element.style.borderWidth || Block.element.style.borderStyle)
    {
        var width = _parseInt(Block.element.style.borderWidth);
        getElement(type_prepend + 'border_size').value = (width > 0) ? width : 1;

        if (isMoz)
        {
            var style = Block.element.style.borderStyle.toString().split(' ');
            setSelectedOption(type_prepend + 'border_style', style[0]);
        }
        else
        {
            setSelectedOption(type_prepend + 'border_style', Block.element.style.borderStyle);
        }
    }
    else
    {
        getElement(type_prepend + 'border_size').value = 1;
        setSelectedOption(type_prepend + 'border_style', 'solid');
    }

    InfoBar.showBlockInfo();
};

function onBlockDeselect(Block)
{
    var tools = getElement('text_tools').popupObject || getElement('image_tools').popupObject;

    if (tools)
    {
        tools.close();
    }

    rmResizeRectangles();
    removeBlockDeleteButton(Block);
};

function onBlockCreate(Block)
{
    reloadTabs();
}

function onBlockDelete(Block)
{
    reloadTabs();
}

// click on resize rectangle
function rrOnmouseDown(obj)
{
    rObjects = rObj.BlockObject.getGroup().blocks;

    createResizeLayer(rObj, obj);
    document.onmousemove = mouseMoveResize;
    document.onmouseup   = mouseUpResize;
    resize_type          = obj.style.cursor;
}

function scrOnMouseDragSingle(e, element)
{
    if (element.popupObject)
    {
        element.popupObject.positionButtons();
    }
    else if (element.className.indexOf('tip') > -1)
    {
        element.style.zIndex = ++PopupManager.tipZIndex;
    }
}

function blockOnDoubleClick(e)
{
    e = getEvent(e);

    var Block = e.srcElement.BlockObject;

    if (Block.isTextBlock())
    {
        openTextBlockOptions(Block, e);
    }
    else
    {
        openImageBlockOptions(Block, e);
    }
}

function scrOnPageDelete()
{
    positionResizeRectangles();
    getElement('pages_num').value = Project.pages.length;
    reloadTabs();
}

function scrOnDeleteBlockGroup()
{
    positionResizeRectangles();

    if (getElement('sb_blocks').style.display == 'block')
    {
        hideSBOptionsDivs();
        showSidebarOpt('sb_blocks');
    }
}

function scrOnMoveBlock()
{
    if (getElement('sb_blocks').style.display == 'block')
    {
        hideSBOptionsDivs();
        showSidebarOpt('sb_blocks');
        positionBlockDeleteButton(selected_block.id + '_delete_button');
    }
}

function changeResizeUnit(select)
{
    var Block = getElement('coordinates').BlockObject;

    var input_id = select.id.replace('_unit', '');
    var dimension = input_id.replace('coord_', '');

    setIncrementingFieldValue(getElement(input_id).IBoxObject, Block.getDimension(dimension, getSelectedValue(select.id)), getSelectedValue(select.id));
}

function setIncrementingFieldValue(IBox, value, unit)
{
    IBox.setValue(value);

    switch (unit)
    {
        case 'cm':
            IBox.increment_value = 0.1;
            IBox.min = 0;
        break;

        case 'mm':
            IBox.increment_value = 1;
            IBox.min = 0;
        break;

        default:
            IBox.increment_value = 1;
            IBox.min = 0;
        break;
    }
}

function updateMarginsValues()
{
    getElement('margin_top').value      = (Project.selected) ? Project.selected.getAttribute('cmmargintop') : '0.5';
    getElement('margin_right').value    = (Project.selected) ? Project.selected.getAttribute('cmmarginright') : '0.5';
    getElement('margin_bottom').value   = (Project.selected) ? Project.selected.getAttribute('cmmarginbottom') : '0.5';
    getElement('margin_left').value     = (Project.selected) ? Project.selected.getAttribute('cmmarginleft') : '1.5';
}

function onPagesNumberClick(number)
{
    if (number <= Project.pages.length)
    {
        Project.pagesNumber(number);
    }
    else
    {
        popupOptionsDiv('pages_number_options');
    }
};

function setPagesNumber()
{
    Project.setOptions('pages_number_options');
    var new_number = getElement('pages_num').value;

    switch(Project.options['pages_number_options'])
    {
        case 'pno_blank_page':
            while (Project.pages.length < new_number)
            {
                Project.createPage();
            }
        break;

        default:
            Project.pagesNumber(new_number);
        break;
    }
};

function onBlockMoveToGroup(Block)
{
    init_tab_blocks();
};

function onBlockMoveToPage(Block)
{
    init_tab_blocks();
};

function onCreatePage(Page)
{
    if (typeof Project == 'undefined') return false;

    reloadTabs();
};