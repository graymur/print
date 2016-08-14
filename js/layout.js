function addDeletePageButton(page)
{
    del_button = createElement('img');
    del_button.id = 'del_button';
    del_button.setAttribute('src', 'del.gif');
    del_button.setAttribute('xPageId', page.id);
    del_button.onclick = function (e)
    {
        if (confirm('Are you sure to delete this page?'))
        {
            Project.deletePage(__EVENT.srcElement.getAttribute('xPageId'));
        }
    };
    del_button.style.position   = 'absolute';
    del_button.style.left       = (page.page.offsetLeft + page.page.offsetWidth - 27) + 'px';
    del_button.style.top        = (page.page.offsetTop + 5) + 'px';
    del_button.style.cursor     = 'pointer';
    del_button.style.zIndex     = '10000';

    appendChild(document.body, del_button);
}

function removeDeletePageButton()
{
    del_button = getElement('del_button');

    if (del_button.parentNode)
    {
        removeNode(del_button);
    }
}

function addRulers(page)
{
    object = page.page;
    var cm = Math.round(px_multiplier * Project.ratio);
    var page_pos = findPos(object);

    //
    // horisontal ruler
    //

    var hor = getElement('horisontal_ruler');

    hor.style.display = 'block';

    var w_corr = 0, h_corr = 0;

    if (isIE)
    {
        w_corr = 2;
        h_corr = 4;
    }

    hor.style.width  = (object.offsetWidth - 2 + w_corr) + 'px';
    hor.style.height = (ruler_dimension + h_corr) + 'px';
    hor.style.zIndex = ++maxZIndex;

    hor.innerHTML = '';

    var hor_left = page_pos[0];
    var hor_top = (page_pos[1] - _parseInt(hor.style.height) - 2);

    if (isIE) hor_top += 2;

    hor.style.left = hor_left + 'px';
    hor.style.top  = hor_top + 'px';

    var left = 0;
    var i = 0;

    while (left < _parseInt(hor.style.width))
    {
        if (left > 0)
        {
            var hairline = createElement('div');
            hairline.className      = 'ruler_hairline';
            hairline.style.width    = '1px';
            hairline.style.height   = '10px';
            hairline.style.left     = (left) + 'px';
            hairline.style.top      = (ruler_dimension - 9) + 'px';

            appendChild(hor, hairline);

            var number = createElement('div');
            number.className = 'ruler_number';
            appendChild(number, textNode(i));

            appendChild(hor, number);

            number.style.left     = (left - number.offsetWidth / 2) + 'px';
            number.style.top      = '1px';
        }

        var hairline = createElement('div');
        hairline.className      = 'ruler_hairline';
        hairline.style.width    = '1px';
        hairline.style.height   = '5px';
        hairline.style.left     = (left + Math.round(cm / 2)) + 'px';
        hairline.style.top      = (ruler_dimension - 4) + 'px';

        appendChild(hor, hairline);

        left += (cm - 1);
        i++;
    }

    //
    // vertical ruler
    //

    var ver = getElement('vertical_ruler');

    ver.style.display = 'block';

    var w_corr = 0, h_corr = 0;

    if (isIE)
    {
        w_corr = 2;
        h_corr = 2;
    }
    else
    {
        h_corr = 1;
    }

    ver.style.height = (object.offsetHeight - 2 + h_corr) + 'px';
    ver.style.width  = (ruler_dimension + w_corr) + 'px';
    ver.style.zIndex = ++maxZIndex;

    ver.innerHTML = '';

    var ver_left = page_pos[0] + object.offsetWidth;
    var ver_top = (page_pos[1]);

    if (!isIE) ver_top--;

    ver.style.left = ver_left + 'px';
    ver.style.top  = ver_top + 'px';

    var top = 0;
    var i = 0;

    while (top < _parseInt(ver.style.height))
    {
        if (top > 0)
        {
            var hairline = createElement('div');
            hairline.className      = 'ruler_hairline vert_text';
            hairline.style.width    = '10px';
            hairline.style.height   = '1px';
            hairline.style.top      = (top) + 'px';
            hairline.style.left     = '0';

            appendChild(ver, hairline);

            var number = createElement('div');
            number.className = 'ruler_number';

            appendChild(number, textNode(i));

            appendChild(ver, number);

            number.style.top  = (top - number.offsetHeight / 2) + 'px';
            number.style.left = '12px';
        }

        var hairline = createElement('div');
        hairline.className      = 'ruler_hairline vert_text';
        hairline.style.width    = '5px';
        hairline.style.height   = '1px';
        hairline.style.top      = (top + Math.round(cm / 2)) + 'px';
        hairline.style.left     = '0';

        appendChild(ver, hairline);

        top += (cm - 1);

        i++;
    }

}

function removeRulers()
{
    var ids = ['horisontal_ruler', 'vertical_ruler'];

    for (var i = 0; i < ids.length; i++)
    {
        getElement(ids[i]).style.display = 'none';
    }
}

/**
* this function displays chosen image's thumbnail
* in 'Background' menu
*/
function prepareBGImage(file)
{
    PopupManager.closeById('ch_image');
    getElement('chosen_image').innerHTML = '';

    var img = createElement('img');
    img.src = getBGImageSource(file, 10);
    img.setAttribute('file', file);
    appendChild(getElement('chosen_image'), img);
}

/**
* adds small rectangel to the border of selected
* block, which are used for resizing
*/
function addResizeRectangles(dObj)
{
    rmResizeRectangles();

    rObj = dObj;

    resize_rectangles = new Array();

    var dirs = ['nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize','w-resize'];

    for (var i = 0; i < dirs.length; i++)
    {
        var rectangle = createElement('div');
        rectangle.id = dirs[i];
        resize_rectangles.push(rectangle);
    }

    for (i = 0; i < resize_rectangles.length; i++)
    {
        resize_rectangles[i].className = 'resize_rect';
        resize_rectangles[i].style.cursor = resize_rectangles[i].id;

        resize_rectangles[i].onmousedown = function()
        {
            var obj = this;
            rrOnmouseDown(obj);
        }

        appendChild(document.body, resize_rectangles[i]);
    }

    positionResizeRectangles(dObj);
}

/**
* positions resize rectangles properly on the block
*/
function positionResizeRectangles(obj)
{
    if (!obj && !Project.selected_block)
    {
        return false;
    }

    var block = (obj) ? obj : Project.selected_block.element;

    var pos = findPos(block);

    var corr_1 = (isIE) ? 2 : 3;
    var corr_2 = (isIE) ? 2 : 4;

    getElement('nw-resize').style.left = (pos[0] - corr_1) + 'px';
    getElement('nw-resize').style.top  = (pos[1] - corr_1) + 'px';

    getElement('n-resize').style.left = Math.round(pos[0] + block.offsetWidth/2 - corr_1) + 'px';
    getElement('n-resize').style.top  = (pos[1] - corr_1) + 'px';

    getElement('ne-resize').style.left = (pos[0] + block.offsetWidth - corr_2) + 'px';
    getElement('ne-resize').style.top  = (pos[1] - corr_1) + 'px';

    getElement('e-resize').style.left = (pos[0] + block.offsetWidth - corr_2) + 'px';
    getElement('e-resize').style.top  = Math.round(pos[1] + block.offsetHeight/2 - corr_2) + 'px';

    getElement('se-resize').style.left = (pos[0] + block.offsetWidth - corr_2) + 'px';
    getElement('se-resize').style.top  = (pos[1] + block.offsetHeight - corr_2) + 'px';

    getElement('s-resize').style.left = Math.round(pos[0] + block.offsetWidth/2 - corr_1) + 'px';
    getElement('s-resize').style.top  = (pos[1] + block.offsetHeight - corr_2) + 'px';

    getElement('sw-resize').style.left = (pos[0] - corr_1) + 'px';
    getElement('sw-resize').style.top  = (pos[1] + block.offsetHeight - corr_2) + 'px';

    getElement('w-resize').style.left = (pos[0] - corr_1) + 'px';
    getElement('w-resize').style.top  = Math.round(pos[1] + block.offsetHeight/2 - corr_1) + 'px';

    for (var i = 0; i < resize_rectangles.length; i++)
    {
        resize_rectangles[i].style.zIndex = (++maxZIndex);
    }
}

/**
* removes resize rectangles when block is deselected
*/
function rmResizeRectangles()
{
    rObj = false;

    if (resize_rectangles)
    {
        for (i = 0; i < resize_rectangles.length; i++)
        {
            resize_rectangles[i].parentNode.removeChild(resize_rectangles[i]);
        }

        resize_rectangles = false;
    }
}

function createResizeLayer(block, resize_rectangle)
{
    var pos = findPos(block);

    var corr = !(isMoz) ? 0 : 2;

    initEventX = _parseInt(resize_rectangle.style.left) + _parseInt(resize_rectangle.style.width) / 2;
    initEventY = _parseInt(resize_rectangle.style.top) + _parseInt(resize_rectangle.style.height) / 2;

    var rl = document.createElement('div');
    rl.id               = 'resize_layer';
    rl.className        = 'resize_layer';
    rl.style.width      = (block.offsetWidth - corr) + 'px';
    rl.style.height     = (block.offsetHeight - corr) + 'px';
    rl.style.position   = 'absolute';
    rl.style.left       = pos[0] + 'px';
    rl.style.top        = pos[1] + 'px';
    rl.style.border     = '1px dashed';
    rl.style.zIndex     = '10000';
    rl['initWidth']     = _parseInt(rl.style.width);
    rl['initHeight']    = _parseInt(rl.style.height);
    rl['initX']         = _parseInt(rl.style.left);
    rl['initY']         = _parseInt(rl.style.top);
    rl['tmpX']          = rl['initX'] - initEventX;
    rl['tmpY']          = rl['initY'] - initEventY;

    appendChild(document.body, rl);
}

function dropResizeLayer()
{
    removeNode(getElement('resize_layer'));
}

function positionSidebar()
{
    var sb = getElement('sidebar');
    sb.style.left = '0';

    var scrollY = window.pageYOffset || document.body.scrollTop;

    if (sb.offsetHeight < scrollY)
    {
        sb.style.top = scrollY + 'px';
    }
    else
    {
        sb.style.top = getElement('toolbar').offsetHeight + 'px';
    }

    InfoBar.position();
}

var visible_sb_opt = false;

function showSidebarOpt(id)
{
    if (!(div = getElement(id))) return false;

    if (div == visible_sb_opt)
    {
        hideSBOptionsDivs();
        return false;
    }

    hideSBOptionsDivs();
    visible_sb_opt = div;
    visible_sb_opt.style.display = 'block';

    switch (id)
    {
        case 'sb_blocks':   blocksList();   break;
    }

    InfoBar.position();
}

function hideSBOptionsDivs()
{
    if (visible_sb_opt)
    {
        visible_sb_opt.style.display = 'none';
        visible_sb_opt = false;
    }

    InfoBar.position();
}

var InfoBar = {

    bar        : false,
    margins    : false,
    block_size : false,
    block_pos  : false,

    getElements : function ()
    {
        this.bar        = getElement('selected_info');
        this.margins    = getElement('selected_margins_info');
        this.block_size = getElement('selected_block_size');
        this.block_pos  = getElement('selected_block_pos');
    },

    show : function ()
    {
        if (!Project.selected) return false;

        if (!this.bar) this.getElements();

        this.bar.style.display          = 'block';
        this.block_size.style.display   = 'none';
        this.block_pos.style.display    = 'none';

        this.position();

        this.updateMarginsValues();
    },

    hide : function ()
    {
        getElement('selected_info').style.display = 'none';
    },

    position : function ()
    {
        if (!this.bar || this.bar.style.display == 'none')
        {
            return false;
        }

        var sidebar = getElement('sidebar');

        this.bar.style.top = _parseInt(sidebar.style.top) + sidebar.offsetHeight + 3 + 'px';
    },

    showBlockInfo : function ()
    {
        if (!Project.selected_block) return false;

        if (!this.block_size) this.getElements();

        this.block_size.style.display = 'block';
        this.block_pos.style.display  = 'block';

        this.updateBlockInfo();
    },

    updateMarginsValues : function ()
    {
        if (!Project || !Project.selected) return false;

        getElement('margin_info_top').innerHTML     = Project.selected.getAttribute('cmmargintop');
        getElement('margin_info_right').innerHTML   = Project.selected.getAttribute('cmmarginright');
        getElement('margin_info_bottom').innerHTML  = Project.selected.getAttribute('cmmarginbottom');
        getElement('margin_info_left').innerHTML    = Project.selected.getAttribute('cmmarginleft');
    },

    updateBlockInfo : function ()
    {
        if (!Project.selected_block)
        {
            return false;
        }

        var Block = Project.selected_block;

        getElement('block_size_info_width').innerHTML  = Block.getWidth('cm');
        getElement('block_size_info_height').innerHTML = Block.getHeight('cm');
        getElement('block_size_info_left').innerHTML   = Block.getLeft('cm');
        getElement('block_size_info_top').innerHTML    = Block.getTop('cm');
    },

    strictUpdateBlockInfo : function (left, top, width, height)
    {
        if (!Project.selected_block)
        {
            return false;
        }

        getElement('block_size_info_width').innerHTML  = width;
        getElement('block_size_info_height').innerHTML = height;
        getElement('block_size_info_left').innerHTML   = left;
        getElement('block_size_info_top').innerHTML    = top;
    }
}