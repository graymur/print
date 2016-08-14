var isIE    = !!(navigator.userAgent.toLowerCase().indexOf('msie') >= 0 && document.all);
var isOpera = !!(window.opera && document.getElementById);
var isMoz   = (!isIE && !isOpera);

var gr_sb_container_width = 300, gr_sb_container_height = 35;
var gr_sb_container_id = 'gr_sb_container';
var gr_sb_bar_id = 'gr_sb_bar';
var gr_sb_pointer_id = 'gr_sb_pointer';
var gr_sb_delay = 1, gr_sb_dir = 1, gr_sb_max_r, gr_sb_max_l, gr_sb_bar, gr_sb_pointer, gr_sb_timeout;

function showGrStatusBar()
{
    var doc_w = window.innerWidth || document.body.clientWidth;
    var doc_h = window.innerHeight || document.body.clientHeight;

    var container = document.createElement('div');
    container.id = gr_sb_container_id;
    container.style.width       = gr_sb_container_width + 'px';
    container.style.height      = gr_sb_container_height + 'px';
    container.style.position    = 'absolute';
    container.style.zIndex      = '1000000';
    container.style.left        = Math.round(doc_w/2 - gr_sb_container_width / 2);
    container.style.top         = Math.round(doc_h/2 - gr_sb_container_height / 2);

    container.appendChild(document.createTextNode('Please wait...'));

    document.getElementsByTagName('BODY')[0].appendChild(container);

    gr_sb_bar = document.createElement('div');
    gr_sb_bar.id = gr_sb_bar_id;
    gr_sb_bar.position    = 'relative';
    gr_sb_bar.style.width = Math.round(gr_sb_container_width * 0.8) + 'px';

    if (isIE)
    {
        gr_sb_bar.style.left = Math.round(gr_sb_container_width / 2 - parseInt(gr_sb_bar.style.width) / 2) + 'px'
    }
    else
    {
        gr_sb_bar.style.marginLeft = Math.round(gr_sb_container_width / 2 - parseInt(gr_sb_bar.style.width) / 2) + 'px'
    }

    gr_sb_max_l = 0;
    gr_sb_max_r = parseInt(gr_sb_bar.style.width);

    container.appendChild(gr_sb_bar);

    var bar_height = !isMoz ? 10 : parseInt(window.getComputedStyle(gr_sb_bar, null).getPropertyValue('height'));

    gr_sb_pointer = document.createElement('div');
    gr_sb_pointer.id  = gr_sb_pointer_id;
    gr_sb_pointer.style.width     = Math.round(parseInt(gr_sb_bar.style.width) * 0.3) + 'px';
    gr_sb_pointer.style.height    = bar_height + 'px';
    gr_sb_pointer.style.position  = 'relative';
    gr_sb_pointer.style.left      = '0px';

    gr_sb_bar.appendChild(gr_sb_pointer);

    gr_sb_timeout = setTimeout(moveGRPointer, gr_sb_delay);
}

function moveGRPointer()
{
    var property = 'left';
    var left = parseInt(gr_sb_pointer.style['left']);

    gr_sb_pointer.style[property] = (parseInt(gr_sb_pointer.style[property]) + (gr_sb_dir == 1 ? 1 : -1)) + 'px';

    if (gr_sb_dir == 1)
    {
        if (left + gr_sb_pointer.offsetWidth == gr_sb_max_r - 1) gr_sb_dir = 0;
    }
    else
    {
        if (left == gr_sb_max_l + 1) gr_sb_dir = 1;
    }

    gr_sb_timeout = setTimeout(moveGRPointer, gr_sb_delay);
}

function removeGrStatusBar()
{
    var container = document.getElementById(gr_sb_container_id);

    if(container == undefined) return false;

    clearTimeout(gr_sb_timeout);
    container.parentNode.removeChild(container);
    gr_sb_dir     = 1
    gr_sb_bar     = false;
    gr_sb_pointer = false;
}