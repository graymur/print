var cachedObjects = {};

function createElement(tagName)
{
    var element = document.createElement(tagName);
    return element;
}

function createButton(value, id, className)
{
    var button = createElement('input');
    button.type = 'button';
    if (value != undefined) button.value = value;
    if (id != undefined) button.id = id;
    if (className != undefined) button.className = className;

    return button;
}

function createImage(source)
{
    var img = createElement('IMG');
    img.src = source;
    return img;
}

function getElement(id)
{
    if (!cachedObjects[id])
    {
        var object = document.getElementById(id);

        if (object)
        {
            cacheObject(object);
            return object;
        }
        else
        {
            return false;
        }
    }
    else if (cachedObjects[id])
    {
        return cachedObjects[id];
    }
}

function cacheObject(object)
{
    cachedObjects[object.id] = object;
}

function appendChild(parent, child)
{
    parent.appendChild(child);
    cacheObject(child);
}

function removeNodeById(id)
{
    if (!(node = getElement(id)))
    {
        return false;
    }

    return removeNode(node);
}

function removeNode(node)
{
    if (node == undefined || !node.parentNode) return false;
    return node.parentNode.removeChild(node);
}

function textNode(text)
{
    return document.createTextNode(text);
}

function clearingDiv(parent, margin)
{
    var div = createElement('div');
    div.style.clear = 'both';
    div.style.overflow = 'hidden';

    if (typeof margin != 'undefined')
    {
        div.style.marginBottom = margin + 'px';
    }

    appendChild(parent, div);
}