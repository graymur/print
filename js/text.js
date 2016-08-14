function textBold()
{
    if (!Project.selected_block) return false;

    if (Project.selected_block.element.style.fontWeight == 'bold')
    {
        Project.selected_block.element.style.fontWeight = 'normal';
        getElement('button_bold').className = 'button_up';
    }
    else
    {
        Project.selected_block.element.style.fontWeight = 'bold';
        getElement('button_bold').className = 'button_down';
    }
}

function textItalic()
{
    if (!Project.selected_block) return false;

    if (Project.selected_block.element.style.fontStyle == 'italic')
    {
        Project.selected_block.element.style.fontStyle = 'normal';
        getElement('button_italic').className = 'button_up';
    }
    else
    {
        Project.selected_block.element.style.fontStyle = 'italic';
        getElement('button_italic').className = 'button_down';
    }
}

function textUnderline()
{
    if (!Project.selected_block) return false;

    if (Project.selected_block.element.style.textDecoration == 'underline')
    {
        Project.selected_block.element.style.textDecoration = 'none';
        getElement('button_underline').className = 'button_up';
    }
    else
    {
        Project.selected_block.element.style.textDecoration = 'underline';
        getElement('button_underline').className = 'button_down';
    }
}

function updateBlockText()
{
    if (!Project.selected_block) return false;

    Project.selected_block.setText(getElement('text_insert').value);
}

function setFontFamily()
{
    if (!Project.selected_block) return false;

    Project.selected_block.element.style.fontFamily = getSelectedValue('select_font_family');
}

function setFontSize()
{
    if (!Project.selected_block) return false;

    Project.selected_block.setFontSize(getSelectedValue('select_font_size'));
}

var align_types = ['left', 'center', 'right', 'justify'];

function textAlign(type)
{
    if (!Project.selected_block) return false;

    Project.selected_block.positionContentHorisontal(type);

    for (var i = 0; i < align_types.length; i++)
    {
        getElement('button_align_' + align_types[i]).className = (align_types[i] == type) ? 'button_down' : 'button_up';
    }
}

function setFontColor(color)
{
    if (!Project.selected_block) return false;
    Project.selected_block.element.style.color = color;
}

function setTextBackgroundColor(color)
{
    if (!Project.selected_block) return false;
    Project.selected_block.element.style.backgroundColor = color;
}