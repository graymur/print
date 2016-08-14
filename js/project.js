function ProjectClass (format, pages, direction)
{
    this.pages = new Array();
    this.ratio;
    this.direction;
    this.format;
    this.direction = 'vertical';
    this.container = getElement('work_space');
    this.ratio;
    this.selected = false;
    this.selected_block = false;
    this.options = {};
    this.BlockManager = new BlockManagerClass;
    this.old_ratio;
    this.numbering_pos_horisontal;
    this.numbering_pos_vertical;
    this.numbering = false;
    this.numbering_size = '50';
    this.numbering_font;
    this.text_elements = new Array();

    this._delete = function ()
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i]._delete();
        }
    };

    this.createPages = function (num)
    {
        for (var i = 0; i < num; i++)
        {
            this.createPage();
        }
    };

    this.setOptions = function (element_id)
    {
        var container = document.getElementById(element_id);

        var selects = container.getElementsByTagName('select');

        for (i = 0; i < selects.length; i++)
        {
            this.options[selects[i].name] = selects[i].options[selects[i].selectedIndex].value;
        }

        var inputs = container.getElementsByTagName('input');

        for (i = 0; i < inputs.length; i++)
        {
            if (inputs[i].type == 'radio')
            {
                if (inputs[i].checked == true) this.options[inputs[i].name] = inputs[i].value;
            }
            else
            {
                this.options[inputs[i].name] = inputs[i].value;
            }
        }

        this.BlockManager.options = this.options;
    };

    this.createPage = function ()
    {
        var Page = new PageClass();
        Page.setDirection(this.direction);
        Page.setId(this.getNextId());
        Page.setFormat(this.format);
        Page.ratio = this.ratio;
        Page.create();
        Page.setMargins();

        this.pages.push(Page);

        getElement('pages_num').value = this.pages.length;

        onCreatePage(Page);
    };

    this.setRatio = function (ratio)
    {
        this.old_ratio = this.ratio * 100;

        if (ratio) this.ratio = ratio / 100;
        setSelectedOption('ratio', this.ratio * 100);

        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].setRatio(this.ratio);
        }

        //this.updateFontSize();

        onChangeRatio();
    };

    this.pagesNumber = function (num)
    {
        if (num == '' || _parseInt(num) != num)
        {
            return false;
        }

        if (this.pages.length < num)
        {
            var pages_num = this.pages.length;
            var new_pages = num - pages_num;

            var Last = this.selected ? this.selected : this.pages[this.pages.length - 1];

            for (var i = 0; i < new_pages; i++)
            {
                var DOMElement = Last.page.cloneNode(true);

                var Page = new PageClass();
                Page.setId(this.getNextId());
                Page.ratio  = this.ratio;
                Page.format = this.format;
                Page.set(DOMElement);

                this.pages.push(Page);
            }
        }
        else if (this.pages.length > num)
        {
            var remove = this.pages.length - num;

            for (var i = 0; i < remove; i++)
            {
                this.pages[this.pages.length - 1]._delete();
                this.pages.pop();
            }
        }

        getElement('pages_num').value = this.pages.length;
    };

    this.deletePage = function (page_id)
    {
        var page = this.getPageById(page_id);

        if (this.selected == page)
        {
            this.deselectPage();
        }

        var _pages = new Array();

        for (i = 0; i < this.pages.length; i++)
        {
            if (this.pages[i] != page)
            {
                this.pages[i].setId('page_' + (_pages.length + 1));
                _pages.push(this.pages[i]);
            }
        }

        this.pages = _pages;

        page._delete();

        this.repositionBlocks();

        scrOnPageDelete();
    };

    this.setFormat = function (format)
    {
        this.format = format;

        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].setFormat(this.format);
        }

        onChangeFromat();
    };

    this.setPagesDirection = function (direction)
    {
        if (!direction || direction == this.direction) return false;

        this.direction = (direction == 'horisontal') ? 'horisontal' : 'vertical';

        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].setDirection(this.direction);
        }

        onChangeDirection();
    };

    this.setMargins = function (top, right, bottom, left)
    {
        this.setOptions('opt_margins');

        if (typeof top != 'undefined')      getElement('margin_top').value = top;
        if (typeof right != 'undefined')    getElement('margin_right').value = right;
        if (typeof bottom != 'undefined')   getElement('margin_bottom').value = bottom;
        if (typeof left != 'undefined')     getElement('margin_left').value = left;

        switch (this.options['margins'] || 'all_pages')
        {
            case 'current':
                if (this.selected)
                {
                    this.selected.setMargins
                    (
                        getElement('margin_top').value,
                        getElement('margin_right').value,
                        getElement('margin_bottom').value,
                        getElement('margin_left').value
                    );
                }
            break;

            case 'all_but_current':
                for (var i = 0; i < this.pages.length; i++)
                {
                    if (this.selected && this.selected.id == this.pages[i].id)
                    {
                        continue;
                    }

                    this.pages[i].setMargins
                    (
                        getElement('margin_top').value,
                        getElement('margin_right').value,
                        getElement('margin_bottom').value,
                        getElement('margin_left').value
                    );
                }
            break;

            default:
                for (var i = 0; i < this.pages.length; i++)
                {
                    this.pages[i].setMargins
                    (
                        getElement('margin_top').value,
                        getElement('margin_right').value,
                        getElement('margin_bottom').value,
                        getElement('margin_left').value
                    );
                }
            break;
        }

        onChangeMargins();
    };

    this.updateMargins = function ()
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].updateMargins();
        }
    };

    this.dump = function ()
    {
        this.setRatio(100);

        in1.value = this.old_ratio;

        var dump = '';

        for (var i = 0; i < this.pages.length; i++)
        {
            dump += this.pages[i].dump();
        }

        this.setRatio(this.old_ratio);

        return dump;
    }

    this.selectPage = function (page_id)
    {
        this.deselectPage();

        this.selected = this.getPageById(page_id);
        this.selected.page.style.border = '1px solid red';

        onPageSelect();
    };

    this.deselectPage = function ()
    {
        if (this.selected)
        {
            var Page = this.selected;

            this.selected.page.style.borderColor = default_border;
            this.selected = false;

            onPageDeselect(Page);
        }
    };

    this.getPageById = function (id)
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            if (this.pages[i].id == id)
            {
                return this.pages[i];
                break;
            }
        }

        return false;
    };

    this.getNextId = function ()
    {
        return 'page_' + (this.pages.length + 1);
    };

    this.setPageBackground = function ()
    {
        this.setOptions('page_bg');

        var image = false;

        if (getElement('chosen_image').childNodes.length > 0)
        {
            image = getElement('chosen_image').childNodes[0].getAttribute('file');
        }

        var bgColor = getElement('color_value').value || '#FFFFFF';

        switch (this.options['bg_pages'] || 'all_pages')
        {
            case 'current':

                if (this.selected)
                {
                    if (image)  this.selected.setBGImage(image, this.options['bg_mode']);
                    else        this.selected.setBGColor(bgColor, this.options['bg_mode']);
                }

            break;

            case 'all_but_current':

                for (var i = 0; i < this.pages.length; i++)
                {
                    if (this.selected && this.selected.id == this.pages[i].id)
                    {
                        continue;
                    }

                    if (image)  this.pages[i].setBGImage(image, this.options['bg_mode']);
                    else        this.pages[i].setBGColor(bgColor, this.options['bg_mode']);
                }

            break;

            default:

                for (var i = 0; i < this.pages.length; i++)
                {
                    if (image)  this.pages[i].setBGImage(image, this.options['bg_mode']);
                    else        this.pages[i].setBGColor(bgColor, this.options['bg_mode']);
                }

            break;
        }
    };

    this.removeBGImage = function ()
    {
        switch (this.options['bg_pages'] || 'all_pages')
        {
            case 'current':

                if (this.selected)
                {
                    this.selected.removeBGImage();
                }

            break;

            case 'all_but_current':

                for (var i = 0; i < this.pages.length; i++)
                {
                    if (this.selected && this.selected.id == this.pages[i].id)
                    {
                        continue;
                    }

                    this.pages[i].removeBGImage();
                }

            break;

            default:

                for (var i = 0; i < this.pages.length; i++)
                {
                    this.pages[i].removeBGImage();
                }

            break;
        }
    };

    this.insertBlock = function ()
    {
        this.setOptions('opt_block');

        var options = new BlockOptionsClass;
        options['type']     = this.options['block_type'];
        options['width']    = this.options['block_width'],
        options['height']   = this.options['block_height'],
        options['insert']   = this.options['blocks_insert']

        this.BlockManager.newBlock(options);
    };

    this.selectBlock = function (element)
    {
        this.deselectBlock();

        if (element.BlockObject)
        {
            this.selected_block = element.BlockObject;
        }
        else if (element.group_id)
        {
            this.selected_block = element;
        }

        onBlockSelect(this.selected_block);
    };

    this.deselectBlock = function ()
    {
        onBlockDeselect(this.selected_block);
        this.selected_block = false;
    };

    this.repositionBlocks = function ()
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].repositionBlocks();
            this.pages[i].updateNumberPosition();
        }
    };

    this.updateBlocks = function ()
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].updateBlocks(false);
        }
    };

    this.setNumbering = function ()
    {
        this.removeNumbering();

        this.setOptions('opt_page_numbering');

        this.numbering = true;

        var page_num = this.options['pn_start'] > 1 ? this.options['pn_start'] : 1;
        var page_start = this.options['pn_page_start'] > 1 ? this.options['pn_page_start'] : 1;

        this.numbering_font = this.options['pn_font'];

        if (this.options['pn_font_size'])
        {
            this.numbering_size = this.options['pn_font_size'];
        }

        for (var i = 0; i < this.pages.length; i++)
        {
            if ((i + 1) >= page_start)
            {
                var num = page_num;
                page_num++;
            }
            else
            {
                num = 0;
            }

            this.pages[i].setNumbering
            (
                num,
                this.options['pn_horisontal_align'],
                this.options['pn_vertical_align']
            );
        }
    };

    this.removeNumbering = function ()
    {
        this.numbering = false;

        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].removeNumber();
        }
    };

    this.updateNumberPosition = function ()
    {
        for (var i = 0; i < this.pages.length; i++)
        {
            this.pages[i].updateNumberPosition();
        }
    };

    this.addElementWithText = function (element)
    {
        this.text_elements.push(element);
    };

    this.create = function (format, pages, direction)
    {
        this.format     = format;
        pages           = (parseInt(pages) > 0) ? parseInt(pages) : 1;
        this.direction  = (direction == 'horisontal') ? 'horisontal' : 'vertical';

        setSelectedOption('page_direction', this.direction);
        setSelectedOption('format', this.format);

        this.createPages(pages);
        this.setPagesDirection(direction);
    };

    if (!empty(format))
    {
        this.create(format, pages, direction);
    };

    this.updateFontSize = function (ratio)
    {
	    for (var i = 0; i < this.text_elements.length; i++)
    	{
        	var el = this.text_elements[i];
//        var defl = _parseInt(el.getAttribute(def_font_size_attr));
//        var unit = el.getAttribute(def_font_size_attr).replace(defl, '');
//        el.style.fontSize = _parseInt(defl * ratio) + unit;
        	el.style.fontSize = fontSize2Ratio(el.getAttribute(def_font_size_attr), ratio);
    	}
    };
}