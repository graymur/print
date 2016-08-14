/**
* Class for combo boxes creation - gr@graymur.net, 2006
* was tested in FF 1.5, IE 6, Opera 9.
*/

/**
Example:

    var Combo = new ComboBox();

    Combo.fill = false;

    Combo.container_class_name  = 'combo';
    Combo.input_class_name      = 'combo_input';
    Combo.switch_class_name     = 'swc';
    Combo.option_class_name     = 'opt';

    Combo.options_callback  = 'optionsCallback';

    document.getElementById('combo_container').appendChild(Combo.getDOM());

    Combo.setEventHandler('keyup', onKeyUpHandler);
    Combo.setInputId('combo_1');
    Combo.setInputName('country_name');

    function optionsCallback()
    {
        return ['Russia', 'Ukraine', 'France'];
    }

    function onKeyUpHandler (e)
    {
        alert(e.which);
    }

*/

var isIE    = !!(navigator.userAgent.toLowerCase().indexOf('msie') >= 0 && document.all);
var isOpera = !!(window.opera && document.getElementById);
var isMoz   = (!isIE && !isOpera);

var combo_fill_time_out, combo_last_input;
var combo_objects = new Array(); // Array with pointers to all created combo objects

function ComboBox (options)
{
    this.options    = new Array();  // array of options

    this.input_id   = '';
    this.input_name = '';

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

    this.set_callback       = false;        // name of function to run when option is chosen
    this.options_callback   = false;        // name of function which outputs array of options
    this.fill_callback      = false;        // name of function which outputs array of options
                                            // when user types in input field
    this.show_switch        = true;         // show/hide button, which shows all options
    this.fill               = true;         // show similar options from the list as user types
    this.fill_delay         = 1000;
    this.drop_down_image    = 'http://p/m/images/down_arrow.gif';

    this.container_class_name   = '';   // css class for combo box container <div>
    this.input_class_name       = '';   // css class for text input field
    this.switch_class_name      = '';   // css class for options list switch
    this.options_class_name     = '';   // css class for options container <div>
    this.option_class_name      = '';   // css class for single option

    this.input_id;

    this.el_container  = false;
    this.el_input      = false;
    this.el_opt_switch = false;
    this.el_options    = false;

    combo_objects.push(this);

    this.container = false;

    if (typeof options != 'undefined' && options.length > 0)
    {
        this.options = options;
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

    this.setCallback = function (callback)
    {
        this.callback = callback;
    };

    this.setInputId = function (id)
    {
        this.input_id = id;

        if (this.el_input)
        {
            this.el_input.id = this.input_id;
        }
    };

    this.setInputName = function (name)
    {
        this.input_name = name;

        if (this.el_input)
        {
            this.el_input.name = this.input_name;
        }
    };

    this.getDOM = function ()
    {
        this.el_container = document.createElement('div');
        this.el_container.className = this.container_class_name;
        this.el_container.ComboObject = this;

        this.el_input = document.createElement('input');
        this.el_input.type = 'text';
        this.el_input.className = this.input_class_name;

        var events = ['onclick','ondblclick','onchange','onmousedown','onmouseup','onmouseover','onmouseout','onkeydown','onfocus','onblur'];

        for (var i = 0; i < events.length; i++)
        {
            if (this['input_' + events[i]] != '' && typeof this['input_' + events[i]] != 'undefined')
            {
                this.el_input[events[i]] = this['input_' + events[i]];
            }
        }

        if (this.fill)
        {
            this.el_input.onkeyup = setDelay;
        }

        this.el_input.id = (this.input_id == '') ? uniqueId('combo_input_') : this.input_id;
        this.input_id = this.el_input.id;
        this.el_input.name = this.name;

        this.el_container.appendChild(this.el_input);

        if (this.show_switch)
        {
            this.el_opt_switch = document.createElement('input');
            this.el_opt_switch.type = 'image';
            this.el_opt_switch.src = this.drop_down_image;
            this.el_opt_switch.className = this.switch_class_name;
            this.el_opt_switch.onclick = toggleList;

            this.el_container.appendChild(this.el_opt_switch);
        }

        return this.el_container;
    };

    this.getHTML = function ()
    {
        var combo = this.getDOM();

        return combo.innerHTML;
    };

    this.appendTo = function (element)
    {
        element.appendChild(this.getDOM());
    };

    this.getOptions = function ()
    {
        if (this.options.length > 0)
        {
            return this.options;
        }
        else if (this.options_callback)
        {
            return eval(this.options_callback + '()');
        }
        else
        {
            return new Array();
        }
    };

    this.showOptions = function (options)
    {
        if (!this.el_input || (typeof options == 'undefined' && !(options = this.getOptions())))
        {
            return false;
        }

        var options_container = document.createElement('div');
        options_container.className = this.options_class_name;
        options_container.id = uniqueId('combo_options_');

        //
        // position options container
        //

        options_container.style.position = 'absolute';

        if (!isIE)
        {
            options_container.style.left = this.el_container.offsetLeft + 'px';
            options_container.style.top  = this.el_container.offsetTop + this.el_input.offsetHeight + 'px';
        }
        else
        {
            options_container.style.left = this.el_container.offsetLeft + 'px';
            options_container.style.top = this.el_container.offsetTop + this.el_input.offsetHeight + 'px';
        }

        options_container.ComboObject = this;

        for (var i = 0; i < options.length; i++)
        {
            var option = document.createElement('div');
            option.appendChild(document.createTextNode(options[i]));
            option.className = this.option_class_name;
            option.style.minWidth = this.el_input.offsetWidth + 'px';
            option.onclick = comboSetOption;
            option.setAttribute('xParentId', this.el_input.id);

            options_container.appendChild(option);
        }

        this.el_options = options_container;

        this.el_container.appendChild(options_container);
    };

    this.removeOptions = function ()
    {
        if (this.el_options)
        {
            this.el_container.removeChild(this.el_options);
            this.el_options = false;
        }
    };

    this.runOnSetOptionCallback = function (value)
    {
        if (this.set_callback)
        {
            eval(this.set_callback + "('" + value + "')");
        }
    };

    this.makeFill = function ()
    {
        this.removeOptions();

        var value = this.el_input.value.toLowerCase();

        if (value == '')
        {
            return false;
        }

        if (this.fill_callback)
        {
            var list = eval(this.fill_callback + "('" + value + "')");
        }
        else if ((options = this.getOptions()))
        {
            var list = new Array();

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].toLowerCase().indexOf(value) == 0)
                {
                    list.push(options[i]);
                }
            }
        }

        if (list.length > 0)
        {
            this.showOptions(list);
        }
    };
}

function toggleList(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;

    var ComboObject = e.srcElement.parentNode.ComboObject;

    if (ComboObject.el_options)
    {
        ComboObject.removeOptions();
    }
    else
    {
        ComboObject.showOptions();
    }
}

function setDelay(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;

    combo_last_input = e.srcElement;

    var ComboObject = e.srcElement.parentNode.ComboObject;

    clearTimeout(combo_fill_time_out);

    combo_fill_time_out = setTimeout(comboFill, ComboObject.fill_delay);
}

function comboFill()
{
    var ComboObject = combo_last_input.parentNode.ComboObject;
    ComboObject.makeFill();
}

function comboSetOption(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;

    var input = document.getElementById(e.srcElement.getAttribute('xParentId'));

    input.value = e.srcElement.firstChild.nodeValue;

    var ComboObject = e.srcElement.parentNode.ComboObject;

    ComboObject.removeOptions();

    ComboObject.runOnSetOptionCallback(input.value);
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

function findPos(obj)
{
    if (typeof obj == 'undefined') return false;

	var curleft = curtop = 0;
	if (obj.offsetParent)
	{
		curleft = obj.offsetLeft;
		curtop  = obj.offsetTop;

		while (obj = obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			curtop  += obj.offsetTop;
		}
	}

	return [curleft,curtop];
}