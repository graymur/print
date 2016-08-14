var isIE    = !!(navigator.userAgent.toLowerCase().indexOf('msie') >= 0 && document.all);
var isOpera = !!(window.opera && document.getElementById);
var isMoz   = (!isIE && !isOpera);

var default_time_out = 400;

var currentIBox;
var timeout_id;
var timeout = default_time_out;

IncrementingBox = function (default_value, increment)
{
    this.increment_value = 1;
    this.default_value = 0;
    this.min_value;
    this.max_value;
    this.multiplier;
    this.decimals;
    
    this.options;
    this.value;
    
    this.input_id   = '';
    this.input_name = '';
    
    this.el_container;
    this.el_input;
    this.el_arrows;
    this.el_up_arrow;
    this.el_dn_arrow;
    
    this.container_class_name   = '';   // css class for combo box container <div>
    this.input_class_name       = '';   // css class for text input field
    this.incr_class_name        = '';   // css class for options list switch
    
    this.onIncrementCallback    = false;
    
    // event hadlers for <input> element. Might be set as Combo.input_onclick = clickHandler
    // or by Combo.setEventHandler('keyup', onKeyUpHadler);
    // Warinng - onkeyup event is reserved.

    this.input_onclick      = '';
    this.input_ondblclick   = '';
    this.input_ondchange    = '';
    this.input_onmousedown  = '';
    this.input_onmouseup    = '';
    this.input_onmouseover  = '';
    this.input_onmouseout   = '';
    this.input_onkeydown    = '';
    this.input_onfocus      = '';
    this.input_onblur       = '';
    
    if (typeof default_value != 'undefined')
    {
        this.default_value = default_value;
        
        if (typeof increment != 'undefined')
        {
            this.increment = parseFloat(increment);
        }
    };
    
    this.setEventHandler = function (event, handler)
    {
        this['input_on' + event] = handler;

        if (this.el_input)
        {
            this.el_input['on' + event] = handler;
        }
    };

    this.setOptions = function (options)
    {
        this.options = options;
    };
    
    this.getDOM = function ()
    {
        this.el_container = (isIE) ? document.createElement('span') : document.createElement('div');
        this.el_container.className = this.container_class_name;
        this.el_container.style.verticalAlign = 'middle';
        this.el_container.IBoxObject = this;

        this.el_input = document.createElement('input');
        this.el_input.type = 'text';
        this.el_input.className = this.input_class_name;
        this.el_input.value = _parseFloat(this.default_value);

        var events = ['ondblclick','onchange','onmousedown','onmouseup','onmouseover','onmouseout','onkeydown','onfocus','onblur'];

        for (var i = 0; i < events.length; i++)
        {
            if (this['input_' + events[i]] != '' && typeof this['input_' + events[i]] != 'undefined')
            {
                this.el_input[events[i]] = this['input_' + events[i]];
            }
        }

        this.el_input.id = (this.input_id == '') ? uniqueId('combo_input_') : this.input_id;
        this.el_input.name = this.name;
        this.el_input.onkeydown = iBoxOnKeyDownHandler;
        this.el_input.onclick = iBoxOnKeyDownHandler;
        this.el_input.onkeyup = iBoxOnKeyUpHandler;
        this.el_input.onmouseup = iBoxOnKeyUpHandler;
        this.el_input.style.verticalAlign = 'middle';
        this.el_input.IBoxObject = this;
        
        if (isIE)
        {        
            this.el_input.style.display = 'inline';
        }
        else
        {
            this.el_input.style.display = 'block';
            this.el_input.style.cssFloat = 'left';
        }

//        this.el_arrows = document.createElement('div');
        this.el_arrows = (isIE) ? document.createElement('span') : document.createElement('div');
        this.el_arrows.style.display = 'inline';
        this.el_arrows.style.verticalAlign = 'middle';

        if (isIE)
        {        
            this.el_arrows.style.display = 'inline';
        }
        else
        {
            this.el_arrows.style.display = 'block';
            this.el_arrows.style.cssFloat = 'left';
        }

        this.el_up_arrow = document.createElement('img');
//        this.el_up_arrow.src = 'http://print.commexi.com/m/images/arrow_up.gif';
        this.el_up_arrow.src = 'arrow_up.gif';
        this.el_up_arrow.style.display = 'block';

        this.el_up_arrow.style.cursor = 'pointer';
        this.el_up_arrow.onmousedown = onMouseDownHandler;
        this.el_up_arrow.onmouseup = onMouseUpHandler;
        this.el_up_arrow.setAttribute('multiplier', 1);

        this.el_dn_arrow = document.createElement('img');
//        this.el_dn_arrow.src = 'http://print.commexi.com/m/images/arrow_down.gif';
        this.el_dn_arrow.src = 'arrow_down.gif';
        this.el_dn_arrow.style.display = 'block';

        this.el_dn_arrow.style.cursor = 'pointer';
        this.el_dn_arrow.onmousedown = onMouseDownHandler;
        this.el_dn_arrow.onmouseup = onMouseUpHandler;
        this.el_dn_arrow.setAttribute('multiplier', -1);

        this.el_arrows.appendChild(this.el_up_arrow);
        this.el_arrows.appendChild(this.el_dn_arrow);

        this.el_container.appendChild(this.el_input);
        this.el_container.appendChild(this.el_arrows);
        
        if (isIE)
        {
            this.el_arrows.style.width = this.el_up_arrow.offsetWidth;
            this.el_dn_arrow.style.cssFloat = 'left';
            this.el_up_arrow.style.cssFloat = 'left';
        }

        return this.el_container;
    };
    
    this.appendTo = function (element)
    {
        if (typeof element == 'string')
        {
            element = document.getElementById(element);
        }
        
        element.appendChild(this.getDOM());
    };
    
    this.increment = function ()
    {
        if (typeof this.decimals == 'undefined')
        {
            this.decimals = 0;
            var iv = this.increment_value;

            while (iv.toString().indexOf('.') > -1)
            {
                iv *= 10;
                this.decimals++;
            }
        }

        this.el_input.value = round(_parseFloat(this.el_input.value) + this.multiplier * _parseFloat(this.increment_value), this.decimals);
        this.checkValue();
    };

    this.setValue = function (value)
    {
        this.default_value = value;
        
        if (this.el_input)
        {
            this.el_input.value = _parseFloat(value);
        }
    };

    this.checkValue = function ()
    {
        if (typeof this.max != 'undefined' && this.el_input.value > this.max)
        {
            this.el_input.value = this.max;
        }
        else if (typeof this.min != 'undefined' && this.el_input.value < this.min)
        {
            this.el_input.value = this.min;
        }

        this.el_input.value = round(_parseFloat(this.el_input.value), this.decimals);
        
        this.value = this.el_input.value;

        if (this.onIncrementCallback)
        {
            eval(this.onIncrementCallback + '()');
        }
    };

    this.replace = function (element_id)
    {
        var element = document.getElementById(element_id);

        if (!element) return false;

        if (element.value)      this.default_value = element.value;
        if (element.id)         this.input_id = element.id;
        if (element.className)  this.input_class_name = element.className;
        if (element.name)       this.input_name = element.name;

        var parent = element.parentNode;
        var next_element = element.nextSibling;
        parent.removeChild(element);

        if (next_element)
        {
            parent.insertBefore(this.getDOM(), next_element);
        }
        else
        {
            parent.appendChild(this.getDOM());
        }
    };
}

function onMouseDownHandler(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;

    currentIBox = e.srcElement.parentNode.parentNode.IBoxObject;
    currentIBox.multiplier = e.srcElement.getAttribute('multiplier');

    currentIBox.increment();

    timeout_id = setTimeout(timeOutHandler, timeout);
}

function onMouseUpHandler(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;

//    currentIBox = false;
    clearTimeout(timeout_id);
    timeout = default_time_out;
}

function timeOutHandler()
{
    currentIBox.increment();
    if (timeout > 50) timeout /= 2;
    timeout_id = setTimeout(timeOutHandler, timeout);
}

function iBoxOnKeyUpHandler(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;
    
    e.srcElement.value.replace = e.srcElement.value.replace(',', '.');

    if (e.srcElement.value != '' && e.srcElement.value != _parseFloat(e.srcElement.value))
    {
        e.srcElement.value = _parseFloat(e.srcElement.value);
    }
    
    e.srcElement.parentNode.IBoxObject.checkValue();
}

function iBoxOnKeyDownHandler(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;
    
    currentIBox = e.srcElement.IBoxObject;
}

function _parseFloat(value)
{
    if (!isNaN(parseFloat(value)))
    {
        return parseFloat(value);
    }
    else if (!isNaN(parseInt(value)))
    {
        return parseInt(value);
    }
    else
    {
        return 0;
    }
}

function round(val, precision)
{
    var multiplier = '1';

    for (var i = 0; i < precision; i++) multiplier += '0';

    return Math.round(val * multiplier) / multiplier;
}


function uniqueId(prefix)
{
    do
    {
        id = Math.random(1, 1000);

        if (typeof prefix != 'undefined')
        {
            id = prefix + id;
        }
    }
    while((el = document.getElementById(id)))

    return id;
}