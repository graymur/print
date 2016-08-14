var ratio           = 0;
var px_multiplier   = 118; // pixels in 1 cm
var selected_page   = false;
var default_border  = 'gray';
var ruler_dimension = 20;
var current_format;
var resize_rectangles;
var pageDumpAttributes = [
    'cmmarginleft',
    'cmmarginbottom',
    'cmmarginright',
    'cmmargintop',
    'xdirection',
    'xratio',
    'xformat'
];

var blockDumpAttributes = [
    'xGroupId',
    'xGroupName',
    'xBlockName'
];

var fontsList = [
    'Arial',
    'Century Gothic',
    'Comic Sans MS',
    'Courier New',
    'Geneva',
    'Georgia',
    'Helvetica',
    'Palatino Linotype',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana'
];

fontsList.sort();

var Formats =
{
    A4 : [2480, 3508],
    A5 : [1000, 1415],
    A6 : [500, 705],
    A7 : [400, 564]
};

var def_font_size_attr = 'xDefaultFontSize';
var DEFAULT_FONT_SIZE = '50px';

//var Formats =
//{
//    A4 : [595, 842],
//    A5 : [421, 595],
//    A6 : [297, 421],
//    A7 : [501, 709]
//};