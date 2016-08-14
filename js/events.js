var d = document;
var ie = document.all;
var dObj, rObj, tmpX, tmpY, initEventX, initEventY;
var dragList = new Array();
var dObjects, rObjects;
var onclickCallBack = false;
var __EVENT;
var move_in_parent_only = true;
var move_in_parent_only = false;

function mouseDown(e)
{
    e = getEvent(e);

    __EVENT = e;

    // If a function, that should be executed on every mouse click
    // has been set somewhere in the program, it's executed
    if (onclickCallBack)
    {
        eval('onclickCallBack()');
    }

    // This is needed to prevent collisions with onclick functions and
    // input fields, which need to get focus when user clicks on them.
    if (in_array(e.srcElement.tagName, ['TEXTAREA', 'INPUT', 'SELECT']))
    {
        return true;
    }

    initEventX = e.clientX;
    initEventY = e.clientY;

    // If user click on a certain page or any of it's children,
    // this page is selected
    if (e.srcElement.className == pageClassName)
    {
        Project.selectPage(e.srcElement.id);
    }
    else
    {
        var parent, obj = e.srcElement;

        while (parent = obj.parentNode)
        {
            if (parent.className == pageClassName)
            {
                Project.selectPage(parent.id);
                break;
            }
            else
            {
                obj = parent;
            }
        }
    }

    // if user clicks somewhere in empty space,
    // deselect previously selected pages
    if (in_array(e.srcElement.tagName, ['HTML', 'BODY']))
    {
        Project.deselectPage();
    }

    if (
         in_array(e.srcElement.className, ['page', 'page_body']) ||
         e.srcElement.tagName == 'BODY'
       )
    {
        Project.deselectBlock();
    }

    // find draggable element
    dObj = false;

    // If user clicks on one of the rectangles, which are used to
    // resize elements, do nothing
    if (e.srcElement.className == 'resize_rect' || e.srcElement.className == 'blockName')
    {
        return false;
    }
    // Else - find element to select for dragging or resizing
    else
    {
        if (!isDraggable(e.srcElement.className))
        {
            var parent, obj = e.srcElement;

            while (parent = obj.parentNode)
            {
                if (isDraggable(parent.className))
                {
                    dObj = parent;
                    break;
                }
                else
                {
                    obj = parent;
                }
            }
        }
        else
        {
            dObj = e.srcElement;
        }
    }

    // This is used for dragging group of blocks
    if (dObj && dObj.getAttribute('xGroupId'))
    {
        Project.selectBlock(dObj);

        if (!dObjects) return false;

        maxZIndex++;

        for (var i = 0; i < dObjects.length; i++)
        {
            dObjects[i]['tmpX'] = _parseInt(dObjects[i].element.style['left']) - e.clientX;
            dObjects[i]['tmpY'] = _parseInt(dObjects[i].element.style['top']) - e.clientY;

            dObjects[i].element.style.zIndex = maxZIndex;
        }

        for (var i = 0; i < resize_rectangles.length; i++)
        {
            resize_rectangles[i]['tmpX'] = _parseInt(resize_rectangles[i].style['left']) - e.clientX;
            resize_rectangles[i]['tmpY'] = _parseInt(resize_rectangles[i].style['top']) - e.clientY;
        }

        document.onmousemove = mouseMoveDragGroup;
        document.onmouseup   = mouseUpDragGroup;
    }
    // This is used for dragging single element
    else if (dObj)
    {
        if (dObj.getAttribute('drag_type') == 'this' && dObj != e.srcElement)
        {
            return false;
        }

        dObj['tmpX'] = _parseInt(dObj.style['left']) - e.clientX;
        dObj['tmpY'] = _parseInt(dObj.style['top']) - e.clientY;

        if (dObj.popupObject)
        {
            dObj.popupObject.setZIndex();
        }
        else
        {
            dObj.style.zIndex = ++maxZIndex;
        }

        document.onmousemove = mouseMoveDragSingle;
        document.onmouseup   = mouseUpDragSingle;
    }
    // This is user for resizing an element
    else if (rObj)
    {
        if (!rObjects) return false;

        maxZIndex++;

        for (i = 0; i < rObjects.length; i++)
        {
            rObjects[i]['tmpX']       = _parseInt(rObjects[i].element.style['left']) - e.clientX;
            rObjects[i]['tmpY']       = _parseInt(rObjects[i].element.style['top']) - e.clientY;
            rObjects[i]['initWidth']  = _parseInt(rObjects[i].element.offsetWidth);
            rObjects[i]['initHeight'] = _parseInt(rObjects[i].element.offsetHeight);

            rObjects[i].element.style.zIndex = maxZIndex;
        }

        addResizeRectangles(rObj);

        document.onmousemove = mouseMoveResize;
        document.onmouseup   = mouseUpResize;
    }

    return false;
}

function mouseMoveDragSingle(e)
{
    if (!dObj) return false;
    e = getEvent(e);

    dObj.style.left = _parseInt(dObj['tmpX'] + e.clientX) + 'px';
    dObj.style.top  = _parseInt(dObj['tmpY'] + e.clientY) + 'px';

    scrOnMouseDragSingle(e, dObj);

    return false;
}

function mouseMoveDragGroup(e)
{
    if (!dObjects) return false;

    e = getEvent(e);

    for (var i = 0; i < dObjects.length; i++)
    {
        var left = _parseInt(dObjects[i]['tmpX'] + e.clientX);
        var top  = _parseInt(dObjects[i]['tmpY'] + e.clientY);

        if (move_in_parent_only)
        {
            var pos = findPos(dObjects[i].parent);

            var parent_right    = pos[0] + dObjects[i].parent.offsetWidth;
            var parent_bottom   = pos[1] + dObjects[i].parent.offsetHeight;
            var dObj_right      = left + dObjects[i].element.offsetWidth;
            var dObj_bottom     = top + dObjects[i].element.offsetHeight;

            if (left - pos[0] > 0 && parent_right - dObj_right > 0)
            {
                dObjects[i].element.style.left = left + 'px';
            }

            if (top - pos[1] > 0 && parent_bottom - dObj_bottom > 0)
            {
                dObjects[i].element.style.top  = top + 'px';
            }
        }
        else
        {
            dObjects[i].element.style.left = left + 'px';
            dObjects[i].element.style.top  = top + 'px';
        }
    }

    positionResizeRectangles();
    positionBlockDeleteButton(Project.selected_block.id + '_delete_button');

    InfoBar.updateBlockInfo();

    return false;
}

function mouseMoveResize(e)
{
    var rl = getElement('resize_layer');
    if (!rObjects || !rl) return false;

    e = getEvent(e);

    var initBY = rl['initHeight'] + rl['initY'];
    var initBX = rl['initWidth'] + rl['initX'];

    var width = -1, height = -1, top = -1, left = -1;

    switch (resize_type)
    {
        case 'se-resize':
            width  = rl['initWidth'] + e.clientX - initEventX;
            height = rl['initHeight'] + e.clientY - initEventY;
        break;

        case 's-resize':
            height = rl['initHeight'] + e.clientY - initEventY;
        break;

        case 'e-resize':
            width = rl['initWidth'] + e.clientX - initEventX;
        break;

        case 'ne-resize':
            top    = _parseInt(rl['tmpY'] + e.clientY);
            width  = rl['initWidth'] + e.clientX - initEventX;
            height = rl['initHeight'] + rl['initY'] - _parseInt(rl.style.top);
        break;

        case 'n-resize':
            top    = _parseInt(rl['tmpY'] + e.clientY);
            height = initBY - _parseInt(rl.style.top);
        break;

        case 'nw-resize':
            top    = _parseInt(rl['tmpY'] + e.clientY);
            left   = _parseInt(rl['tmpX'] + e.clientX);
            height = initBY - _parseInt(rl.style.top);
            width  = initBX - _parseInt(rl.style.left);
        break;

        case 'w-resize':
            left   = _parseInt(rl['tmpX'] + e.clientX);
            width  = initBX - _parseInt(rl.style.left);
        break;

        case 'sw-resize':
            left   = _parseInt(rl['tmpX'] + e.clientX);
            height = rl['initHeight'] + e.clientY - initEventY;
            width  = initBX - _parseInt(rl.style.left);
        break;
    }

    var parent = Project.selected.body;
    var parent_pos = findPos(parent);

    var Xcorr = isIE ? 0 : 2;
    var Ycorr = isIE ? 0 : 2;

    if (top > 0)
    {
        top += (window.pageYOffset || document.body.scrollTop);
    }

    if (left > -1)
    {
        if (left > initBX - min_block_width) left = initBX - min_block_width;

        if (!move_in_parent_only || (parent_pos[0] < e.clientX + 4))
        {
            rl.style.left  = left + 'px';
        }
    }

    if (top > -1)
    {
        if (top > initBY - min_block_height) top = initBY - min_block_height;

        if (!move_in_parent_only || (parent_pos[1] < e.clientY + 4))
        {
            rl.style.top = top + 'px';
        }
    }

    if (width > -1)
    {
        if (width < min_block_width) width = min_block_width;

        if (!move_in_parent_only || (e.clientX < parent_pos[0] + parent.offsetWidth))
        {
            rl.style.width  = width + 'px';
        }
    }

    if (height > -1)
    {
        if (height < min_block_height) height = min_block_height;

        if (!move_in_parent_only || (e.clientY < parent_pos[1] + parent.offsetHeight))
        {
            rl.style.height  = height + 'px';
        }
    }

    positionResizeRectangles(rl);

    InfoBar.strictUpdateBlockInfo
    (
        px2cm(_parseInt(rl.style.left) - parent_pos[0]),
        px2cm(_parseInt(rl.style.top) - parent_pos[1]),
        px2cm(_parseInt(rl.style.width)),
        px2cm(_parseInt(rl.style.height))
    );

    return false;
}

function mouseUpDragGroup(e)
{
    if (!dObjects) return false;

    for (var i = 0; i < dObjects.length; i++)
    {
        dObjects[i].updatePosition();
    }

    positionResizeRectangles();

    document.onmousemove = null;
    document.onmouseup = null;
    dObj = false;
    dObjects = false;
    return false;
}

function mouseUpDragSingle(e)
{
    if (!dObj) return false;

    document.onmousemove = null;
    document.onmouseup = null;
    dObj = false;
    return false;
}

function mouseUpResize(e)
{
    rl = getElement('resize_layer');

    if (!rObjects || !rl) return false;

    left_change = _parseInt(rl.style.left) - rl['initX'];
    top_change  = _parseInt(rl.style.top) - rl['initY'];

    for (var i = 0; i < rObjects.length; i++)
    {
        rObjects[i].element.style.width  = rl.style.width;
        rObjects[i].element.style.height = rl.style.height;

        rObjects[i].element.style.left   = (_parseInt(rObjects[i].element.style.left) + left_change) + 'px';
        rObjects[i].element.style.top    = (_parseInt(rObjects[i].element.style.top) + top_change) + 'px';

        rObjects[i].updatePosition();
    }

    positionBlockDeleteButton(Project.selected_block.id + '_delete_button');
    positionResizeRectangles();

    InfoBar.updateBlockInfo();

    dropResizeLayer();

    document.onmousemove = null;
    document.onmouseup = null;

    rObjects = false;

    return false;
}

function winOnScroll()
{
    positionSidebar();
}

function winOnResize()
{
    Project.repositionBlocks();
}

document.onmousedown    = mouseDown;
window.onscroll         = winOnScroll;
window.onresize         = winOnResize;