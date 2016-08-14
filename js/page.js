/**
* Class for page objects
*/
function PageClass (direction)
{
    this.blocks = new Array();
    this.format;
    this.id;
    this.page;
    this.body;
    this.number;
    this.direction;
    this.container = getElement('work_space');
    this.ratio;
    this.width;
    this.height;
    this.body_width;
    this.body_height;
    this.numbering_pos_horisontal;
    this.numbering_pos_vertical;

    this.setAttribute = function (attribute, value)
    {
        return this.page.setAttribute(attribute, value);
    };

    this.getAttribute = function (attribute)
    {
        return this.page.getAttribute(attribute);
    };

    this.hasAttribute = function (attribute)
    {
        return !empty(this.page.getAttribute(attribute));
    };

    this.create = function ()
    {
        this.page = createElement('div');
        this.page.object = this;
        this.page.className = 'page';
        this.page.id = this.id;

        this.body = createElement('div');
        this.body.className = 'page_body';

        appendChild(this.page, this.body);
        appendChild(this.container, this.page);

        this.setDirection();
    };

    this.set = function (DOMElement)
    {
        this.page = DOMElement;
        this.body = DOMElement.firstChild;

        var body = DOMElement.firstChild;

        appendChild(this.container, this.page);

        this.page.id        = this.id;
        this.direction      = this.getAttribute('xdirection');
        this.body_width     =  _parseInt(this.body.style.width);
        this.body_height    =  _parseInt(this.body.style.height);
        this.width          = (this.direction == 'vertical') ? Formats[this.format][0] : Formats[this.format][1];
        this.height         = (this.direction == 'vertical') ? Formats[this.format][1] : Formats[this.format][0];

        for (var i = 0; i < this.body.childNodes.length; i++)
        {
            this.blocks.push(Project.BlockManager.DOM2block(this.body.childNodes[i]));
        }
    };

    this._delete = function ()
    {
        for (i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i]._delete();
        }

        removeNode(this.page);
    };

    this.repositionBlocks = function ()
    {
        for (var i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].reposition();
        }
    };

    this.updateBlocks = function (update_percents)
    {
        for (var i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].updateAll();
        }
    };

    this.removeBlock = function (Block)
    {
        var new_blocks = new Array();

        for (var i = 0; i < this.blocks.length; i++)
        {
            if (this.blocks[i].id != Block.id)
            {
                new_blocks.push(this.blocks[i]);
            }
        }

        this.block = new_blocks;

//        removeNode(Block.element);
    }

    this.deleteBlock = function (Block)
    {
        this.removeBlock(Block);
        Block._delete();
//        var new_blocks = new Array();
//
//        for (var i = 0; i < this.blocks.length; i++)
//        {
//            if (this.blocks[i].id == Block.id)
//            {
//                Block._delete();
//            }
//            else
//            {
//                new_blocks.push(this.blocks[i]);
//            }
//        }
//
//        this.block = new_blocks;
    };

    this.setFormat = function (format)
    {
        this.format = format;

        if (this.page)
        {
            this.setDirection();
        }
    };

    this.setMargins = function (top, right, bottom, left)
    {
        if (!top)       top = parseFloat(getElement('margin_top').value);
        if (!right)     right = parseFloat(getElement('margin_right').value);
        if (!bottom)    bottom = parseFloat(getElement('margin_bottom').value);
        if (!left)      left = parseFloat(getElement('margin_left').value);

        this.setAttribute('cmmargintop',    top);
        this.setAttribute('cmmarginright',  right);
        this.setAttribute('cmmarginbottom', bottom);
        this.setAttribute('cmmarginleft',   left);

        this.updateMargins();
    };

    this.updateMargins = function ()
    {
        var margin_top      = _parseInt(parseFloat(this.getAttribute('cmmargintop')) * px_multiplier * this.ratio);
        var margin_right    = _parseInt(parseFloat(this.getAttribute('cmmarginright')) * px_multiplier * this.ratio);
        var margin_bottom   = _parseInt(parseFloat(this.getAttribute('cmmarginbottom')) * px_multiplier * this.ratio);
        var margin_left     = _parseInt(parseFloat(this.getAttribute('cmmarginleft')) * px_multiplier * this.ratio);

        this.body.style.marginLeft  = margin_left + 'px';
        this.body.style.width       = (_parseInt(this.page.style.width) - margin_left - margin_right) + 'px';

        this.body.style.marginTop   = margin_top + 'px';
        this.body.style.height      = (_parseInt(this.page.style.height) - margin_top - margin_bottom) + 'px';

        this.body_width  = _parseInt(this.body.style.width);
        this.body_height = _parseInt(this.body.style.height);

        this.repositionBlocks(true);

        onChangeMarginsPage(this);
    };

    this.applyDimesions = function ()
    {
        this.page.style.width  = _parseInt(this.width * this.ratio) + 'px';
        this.page.style.height = _parseInt(this.height * this.ratio) + 'px';

        this.updateMargins();
        this.repositionBlocks();
        this.updateNumberPosition();
    };

    this.setDirection = function (direction)
    {
        if (direction)
        {
            this.direction = (direction == 'horisontal') ? 'horisontal' : 'vertical';
        }

        if (this.page)
        {
            this.setAttribute('xformat', this.format);

            var dims    = Formats[this.format];
            this.width  = (this.direction == 'vertical') ? dims[0] : dims[1];
            this.height = (this.direction == 'vertical') ? dims[1] : dims[0];

            this.applyDimesions();

            this.setAttribute('xdirection', this.direction);
        }
    };

    this.setRatio = function (ratio)
    {
        if (ratio)
        {
            this.ratio = ratio;
        }

        this.setAttribute('xratio', Project.old_ratio);

        if (this.page)
        {
            this.applyDimesions();

            for (var i = 0; i < this.blocks.length; i++)
            {
                this.blocks[i].updateContentRatio();
            }
        }
    };

    this.setId = function (id)
    {
        this.id = id;

        if (this.page)
        {
            this.page.id = id;
        }
    };

    this.setBGColor = function (color, mode)
    {
        var object = (mode == 'page') ? this.page : this.body;
        object.style.backgroundColor = color;
    };

    this.setBGImage = function (image, mode)
    {
        var object = (mode == 'page') ? this.page : this.body;
        object.setAttribute('xbgimage', image);

        object.style.backgroundImage = 'URL(' + getBGImageSource(image, this.ratio * 100) + ')';
        object.style.backgroundRepeat = getSelectedValue('bg_repeat');
        object.style.backgroundPosition = getSelectedValue('bg_pos_v') + ' ' + getSelectedValue('bg_pos_h');
    };

    this.removeBGImage = function (mode)
    {
        var object = (mode == 'page') ? this.page : this.body;
        object.style.backgroundImage = '';
        object.removeAttribute('xbgimage');
    };

    this.X = function ()
    {
        return findPos(this.page)[0];
    };

    this.Y = function ()
    {
        return findPos(this.page)[1];
    };

    this.bodyX = function ()
    {
        return findPos(this.body)[0];
    };

    this.bodyY = function ()
    {
        return findPos(this.body)[1];
    };

    this.setNumbering = function (num, pos_horisontal, pos_vertical)
    {
        this.number = createElement('div');
        this.number.className = 'page_number';

        if (Project.numbering_font)
        {
            this.number.style.fontFamily = Project.numbering_font;
        }

        if (num > 0)
        {
            appendChild(this.number, textNode(num));
        }

        this.numbering_pos_horisontal   = pos_horisontal;
        this.numbering_pos_vertical     = pos_vertical;

        appendChild(this.page, this.number);

        this.updateNumberPosition();
    };

    this.updateNumberPosition = function ()
    {
        if (!Project || !Project.numbering || !this.number) return false;

        this.number.style.fontSize = fontSize2Ratio(Project.numbering_size, Project.ratio);

        var left, top;

        switch (this.numbering_pos_horisontal || 'left')
        {
            case 'center':
                left = _parseInt(this.body.style.marginLeft) + this.body.offsetWidth / 2;
            break;

            case 'right':
                left = _parseInt(this.body.style.marginLeft) + this.body.offsetWidth - this.number.offsetWidth;
            break;

            case 'left':
            default:
                left = _parseInt(this.body.style.marginLeft);
            break;
        }

        switch (this.numbering_pos_vertical || 'bottom')
        {
            case 'top':
                top = Math.round(_parseInt(this.body.style.marginTop) / 2 - this.number.offsetHeight / 2);
            break;

            case 'bottom':
            default:
                var btm = this.page.offsetHeight - _parseInt(this.body.style.marginTop) - this.body.offsetHeight;
                top = _parseInt(this.body.style.marginTop) + this.body.offsetHeight + Math.round(btm / 2 - this.number.offsetHeight / 2);
            break;
        }

        var pos = findPos(this.page);

        this.number.style.left = pos[0] + left + 'px';
        this.number.style.top  = pos[1] + top + 'px';
    };

    this.removeNumber = function ()
    {
        if (this.page.childNodes.length > 1)
        {
            removeNode(this.page.childNodes[1]);
        }
    };

    this.dump = function ()
    {
        var dump = '<div ';

        for (var i = 0; i < this.page.attributes.length; i++)
        {
            var attr = this.page.attributes[i];

            if (attr.nodeValue == null || attr.nodeValue == '') continue;
            if (attr.nodeValue.toString().indexOf('function') > -1) continue;

            dump += ' ' + attr.nodeName.toLowerCase() + '="' + attr.nodeValue.replace('&', '&amp;') + '"';
        }

        if (document.all)
        {
            dump += (' style="' + this.page.style.cssText.toLowerCase() + '; overflow: hidden;"').replace('&', '&amp;');
        }

        dump += '><div ';

        for (var i = 0; i < this.body.attributes.length; i++)
        {
            var attr = this.body.attributes[i];

            if (attr.nodeValue == null || attr.nodeValue == '') continue;
            if (attr.nodeValue.toString().indexOf('function') > -1) continue;

            dump += ' ' + attr.nodeName.toLowerCase() + '="' + attr.nodeValue.replace('&', '&amp;') + '"';
        }

        if (document.all)
        {
            dump += (' style="' + this.body.style.cssText.toLowerCase() + '; overflow: hidden;"').replace('&', '&amp;');
        }

        dump += '>';

        for (var i = 0; i < this.blocks.length; i++)
        {
            dump += this.blocks[i].dump();
        }

        dump += '</div></div>';

        return dump;
    };
}