BlockManagerClass = function ()
{
    this.groups = new Array();
    this.text_count = 0;
    this.image_count = 0;
    this.count = 0;
    this.options = {};

    this.getGroupById = function (group_id)
    {
        for (var i = 0; i < this.groups.length; i++)
        {
            if (this.groups[i].id == group_id)
            {
                return this.groups[i];
                break;
            }
        }

        return false;
    };

    this.getGroupByName = function (group_name)
    {
        for (var i = 0; i < this.groups.length; i++)
        {
            if (this.groups[i].name == group_name)
            {
                return this.groups[i];
                break;
            }
        }

        return false;
    };

    this.textBlock = function (options)
    {
        if (typeof options == 'undefined')
        {
            options = new BlockOptionsClass;
        }

        options['type'] = 'text';

        this.newBlock(options);
    };

    this.imageBlock = function (options)
    {
        if (typeof options == 'undefined')
        {
            options = new BlockOptionsClass;
        }

        options['type'] = 'image';

        this.newBlock(options);
    };

    this.newBlock = function (options)
    {
        if (typeof options == 'undefined')
        {
            options = new BlockOptionsClass;
        }

        if (!options['top'])                options['top']      = '0';
        if (!options['left'])               options['left']     = '0';
        if (!options['width'])              options['width']    = '90%';
        if (!options['height'])             options['height']   = '10%';
        if (!options['insert'])             options['insert']   = 'all_pages';
        if (!options['xDefaultFontSize'])   options['xDefaultFontSize'] = DEFAULT_FONT_SIZE

        var Group  = new BlockGroupClass;
        Group.type = options['type'] || 'text';
        Group.id   = Group.type + '_group_' + (++this[Group.type + '_count']);
        Group.name = this.generateName(Group.type, this[Group.type + '_count']);
        Group.options = options;

        this.insertBlock(Group);
    };

    this.insertBlock = function (Group)
    {
        switch (Group.options['insert'] || this.options['blocks_insert'] || 'all_pages')
        {
            case 'current':

                if (Project.selected)
                {
                    var Block = this.create(Group);
                    Block.appendTo(Project.selected);
                    Group.blocks.push(Block);
                }

            break;

            case 'all_but_current':

                for (var i = 0; i < Project.pages.length; i++)
                {
                    if (Project.selected && Project.selected.id == Project.pages[i].id)
                    {
                        continue;
                    }

                    var Block = this.create(Group);
                    Block.appendTo(Project.pages[i]);
                    Group.blocks.push(Block);
                }

            break;

            default:

                for (var i = 0; i < Project.pages.length; i++)
                {
                    var Block = this.create(Group);
                    Block.appendTo(Project.pages[i]);
                    Group.blocks.push(Block);
                }

            break;
        }

        this.groups.push(Group);
        onBlockCreate(Block);
    };

    this.create = function (Group)
    {
        var Block = new BlockClass;
        Block.setGroupName(Group.name);
        Block.setGroupId(Group.id);
        Block.setClassName(ddClassName + ' ' + Group.type + '_block');
        Block.setId('block_' + (++this.count));
        Block.isEditable = true;
        Block.type = Group.type;
        Block.group = Group;

        if (!Group.options.isEmpty('top'))      Block.setTop(Group.options['top']);
        if (!Group.options.isEmpty('left'))     Block.setLeft(Group.options['left']);
        if (!Group.options.isEmpty('width'))    Block.setWidth(Group.options['width']);
        if (!Group.options.isEmpty('height'))   Block.setHeight(Group.options['height']);

        Block.create();

        Block.element.ondblclick = blockOnDoubleClick;
        Block.setAttribute('xDefaultFontSize', Group.options['xDefaultFontSize']);
        Block.element.style.fontSize = fontSize2Ratio(Group.options['xDefaultFontSize']);

        Group.options.applyStyles(Block);

        if (!Group.options.isEmpty('children'))
        {
            for (var i = 0; i < Group.options.children.length; i++)
            {
                appendChild(Block.element, Group.options.children[i].cloneNode(true));
            }
        }

        return Block;
    };

    this.DOM2block = function (DOMElement)
    {
        var Block = new BlockClass;

        Block.setGroupName(DOMElement.getAttribute('xGroupName'));
        Block.setGroupId(DOMElement.getAttribute('xGroupId'));
        Block.setClassName(DOMElement.className);
        Block.setId('block_' + (++this.count));

        Block.setElement(DOMElement);

        var Group = this.getGroupById(Block.group_id);
        Group.add(Block);

        Block.group = Group;

        var fields_to_copy = [
            'type',
            'default_font_size',
            'stretch',
            'percent_width',
            'percent_height',
            'percent_left',
            'percent_top'
        ];

        for (var i = 0; i < fields_to_copy.length; i++)
        {
            Block[fields_to_copy[i]] = Group.blocks[0][fields_to_copy[i]];
        }

        Block.reposition();
        return Block;
    };

    this.generateName = function (type, number)
    {
        return (type == 'text' ? 'Text' : 'Image') + ' blocks group #' + number;
    };

    this.moveBlock = function (Block, Group)
    {
        if (Block.type != Group.type)
        {
            alert(Lang['js_block_move_2_df_gr']);
            return ;
        }
        else if (Block.group.id == Group.id)
        {
            alert(Lang['js_block_alr_in_gr']);
            return ;
        }

        alert('yes');

        var OldGroup = Block.getGroup()
        OldGroup.remove(Block.id);

        Group.add(Block);

        onBlockMoveToGroup(Block);
    };

    this.deleteGroup = function (Group)
    {
        Group._delete();

        var new_groups = new Array();

        for (var i = 0; i < this.groups.length; i++)
        {
            if (this.groups[i].id != Group.id) new_groups.push(this.groups[i]);
        }

        this.groups = new_groups;
    };

    this.createGroupFromBlock = function (Block, group_name)
    {
        if (typeof group_name == 'undefined')
        {
            group_name = Block.type.ucFirst() + ' group #' + (this[Block.type + '_count'] + 1);
        }

        Block.group.remove(Block.id);

        var Group = new BlockGroupClass;
        Group.setName(group_name);
        Group.setId(this.generateName(Block.type, ++this[Block.type + '_count']));
        Group.type = Block.type;

        Group.add(Block);

        this.groups.push(Group);
    };
}

BlockGroupClass = function ()
{
    this.blocks = new Array();
    this.type;
    this.id;
    this.name;
    this.options = new BlockOptionsClass;

    this._delete = function ()
    {
        while (this.blocks.length > 0)
        {
            this.blocks[0]._delete();
        }

        var new_groups = [];

        for (i = 0; i < Project.BlockManager.groups.length; i++)
        {
            if (this.id == Project.BlockManager.groups[i].id)
            {
                continue;
            }

            new_groups.push(Project.BlockManager.groups[i]);
        }

        Project.BlockManager.groups = new_groups;
    };

    this.isTextGroup = function ()
    {
        return (this.type == 'text');
    };

    this.getOptions = function ()
    {
        this.options['type'] = this.type;
        this.options['group_name'] = this.name;
        this.options['group_id'] = this.id;

        return this.options;
    };

    this.add = function (Block)
    {
        Block.setGroupId(this.id);
        Block.setGroupName(this.name);
        Block.group = this;
        this.blocks.push(Block);
    };

    this.remove = function (block_id)
    {
        var new_blocks = new Array();

        for (var i = 0; i < this.blocks.length; i++)
        {
            if (this.blocks[i].id == block_id) continue;

            new_blocks.push(this.blocks[i]);
        }

        this.blocks = new_blocks;

        if (this.blocks.length == 0)
        {
            this._delete();
        }
    };

    this.setId = function (id)
    {
        this.id = id;

        for (var i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].setGroupId(this.id);
        }
    };

    this.setName = function (name)
    {
        this.name = name;

        for (var i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].setGroupName(this.name);
        }
    };

    this.getBlocks = function()
    {
        return this.blocks;
    };
}

BlockClass = function (DOMElement)
{
    this.type;
    this.id;
    this.default_font_size;
    this.class_name = '';
    this.element = false;
    this.parent;
    this.group;
    this.group_id;
    this.group_name;
    this.name;
    this.stretch;

    this.width;
    this.height;
    this.left;
    this.top;

    this.percent_width;
    this.percent_height;
    this.percent_left;
    this.percent_top;
    this.Page;

    this._delete = function ()
    {
        this.group.remove(this.id);
        removeNode(this.element);

        if (this.group.blocks.length == 0)
        {
            Project.BlockManager.deleteGroup(this.group);
        }

        onBlockDelete(this);
    };

    this.setAttribute = function (attribute, value)
    {
        return this.element.setAttribute(attribute, value);
    };

    this.getAttribute = function (attribute)
    {
        return this.element.getAttribute(attribute);
    };

    this.hasAttribute = function (attribute)
    {
        return !empty(this.element.getAttribute(attribute));
    };

    this.moveTo = function (Group)
    {
        Project.BlockManager.moveBlock(this, Group);
    };

    this.setClassName = function (class_name)
    {
        this.class_name = class_name;

        if (this.element)
        {
            this.element.className = this.class_name;
        }
    };

    this.setName = function (name)
    {
        this.name = name;

        if (this.element)
        {
            this.setAttribute('xBlockName', this.name);
        }
    };

    this.setId = function (id)
    {
        if (id) this.id = id;

        if (this.element)
        {
            this.element.id = this.id;
        }
    };

    this.setGroupId = function (group_id)
    {
        this.group_id = group_id;

        if (this.element)
        {
            this.setAttribute('xGroupId', this.group_id);
        }
    };

    this.setGroupName = function (group_name)
    {
        this.group_name = group_name;

        if (this.element)
        {
            this.setAttribute('xGroupName', this.group_name);
        }
    };

    this.create = function ()
    {
        this.setName(this.defaultName());
        this.setElement(createElement('div'));
    };

    this.setElement = function (DOMElement)
    {
        this.element = DOMElement;
        this.element.className = this.class_name;
        this.setAttribute('xGroupId', this.group_id);
        this.setAttribute('xGroupName', this.group_name);
        this.setAttribute('xBlockName', this.name);
        this.element.BlockObject = this;
        this.element.ondblclick = blockOnDoubleClick;
        this.setId();

        if (DOMElement.parentNode)
        {
            this.parent = DOMElement.parentNode;
        }
    };

    this.appendTo = function (Page)
    {
        appendChild(Page.body, this.element);
        Page.blocks.push(this);

        this.Page   = Page;
        this.parent = Page.body;

        this.element.style.position = 'absolute';

        this.setWidth();
        this.setLeft();
        this.setTop();
        this.setHeight();

        this.positionAbsolutely();
    };

    this.moveToPage = function (Page)
    {
        var new_element = this.element.cloneNode(true);

        this.Page.removeBlock(this);
        removeNode(this.element);

        this.setElement(new_element);
        this.appendTo(Page);

        onBlockMoveToPage(this);
    };

    this.setWidth = function (width, unit)
    {
        this.setDimension('width', width, unit);
    };

    this.setHeight = function (height, unit)
    {
        this.setDimension('height', height, unit);
    };

    this.setLeft = function (left, unit)
    {
        this.setDimension('left', left, unit);
    };

    this.setTop = function (top, unit)
    {
        this.setDimension('top', top, unit);
    };

    this.setDimension = function (dimension, value, unit)
    {
        if (!this.Page)
        {
            if (!value) value = '0';

            if (unit) value += unit;
            this[dimension] = value;
        }
        else
        {
            if (!value && !this['percent_' + dimension])
            {
                value = this[dimension] || '0';
            }
            else if (!value)
            {
                value = this['percent_' + dimension] + '%';
            }

            if (!unit)
            {
                if (value.indexOf('%') > -1)        unit = '%';
                else if (value.indexOf('cm') > -1)  unit = 'cm';
                else if (value.indexOf('mm') > -1)  unit = 'mm';
                else                                unit = 'px';
            }

            value = _parseFloat(value);

            var relativeDimension = (dimension == 'top' || dimension == 'height')
                ? _parseInt(this.parent.style.height)
                : _parseInt(this.parent.style.width);

            switch (unit)
            {
                case 'cm':
                    px = Math.round(value * px_multiplier * Project.ratio);
                break;

                case 'mm':
                    px = Math.round(value * px_multiplier * Project.ratio / 10);
                break;

                case '%':
                    px = _parseInt(relativeDimension / 100 * value);
                break;

                default:
                    px = value;
                break;
            }

            this['percent_' + dimension] = Math.round(px / relativeDimension * 100);

            this.reposition();
        }
    };

    this.positionRelatively = function ()
    {
        if (!this.element.parentNode || this.element.style.position == 'relative') return false;

        this.element.style.position = 'relative';

        this.element.style.left     = _parseInt(this.percent_left) + '%';
        this.element.style.top      = _parseInt(this.percent_top) + '%';
        this.element.style.width    = _parseInt(this.percent_width) + '%';
        this.element.style.height   = _parseInt(this.percent_height) + '%';
    };

    this.positionAbsolutely = function ()
    {
        if (!this.element.parentNode || this.element.style.position == 'absolute') return false;

        var pos = findPos(this.element);

        this.element.style.position = 'absolute';

        this.element.style.left     = pos[0] + 'px';
        this.element.style.top      = pos[1] + 'px';
        this.element.style.width    = Math.round(this.element.parentNode.offsetWidth / 100 * (this.percent_width || 0)) + 'px';
        this.element.style.height   = Math.round(this.element.parentNode.offsetHeight / 100 * (this.percent_height || 0)) + 'px';
    };

    this.reposition = function ()
    {
        this.positionRelatively();
        this.positionAbsolutely();
    };

    this.updatePosition = function ()
    {
        this.updatePercentDimensions();
        this.reposition();
    }

    this.updatePercentDimensions = function ()
    {
        var pos = (this.element.style.position == 'absolute')
            ? findPos(this.parent) : [0, 0];

        if (isIE)
        {
            pos[0]++;
            pos[1]++;
        }

        this.percent_width  = Math.round(_parseInt(this.element.style.width) / _parseInt(this.parent.style.width) * 100);
        this.percent_height = Math.round(_parseInt(this.element.style.height) / _parseInt(this.parent.style.height) * 100);
        this.percent_left   = Math.round((_parseInt(this.element.style.left) - pos[0]) / _parseInt(this.parent.style.width) * 100);
        this.percent_top    = Math.round((_parseInt(this.element.style.top) - pos[1]) / _parseInt(this.parent.style.height) * 100);
    };

    this.updateContentRatio = function ()
    {
        this.setFontSize(this.getFontSize());
        this.updateImageRatio();
        this.positionContentVertical(this.getAttribute('xContentPosVertical'));
    }

    this.getId = function ()
    {
        return this.id;
    };

    this.getName = function ()
    {
        return this.name;
    };

    this.defaultName = function ()
    {
        return (this.isTextBlock() ? Lang['js_text_block'] + ' #' : Lang['js_image_block'] + ' #') + this.getId().match(/\d+/);
    };

    this.getGroupName = function ()
    {
        return this.getAttribute('xGroupName');
    };

    this.getGroupId = function()
    {
        return this.getAttribute('xGroupId');
    };

    this.scrollTo = function ()
    {
        window.scrollTo((window.pageXOffset || document.body.scrollLeft), (this.element.offsetTop - 100));
    };

    this.isTextBlock = function ()
    {
        return (this.type == 'text');
    };

    this.addText = function (text)
    {
        this.setText(text);
    };

    this.getText = function ()
    {
        return this.element.innerHTML == undefined ? '' : br2nl(this.element.innerHTML);
    };

    this.setText = function (text)
    {
        this.element.innerHTML = nl2br(text); //.replace("\n", '<br>');
    };

    this.isB = function ()
    {
        return this.element.style.fontWeight == 'bold';
    };

    this.isI = function ()
    {
        return this.element.style.fontStyle == 'italic';
    };

    this.isU = function ()
    {
        return this.element.style.textDecoration == 'underline';
    };

    this.getFont = function ()
    {
        return (empty(this.element.style.fontFamily)) ? false : this.element.style.fontFamily;
    };

    this.getFontSize = function ()
    {
        return _parseInt(this.getAttribute('xDefaultFontSize'));
    };

    this.setFontSize = function (font_size)
    {
        this.setAttribute('xDefaultFontSize', font_size);
        this.element.style.fontSize = fontSize2Ratio(font_size + 'px', Project.ratio);
    };

    this.setImage = function (source)
    {
        if (this.isTextBlock()) return false;

        this.element.style.backgroundImage = '';

        if (this.element.childNodes.length == 0)
        {
            this.element.appendChild(createElement('img'));
        }

        this.element.firstChild.src = getBGImageSource(source);

        in1.value = this.element.firstChild.src;

//        alert(this.element.firstChild.src);

        this.element.firstChild.setAttribute('source', source);

        if (this.stretch)
        {
            this.strechImage(true);
        }

        this.positionContentVertical(this.getAttribute('xContentPosVertical'));
    };

    this.getImage = function (source)
    {
        if (this.isTextBlock()) return false;
        return (this.element.childNodes.length > 0) ? this.element.firstChild.getAttribute('source') : false;
    };

    this.updateImageRatio = function ()
    {
        if (this.isTextBlock() || this.element.childNodes.length == 0) return false;
        this.setImage(this.getImage());
    };

    this.strechImage = function (mode)
    {
        if (this.isTextBlock()) return false;

        if (this.element.childNodes.length == 0)
        {
            this.stretch = mode;
            return false;
        }

        if (mode)
        {
            this.element.firstChild.style.width  = '100%';
            this.element.firstChild.style.height = '100%';
            this.setAttribute('stretch_image', 'true');
        }
        else
        {
            this.element.firstChild.style.width  = '';
            this.element.firstChild.style.height = '';
            this.setAttribute('stretch_image', 'false');
        }
    };

    this.positionContentHorisontal = function(type)
    {
        if (type == undefined) type = 'left';
        this.element.style.textAlign = type;
        this.setAttribute('xContentPosHorisontal', type);
    };

    this.positionContentVertical = function(type)
    {
        this.setAttribute('xContentPosVertical', type);

        if (this.element.childNodes.length == 0 || this.isTextBlock())
        {
            return false;
        }

        var img = this.element.firstChild;
        img.style.position = 'relative';
        img.parentNode.setAttribute('valign', type);

        switch (type)
        {
            case 'middle':
                var perc = Math.round(img.offsetHeight / this.element.offsetHeight * 100);
                img.style.top = Math.round((100 - perc) / 2) + '%';
            break;

            case 'bottom':
                img.style.top = (100 - Math.round(img.offsetHeight / this.element.offsetHeight * 100)) + '%';
            break;

            case 'top':
            default:
                type = 'top';
                img.style.top = '0';
            break;
        }
    };

    this.getLeft = function (unit)
    {
        return this.getDimension('left', unit);
    };

    this.getTop = function (unit)
    {
        return this.getDimension('top', unit);
    };

    this.getWidth = function (unit)
    {
        return this.getDimension('width', unit);
    };

    this.getHeight = function (unit)
    {
        return this.getDimension('height', unit);
    };

    this.getDimension = function (dimension, unit)
    {
        switch (unit)
        {
            case 'cm':

                var dm = _parseInt(this.element.style[dimension]);

                if ((dimension == 'left' || dimension == 'top') && this.element.style.position == 'absolute')
                {
                    var pos = findPos(this.element.parentNode);
                    dm -= (dimension == 'left') ? pos[0] : pos[1];
                }

                return round(dm / Project.ratio / px_multiplier, 2);

            break;

            case 'mm':

                var dm = _parseInt(this.element.style[dimension]);

                if ((dimension == 'left' || dimension == 'top') && this.element.style.position == 'absolute')
                {
                    var pos = findPos(this.element.parentNode);
                    dm -= (dimension == 'left') ? pos[0] : pos[1];
                }

                return round(dm / Project.ratio / px_multiplier * 10);

            break;

            default:
                return this['percent_' + dimension];
            break;
        }
    };

    this.updateAll = function ()
    {
        this.updatePercentDimensions();
        this.updatePosition();
        this.positionContentVertical(this.getAttribute('xContentPosVertical'));
    };

    this.dump = function ()
    {
        this.positionRelatively();

        var dump = '<div';

        for (var i = 0; i < this.element.attributes.length; i++)
        {
            var attr = this.element.attributes[i];

            if (attr.nodeValue == null || attr.nodeValue == '') continue;
            if (attr.nodeValue.toString().indexOf('function') > -1) continue;

            dump += ' ' + attr.nodeName.toLowerCase() + '="' + attr.nodeValue + '"';
        }

        if (document.all)
        {
            dump += ' style="' + this.element.style.cssText.toLowerCase() + '; overflow: hidden;"';
        }

//        dump += '<div class="block" id="' + this.id + '" style="'
//            + 'position: relative; '
//            + 'width: ' + this.percent_width +'%; '
//            + 'height: ' + this.percent_width + '%; '
//            + 'left: ' + this.percent_left + '%; '
//            + 'top: ' + this.percent_top + '%; ';
//
//        var cssAttr = ['position','width','height','left','top','cssText'];
//
//        for (k in this.element.style)
//        {
//            if (
//                 in_array(k, cssAttr) ||
//                 empty(this.element.style[k]) ||
//                 this.element.style[k].toString().indexOf('function') > -1
//               )
//            {
//                continue;
//            }
//
//            dump += i + ': ' + this.element.style[i] +'; '
//        }
//
//        dump += '" ';
//
//        for (var i = 0; i < blockDumpAttributes.length; i++)
//        {
//            dump += ' ' + blockDumpAttributes[i] + '="' + this.getAttribute(blockDumpAttributes[i]) + '"';
//        }
//
//        dump += '>';
//
//        dump += '</div>';

        dump += '>' + this.element.innerHTML + '</div>';

        this.positionAbsolutely();

        return dump;
    };

    this.getGroup = function ()
    {
        return Project.BlockManager.getGroupById(this.group_id);
    };

    this.align = function (type)
    {
        var Blocks = this.getGroup().blocks;

        for (var i = 0; i < Blocks.length; i++)
        {
            switch (type)
            {
                case 'center':
                    var left = (_parseInt(Blocks[i].element.parentNode.style.width) - _parseInt(Blocks[i].element.style.width)) / 2;
                break;

                case 'right':
                    var left = (_parseInt(Blocks[i].element.parentNode.style.width) - _parseInt(Blocks[i].element.style.width));
                    if (!ie) left -= 2;
                break;

                case 'left':
                    var left = 0;
                break;

                case 'middle':
                    var top = (_parseInt(Blocks[i].element.parentNode.style.height) - _parseInt(Blocks[i].element.style.height)) / 2;
                break;

                case 'bottom':
                    var top = (_parseInt(Blocks[i].element.parentNode.style.height) - _parseInt(Blocks[i].element.style.height));
                    if (!ie) top -= 2;
                break;

                case 'top':
                    var top = 0;
                break;
            }

            pos = findPos(Blocks[i].element.parentNode);

            if (left != undefined)
            {
                Blocks[i].element.style.left = Math.round(left) + pos[0] + 'px';
            }
            else
            {
                Blocks[i].element.style.top = Math.round(top) + pos[1] + 'px';
            }

            Blocks[i].updatePercentDimensions();
        }

        positionResizeRectangles();
    };
};

BlockOptionsClass = function ()
{
    this.styles;

    this.isEmpty = function(property)
    {
        return (this[property] == undefined);
    };

    this.addStyle = function(property, value)
    {
        if (this['styles'] == undefined) this['styles'] = new Array();
        this.styles.push([property, value]);
    };

    this.applyStyles = function(Block)
    {
        if (this['styles'] == undefined) return false;

        for (var i = 0; i < this.styles.length; i++)
        {
            // IE again... this is how it's done in good browser:
            // element.style.setProperty(this.styles[i][0], this.styles[i][1], null);
            var property = this.styles[i][0].toLowerCase().replace(/[-]([a-z])/g, function(a, b) {return b.toUpperCase();})
            Block.element.style[property] = this.styles[i][1];

            if (property == 'fontSize')
            {
                Block.setAttribute('xDefaultFontSize', this.styles[i][1]);
            }
        }

        return Block;
    };

    this.addChild = function(node)
    {
        if (this['children'] == undefined) this['children'] = new Array();
        this.children.push(node);
    };
};

function deleteBlocksGroup(group_id)
{
    var nbg = {};

    for (i in BlockGroups)
    {
        if (i == 'prototype' || i == group_id)
        {
            continue;
        }

        nbg[i] = BlockGroups[i];

    }

    BlockGroups = nbg;
};

function moveBlock(e)
{
    e = getEvent(e);

    var Block = e.srcElement.BlockObject;
    var OldGroup = Block.getGroup();

    var group_name = getElement(e.srcElement.getAttribute('xInputId')).value;

    if (group_name == '')
    {
        return alert(Lang['js_block_group_em']);
    }

    var Group = Project.BlockManager.getGroupByName(group_name);

    if (Group)
    {
        if (Group.id == OldGroup.id)
        {
            return alert(Lang['js_block_alr_in_gr']);
        }

        Project.BlockManager.moveBlock(Block, Group);
    }
    else
    {
        OldGroup.remove(Block.id);
        Project.BlockManager.createGroupFromBlock(Block, group_name);
    }

    scrOnMoveBlock();

    alert('Block successfully moved.');
};

/**
* makes blocks' list
*/
function blocksList()
{
    var container = getElement('sb_blocks');

    container.innerHTML = '';

    if (Project.BlockManager.count == 0)
    {
        container.innerHTML = Lang['js_no_blocks_yet'];
        return false;
    }

    for (var i = 0; i < Project.BlockManager.groups.length; i++)
    {
        var Group = Project.BlockManager.groups[i];

        var div = createElement('div');
        div.id = Group.id + '_del';
        div.className = 'block_list_element';

        var button = createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'delete');
        button.GroupObject = Group;
        button.onclick = deleteBlockGroup;

        appendChild(div, button);

        var block_name = createElement('span');
        block_name.ondblclick = switchBlockGroupName;
        block_name.style.marginLeft = '5px';
        block_name.GroupObject = Group;
        appendChild(block_name, textNode(Group.name));

        appendChild(div, block_name);
        appendChild(container, div);
    }

    appendChild(container, createElement('br'));

    var small = createElement('small').appendChild(document.createTextNode(Lang['js_blk_group_dbl_click']));

    appendChild(container, small);
};

function switchBlockGroupName(e)
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
        var name = e.srcElement.value;
        var name_div = e.srcElement.parentNode;
        name_div.GroupObject.setName(name);

        removeNode(e.srcElement);

        appendChild(name_div, textNode(name));
    }
    else
    {
        var input           = createElement('input');
        input.type          = 'text';
        input.className     = 'input';
        input.style.width   = '93%';
        input.ondblclick    = switchBlockGroupName;
        input.onkeyup       = switchBlockGroupName;
        input.value         = e.srcElement.firstChild.nodeValue;
        input.title         = Lang['tree_block_input_hint'];

        e.srcElement.innerHTML = '';
        appendChild(e.srcElement, input);
    }
};

function deleteBlockGroup(e)
{
    e = getEvent(e);

    if (!confirm(Lang['js_del_block_group_conf']))
    {
        return false;
    }

    Project.BlockManager.deleteGroup(e.srcElement.GroupObject);

    scrOnDeleteBlockGroup();
};

function setBlockCoordinates()
{
    if (!currentIBox) return false;

    var Block = currentIBox.el_input.BlockObject;

    var value       = currentIBox.el_input.value;
    var unit        = getSelectedValue(currentIBox.el_input.id + '_unit');
    var dimension   = ucwords(currentIBox.el_input.id.replace('coord_', ''));

    var blocks = Block.getGroup().blocks;

    for (var i = 0; i < blocks.length; i++)
    {
        blocks[i]['set' + dimension](value, unit);
        blocks[i].element.style.zIndex = ++maxZIndex;
    }

    positionResizeRectangles();

    InfoBar.updateBlockInfo();
};

function showBlockDeleteButton(Block)
{
    var button = createElement('img');
    button.src = __IMG_DELETE;
    button.className = 'block_delete_button';
    button.id = Block.id + '_delete_button';
    button.BlockObject = Block;
    button.onclick = deleteBlockByButton;
    appendChild(document.body, button);

    positionBlockDeleteButton(button.id);
};

function positionBlockDeleteButton(button_id)
{
    var button = getElement(button_id);
    var Block = button.BlockObject;

    var block_pos = findPos(Block.element);

    button.style.left = (block_pos[0] + Block.element.offsetWidth) + 2 + 'px';
    button.style.top  = (block_pos[1] - 2 - button.offsetHeight) + 'px';

    button.style.zIndex = ++PopupManager.zIndex;
};

function deleteBlockByButton(e)
{
    e = getEvent(e);

    if (!confirm(Lang.js_del_block_conf)) return false;

    var button = e.srcElement;
    rmResizeRectangles();
    button.BlockObject._delete();
    removeNode(button);
};

function removeBlockDeleteButton(Block)
{
    var button = getElement(Block.id + '_delete_button');
    removeNode(button);
};

function borderSize(value)
{
    value = _parseInt(value);
    if (value < 0) return;

    Project.selected_block.element.style.borderWidth = value + 'px';
    positionResizeRectangles();
}

function borderStyle(value)
{
    Project.selected_block.element.style.borderStyle = value;
    positionResizeRectangles();
}

function borderColor(value)
{
    Project.selected_block.element.style.borderColor = value;
}

function setBlockVisibility(e)
{
    var e = getEvent(e);

    var Block = e.srcElement.BlockObject;

    if (Block.element.style.visibility == 'hidden')
    {
        Block.element.style.visibility = 'visible';
        e.srcElement.src = 'images/eye.gif';
    }
    else
    {
        Block.element.style.visibility = 'hidden';
        e.srcElement.src = 'images/eye_gray.gif';

        if (Block.id == Project.selected_block.id)
        {
            rmResizeRectangles();
            removeBlockDeleteButton(Block);
        }
    }
}