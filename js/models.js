function photoalbum()
{
    Project = new ProjectClass('A4', 2, 'horisontal');
    Project.setRatio(20);
    Project.setMargins(1,1,1,1);

    var options = new BlockOptionsClass();

    options['left']     = '25%';
    options['top']      = '5%';
    options['width']    = '50%';
    options['height']   = '60%';

//    options.addChild(document.createTextNode('Insert your image here'));

    options.addStyle('text-align', 'center');
    options.addStyle('font-weight', 'bold');
    options.addStyle('font-family', 'Georgia');
    options.addStyle('font-size', '18px');
    options.addStyle('vertical-align', 'middle');
    options.addStyle('font-variant', 'small-caps');
    options.addStyle('background-image', 'URL(test.jpg)');
    options.addStyle('background-position', 'center');
    options.addStyle('background-repeat', 'no-repeat');

    Project.BlockManager.imageBlock(options);

    var options = new BlockOptionsClass();
    options['left']     = '5%';
    options['top']      = '75%';
    options['width']    = '90%';
    options['height']   = '20%';

    options.addChild(document.createTextNode('Photo description'));

//    var div = document.createElement('div');
//    div.style.margin        = '5px';
//    div.style.fontSize      = '10px';
//    div.style.textAlign     = 'justify';
//    div.style.fontWeight    = 'normal';
//    div.style.color         = 'black';
//    div.style.fontFamily    = 'Palatino Linotype';
//    div.style.textTransform = 'none';
//    div.appendChild(document.createTextNode('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.'));
//
//    options.addChild(div);

    options['xDefaultFontSize'] = '100px';
    options.addStyle('text-align', 'center');
    options.addStyle('font-weight', 'bold');
    options.addStyle('font-family', 'Georgia');
//    options.addStyle('font-size', '20px');
    options.addStyle('text-transform', 'capitalize');
    options.addStyle('color', '#FF0000');

    Project.BlockManager.textBlock(options);
}

function calendar()
{
    var Months =
    {
        1  : 'January',
        2  : 'February',
        3  : 'March',
        4  : 'April',
        5  : 'May',
        6  : 'June',
        7  : 'July',
        8  : 'August',
        9  : 'September',
        10 : 'October',
        11 : 'November',
        12 : 'December'
    };

    var DaysOfWeek =
    {
        1  : 'Mon',
        2  : 'Tue',
        3  : 'Wed',
        4  : 'Thu',
        5  : 'Fri',
        6  : 'Sat',
        7  : 'Sun'
    };

    var first_year = 1971;
    var last_year = (new Date).getFullYear() + 20;

    do
    {
        var year = prompt('Choose year: (between ' + first_year + ' and ' + last_year + ')');
    }
    while (!(_parseInt(year) > first_year && _parseInt(year) <= last_year));

//    var year = 2006;

    Project = new ProjectClass('A5', 12, 'horisontal');
    Project.setRatio(30);
    Project.setMargins(0,0,0,0);

    var bOptions = new BlockOptionsClass();
    bOptions['left']     = '35%';
    bOptions['top']      = '10%';
    bOptions['width']    = '30%';
    bOptions['height']   = '10%';

    bOptions.addStyle('text-align', 'center');
    bOptions.addStyle('font-weight', 'bold');
    bOptions.addStyle('font-family', 'Palatino Linotype');
    bOptions.addStyle('font-size', '70px');
    bOptions.addStyle('font-style', 'italic');

    Project.BlockManager.textBlock(bOptions);

    var bOptions = new BlockOptionsClass();
    bOptions['left']     = '5%';
    bOptions['top']      = '45%';
    bOptions['width']    = '90%';
    bOptions['height']   = '50%';
    bOptions.addStyle('font-family', 'Palatino Linotype');
    bOptions.addStyle('font-size', '70px');
    bOptions.addStyle('font-style', 'italic');

    Project.BlockManager.textBlock(bOptions);

    var eu = true;

    var old = document.getElementById('gr_calendar');

    if (old != undefined)
    {
        old.parentNode.removeChild(old);
    }

    setSelectedOption('bg_pos_v', 'top');
    setSelectedOption('bg_pos_h', 'left');
    setSelectedOption('bg_repeat', 'no-repeat');

    for (var m = 0; m < 12; m++)
    {
        var table = document.createElement('table');
        table.style.fontSize = '45px';
        table.setAttribute(def_font_size_attr, table.style.fontSize);
        table.style.fontFamily = 'Palatino Linotype';
//        table.style.fontStyle = 'italic';
        table.style.width = '100%';

        Project.addElementWithText(table);

        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        var tr = document.createElement('tr');
        var td = document.createElement('td');

        var tr = document.createElement('tr');

        for (var i = 1; i <= 7; i++)
        {
            var td = document.createElement('td');
            td.style.fontWeight = 'bold';
            td.style.fontStyle = 'italic';
            td.style.textAlign = 'center';
            td.style.width = '14%';

            td.style.color = (i == 6 || i == 7) ? '#FF0000' : '#000000';

            td.appendChild(document.createTextNode(DaysOfWeek[i]));

            tr.appendChild(td);
        }

        tbody.appendChild(tr);

        var dwc = 0;

        var MD = new Date(year, (m - 1));

        var days_in_month = MD.getUTCDate();

        var tr = document.createElement('tr');

        for (d = 1; d <= days_in_month; d++)
        {
            var DT = new Date(year, m, d);
            var dow = DT.getDay();

            if (eu)
            {
                dow = (dow == 0) ? 6 : (dow - 1);
            }

            if (d == 1)
            {
                for (var i = 0; i < dow; i++)
                {
                    var td = document.createElement('td');
                    td.appendChild(document.createTextNode(' '));
                    tr.appendChild(td);
                }

                dwc = i;
            }

            var td = document.createElement('td');
            td.style.textAlign = 'center';
            td.style.fontStyle = 'italic';

            td.style.color = (dwc == 5 || dwc == 6) ? '#FF0000' : '#000000';

            td.appendChild(document.createTextNode(d.toString()));
            tr.appendChild(td);

            if (d == days_in_month)
            {
                for (var i = dow; i < 6; i++)
                {
                    var td = document.createElement('td');
                    td.appendChild(document.createTextNode(''));
                    tr.appendChild(td);
                }

                dwc = i;
            }

            if (dwc == 6)
            {
                tbody.appendChild(tr);
                dwc = 0;
                var tr = document.createElement('tr');
            }
            else
            {
                dwc++;
            }
        }

        var page_body = Project.pages[m].body;

        Project.pages[m].setBGImage('cal_bg_1.gif', 'body');

        page_body.childNodes[0].appendChild(document.createTextNode(Months[m + 1]));
        page_body.childNodes[1].appendChild(table);

        Project.addElementWithText(page_body.childNodes[0]);
    }

    Project.updateFontSize(Project.ratio);
}