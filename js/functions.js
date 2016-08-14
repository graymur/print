function setSelectedOption(select_id, option_value)
{
    var select = getElement(select_id);

    for (var i = 0; i < select.options.length; i++)
    {
        select.options[i].selected = (option_value == select.options[i].value);
    }
}

function getSelectedValue(select_id)
{
    var select;

    if (!(select = document.getElementById(select_id)))
    {
        return false;
    }

    return select.options[select.selectedIndex].value;
}

/**
* set options for certain rapameter (i.e.: pages numbering)
*/
function setOptions(element_id)
{
    var container = document.getElementById(element_id);

    var selects = container.getElementsByTagName('select');

    for (i = 0; i < selects.length; i++)
    {
        options[selects[i].name] = selects[i].options[selects[i].selectedIndex].value;

    }

    var inputs = container.getElementsByTagName('input');

    for (i = 0; i < inputs.length; i++)
    {
        if (inputs[i].type == 'radio')
        {
            if (inputs[i].checked == true) options[inputs[i].name] = inputs[i].value;
        }
        else
        {
            options[inputs[i].name] = inputs[i].value;
        }
    }

    hideOptionsDivs();
}

function _parseInt(value)
{
    return isNaN(parseInt(value)) ? 0 : parseInt(value);
}

function empty(value)
{
    return (typeof value == 'undefined' || value == null || value == '') ? true : false;
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

function isDraggable(className)
{
    var reg = new RegExp('.*' + ddClassName + '.*', 'i');
    return reg.test(className);
}

function in_array(key, values)
{
    if (!values.length) return false;

    for (var i = 0; i < values.length; i++)
    {
        if (key == values[i]) return true;
    }

    return false;
}

/**
* positions element exactly in the middle of the window
* considering scroll value
* @param object element - pointer to DOM element;
* @param boolean consider_scroll
*/
function centerElement(element, consider_scroll)
{
    if (!element.offsetWidth) return false;

    var left = document.body.offsetWidth / 2 - element.offsetWidth / 2;
    var top  = (isMoz ? window.innerHeight : document.documentElement.clientHeight) / 2 - element.offsetHeight / 2;

    if (consider_scroll != false)
    {
        top += (window.pageYOffset || document.documentElement.scrollTop);
    }

    element.style.position  = 'absolute';
    element.style.left      = left + 'px';
    element.style.top       = top + 'px';
}

function nl2br(text)
{
    while (text.indexOf("\n") > -1)
    {
        text = text.replace("\n", '<br>');
    }

    return text;
}

function br2nl(text)
{
    while (text.indexOf('<br') > -1)
    {
        text = text.replace(/<br\s*\/?>/i, "\n");
    }

    return text;
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
        id = Math.random(0, 1000);

        if (typeof prefix != 'undefined')
        {
            id = prefix + id;
        }
    }
    while((el = document.getElementById(id)))

    return id;
}

function strstr(needle, values)
{
    if (typeof needle == 'undefined' || needle.toString() == '') return false;

    if (typeof values == 'string')
    {
        values = [values];
    }

    for (var i = 0; i < values.length; i++)
    {
        if (values[i].toString().indexOf(needle) > -1)
        {
            return true;
        }
    }

    return false;
}

MovementTracker = function ()
{
    this.Xarray = new Array();
    this.Yarray = new Array();
    this.num    = 5;
    this.min    = 3;

    this.truncate = function ()
    {
        this.Xarray = new Array();
        this.Yarray = new Array();
    };

    this.track = function (posX, posY)
    {
        this.Xarray.push(posX);
        this.Yarray.push(posY);

        if (this.Xarray.length > this.num)
        {
            this.Xarray.shift();
            this.Yarray.shift();
        }
    };

    this.getTrend = function (axis)
    {
        var varname = axis + 'array';

        if (this[varname].length < this.min) return false;

        var sum = 0;

        for (i = 1; i < this[varname].length; i++)
        {
            sum += (this[varname][i] - this[varname][(i - 1)]);
        }

        return sum > 0 ? 'p' : 'n';
    };

    /**
    * @return string: 'p' - positive, 'n' - negative
    */
    this.XTrend = function ()
    {
        return this.getTrend('X');
    };

    /**
    * @return boolean: true - positive, false - negative
    */
    this.YTrend = function ()
    {
        return this.getTrend('Y');
    };
};

/**
* images for background are generated on-the-fly
* to preserve ratio. this function updates image's
* source every time ratio is changed
*/
function getBGImageSource(file, ratio)
{
    if (ratio == undefined) ratio = Project.ratio * 100;
    return BASE_URL + '/m/bg.php?i=' + file + '&r=' + ratio;
}

function a2(v1, v2)
{
    return (v1 + ' : ' + v2);
}

function getEvent(e)
{
    if (isIE) e = window.event;
    if (isMoz) e.srcElement = e.target;
    return e;
}

function ucwords(string)
{
    return string.toLowerCase().replace(/(^|\s)([a-z])/g, function(a,b,c){return b + c.toUpperCase();});
}

function px2cm(px_value)
{
    return round(px_value / Project.ratio / px_multiplier, 2);
}

function fontSize2Ratio(font_size, ratio)
{
    var defl = _parseInt(font_size);

    if (!defl.toString) return font_size;

    var unit = font_size.replace(defl, '');

    return _parseInt(defl * ratio) + unit;
}

function fontsListToOptions(select_id, create_empty)
{
    var select = getElement(select_id);

    if (!select) return false;

    select.innerHTML = '';

    if (typeof create_empty == 'undefined' || create_empty)
    {
        var option = createElement('option');
        option.value = '';
        option.innerHTML = '';

        appendChild(select, option);
    }

    for (var i = 0; i < fontsList.length; i++)
    {
        var option = createElement('option');
        option.value = fontsList[i];
        option.innerHTML = fontsList[i];

        appendChild(select, option);
    }
}

function fontSize2Ratio(font_size)
{
    font_size = _parseInt(font_size);
    return round(_parseInt(font_size) * Project.ratio, 0) + 'px';
}

String.prototype.ucFirst = function ()
{
   return this.substr(0,1).toUpperCase() + this.substr(1,this.length);
}