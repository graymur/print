function popupOptionsDiv(id)
{
    var element = getElement(id);

    PopupManager.createFromDOM(element);
    PopupManager.last.open();
}

function closeOptionsDivs()
{
}

/**
* opens popup with text block options
* @param Block - Block object
* @param e - double click event
*/
function openTextBlockOptions(Block, e)
{
    if (!Block) return false;

    getElement('button_bold').className = Block.isB() ? 'button_down' : 'button_up';
    getElement('button_italic').className = Block.isI() ? 'button_down' : 'button_up';
    getElement('button_underline').className = Block.isU() ? 'button_down' : 'button_up';

    for (var i = 0; i < align_types.length; i++)
    {
        getElement('button_align_' + align_types[i]).className = (align_types[i] == Block.element.style.textAlign)
            ? 'button_down' : 'button_up';
    }

    setSelectedOption('select_font_family', Block.getFont());
    setSelectedOption('select_font_size', Block.getFontSize());

    getElement('text_insert').value = Block.getText();

    PopupManager.createFromDOM(getElement('text_tools'));
    PopupManager.last.open();
}

/**
* opens popup with image block options
* @param Block - Block object
* @param e - double click event
*/
function openImageBlockOptions(Block, e)
{
    if (!Block) return false;

    Block.element.style.backgroundImage = '';

    if (Block.getAttribute('stretch_image') == 'true')
    {
        getElement('image_pos_h').disabled = true;
        getElement('image_pos_v').disabled = true;
        getElement('image_stretch').checked = true;
    }
    else
    {
        getElement('image_pos_h').disabled = false;
        getElement('image_pos_v').disabled = false;
        getElement('image_stretch').checked = false;
    }

    setSelectedOption('image_pos_h', Block.element.style.textAlign);
    setSelectedOption('image_pos_v', Block.element.getAttribute('xContentPosVertical'));

    PopupManager.createFromDOM(getElement('image_tools'));
    PopupManager.last.open();
}

function showImagesList(callback)
{
    var il = getElement('images_list');

    for (var i = 0; i < il.childNodes.length; i++)
    {
        if (il.childNodes[i].className != 'img_cont') continue;
        var image = il.childNodes[i].firstChild;

        if (callback != undefined)
        {
            image.setAttribute('callback', callback);
            image.onclick = runImageCallback;
        }
        else
        {
            image.setAttribute('callback', '');
            image.onclick = '';
        }
    }

    PopupManager.createFromDOM(il);
    PopupManager.last.open();
}

function runImageCallback(e)
{
    e = getEvent(e);

    if ((callback = e.srcElement.getAttribute('callback')))
    {
        eval(callback + "('" + e.srcElement.getAttribute('source') + "')");
    }

    closeImagesList();
}

function closeImagesList()
{
    if (getElement('images_list').popupObject)
    {
        getElement('images_list').popupObject.close();
    }
}

function showBlockCoordinatesPopup(e)
{
    if (e)
    {
        e = getEvent(e);
        var Block = e.srcElement.BlockObject;
    }
    else
    {
        var Block = Project.selected_block;
    }

    var coords = getElement('coordinates');
    coords.BlockObject = Block;

    var dimensions = ['left', 'top', 'width', 'height'];
    
    for (var i = 0; i < dimensions.length; i++)
    {
        var dm = dimensions[i];
        
        getElement('coord_' + dm).IBoxObject.onIncrementCallback = 'setBlockCoordinates';
        getElement('coord_' + dm).BlockObject = Block;
        setIncrementingFieldValue
        (
            getElement('coord_' + dm).IBoxObject,
            Block.getDimension(dm, getSelectedValue('coord_' + dm + '_unit')),
            getSelectedValue('coord_' + dm + '_unit')
        );
    }

    PopupManager.createFromDOM(coords);
    PopupManager.last.open();
}