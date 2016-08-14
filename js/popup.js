function PopupManagerClass ()
{
    this.popups = new Array();
    this.last;
    this.zIndex = 10000;
    this.tipZIndex = 20000;
    this.move = true;
    this.default_width = 300;

//    this.create = function ()
//    {
//    };

    this.openById = function (element_id)
    {
        this.createFromDOM(getElement(element_id));
        this.last.open();
    };

    this.createFromDOM = function (DOMElement)
    {
        if ((popup = this.getPopupById(DOMElement.id)))
        {
            this._close(popup);
            return false;
        }

        DOMElement.className += ' popup ' + ddClassName;

        var Popup = new PopupClass;
        Popup.id = DOMElement.id;
        Popup.container = document.body;
        Popup.setPredefinedElement(DOMElement);
        Popup.width = this.default_width;
        Popup.managerObject = this;

        this.popups.push(Popup);
        this.last = Popup;
    };

    this.close = function (e)
    {
        var popup = getElement(__EVENT.srcElement.parentNode.getAttribute('xPopupId'));
        popup.popupObject.managerObject._close(popup.popupObject);
    };

    this.closeById = function (popup_id)
    {
        var popup = this.getPopupById(popup_id);
        this._close(popup);
    };

    this._close = function (popup)
    {
        var popups = new Array;

        for (var i = 0; i < this.popups.length; i++)
        {
            if (this.popups[i] != popup)
            {
                popups.push(this.popups[i]);
            }
        }

        this.popups = popups;
        popup.close();
    };

    this.getPopupById = function (id)
    {
        for (var i = 0; i < this.popups.length; i++)
        {
            if (this.popups[i].id == id)
            {
                return this.popups[i];
                break;
            }
        }

        return false;
    };

    this.showHint = function (e)
    {
        var popup = getElement(__EVENT.srcElement.parentNode.getAttribute('xPopupId'));

        tip_id = 'js_tip_' + popup.id;

        var tip = getElement(tip_id);

        if (tip.parentNode)
        {
            removeNode(tip);
            return false;
        }

        if (!Lang[tip_id] || Lang[tip_id] == '') tip_id = 'js_tip_undefined';

        var tip = createElement('div');
        tip.id = tip_id;
        tip.className = 'tip ' + ddClassName;
        tip.style.zIndex = ++PopupManager.tipZIndex;

        var text = createElement('div');
        text.className = 'hint_text';
        text.innerHTML = Lang[tip_id].replace("\n", '<br><br>');

        var close = createElement('input');
        close.type = 'button';
        close.value = Lang['js_close'];
        close.setAttribute('xTipId', tip.id);
        close.onclick = function (e)
        {
            removeNode(__EVENT.srcElement.parentNode);
        };

        appendChild(tip, text);
        appendChild(tip, close);

        appendChild(document.body, tip);

        centerElement(tip);

//        for (var i = 0; i < document.body.childNodes.length; i++)
//        {
//            if (!document.body.childNodes[i].style || document.body.childNodes[i].id == 'hint')
//            {
//                continue;
//            }
//
//            document.body.childNodes[i].style.opacity = '0.3';
//            document.body.childNodes[i].style.filter = "Alpha(opacity=30)";
//        }
    };
}

function PopupClass ()
{
    this.managerObject;
    this.popupObject;
    this.id;
    this.container = document.body;
    this.className;
    this.show_buttons = true;
    this.predefined = false;
    this.popup = false;
    this.width = 300;
    this.ceter_position = true;
    this.buttons;
    this.background;
    this.btn_background;
    this.background_dim = 4;

    this.setClassName = function (className)
    {
        this.className = className;
    };

    this.setInnerHTML = function (HTML)
    {
        this.container.innerHTML = HTML;
    };

    this.setPredefinedElement = function (DOMElement)
    {
        this.popup = DOMElement;
        this.predefined = true;
    };

    this.open = function ()
    {
        this.popup.popupObject = this;
        this.popup.style.display = 'block';
//        this.setZIndex();

        if (!this.popup.style.width)
        {
            this.popup.style.width = this.width + '';
        }

        if (!this.popup.parentNode)
        {
            appendChild(this.container, this.popup);
        }

        centerElement(this.popup);
        this.addButtons();
    };

    this.addButtons = function ()
    {
        this.buttons = createElement('div');
        this.buttons.className = 'window_buttons';
        this.buttons.style.position = 'absolute';
        this.buttons.setAttribute('xPopupId', this.popup.id);

        var hint = createElement('img');
        hint.src = 'images/tip.gif';
        hint.onclick = this.managerObject.showHint;

        var cross = createElement('img');
        cross.src = 'images/close.gif';
        cross.onclick = this.managerObject.close;

        appendChild(this.buttons, hint);
        appendChild(this.buttons, cross);

        appendChild(document.body, this.buttons);

        this.background = createElement('div');
        this.background.className = 'popup_background';
        appendChild(document.body, this.background);

        this.btn_background = createElement('div');
        this.btn_background.className = 'popup_background';
        appendChild(document.body, this.btn_background);

        this.positionButtons();
    };

    this.positionButtons = function ()
    {
        this.buttons.style.left = (this.popup.offsetLeft + this.popup.offsetWidth - this.buttons.offsetWidth - 1) + 'px';
        this.buttons.style.top = (this.popup.offsetTop - this.buttons.offsetHeight) + 'px';

        this.background.style.left   = _parseInt(this.popup.style.left) + this.background_dim + 'px';
        this.background.style.top    = _parseInt(this.popup.style.top) + this.background_dim + 'px';
        this.background.style.width  = _parseInt(this.popup.offsetWidth) /*+ this.background_dim * 2*/ + 'px';
        this.background.style.height = _parseInt(this.popup.offsetHeight) /*+ this.background_dim * 2*/ + 'px';

        this.btn_background.style.left   = _parseInt(this.buttons.style.left) + this.background_dim + 'px';
        this.btn_background.style.top    = _parseInt(this.buttons.style.top) + this.background_dim + 'px';
        this.btn_background.style.width  = _parseInt(this.buttons.offsetWidth) /*+ this.background_dim * 2*/ + 'px';
        this.btn_background.style.height = _parseInt(this.buttons.offsetHeight) /*+ this.background_dim * 2*/ + 'px';

        this.setZIndex();
    };

    this.close = function ()
    {
        if (this.predefined)
        {
            this.popup.style.display = 'none';
            this.popup.popupObject = null;
        }
        else
        {
            removeNode(this.popup);
        }

        removeNode(this.buttons);
        removeNode(this.background);
        removeNode(this.btn_background);
    };

    this.setZIndex = function ()
    {
        PopupManager.zIndex += 2;

        this.popup.style.zIndex          = PopupManager.zIndex;
        this.buttons.style.zIndex        = this.popup.style.zIndex;
        this.background.style.zIndex     = this.popup.style.zIndex - 1;
        this.btn_background.style.zIndex = this.popup.style.zIndex - 1;
    }
}