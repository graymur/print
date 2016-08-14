function setImage(image)
{
    if (!Project.selected_block) return false;
    Project.selected_block.setImage(image);
}

function setImageStretching()
{
    if (!Project.selected_block) return false;
    var ch = getElement('image_stretch');

    if (ch.checked == true)
    {
        getElement('image_pos_h').disabled = true;
        getElement('image_pos_v').disabled = true;
        Project.selected_block.strechImage(true);
    }
    else
    {
        getElement('image_pos_h').disabled = false;
        getElement('image_pos_v').disabled = false;
        Project.selected_block.strechImage(false);
    }
}

function alignImageHorisontal(type)
{
    if (!Project.selected_block || type == '') return false;
    Project.selected_block.positionContentHorisontal(type);
}

function alignImageVertical(type)
{
    if (!Project.selected_block || type == '')
    {
        return false;
    }

    Project.selected_block.positionContentVertical(type);
}

function setImageBackgroundColor(color)
{
    if (!Project.selected_block) return false;
    Project.selected_block.element.style.backgroundColor = color;
}