var eventBinder = {
    hostHtmlNode: null,
    // posX:0,
    // posY:0,
    placeHolder: null,
    dblClick : function(element){
        let _element = element;
        _element.addEventListener('dblclick',event =>{
            event.cancelBubble = true;
            console.log(element.start, element.end);
        });
        return _element;
    },
    click: function (element) {
        let _element = element ;
        _element.addEventListener('click', event => {
            event.cancelBubble = true;
            console.log(element);
        });
        return _element;
    },
    drag: function (element) {
        let _element = element;
            _element.draggable = true;

        _element.addEventListener('dragstart', event => {
        event.cancelBubble = true;
        this.hostHtmlNode = _element;

        this.placeHolder = element_build('placeHolder',element.innerText);

        elementNodeStyleHandler(eventBinder.placeHolder)({
            position: 'absolute',
            width: getComputedStyle(_element, null).width,
            height: getComputedStyle(_element, null).height,
            left: _element.offsetLeft + 'px',
            top: _element.offsetTop + 'px',
            user_select : 'none',
            cursor : 'move'
        });

        _element.parentElement.appendChild(eventBinder.placeHolder);

        posX = event.x - eventBinder.placeHolder.offsetLeft;
        posY = event.y - eventBinder.placeHolder.offsetTop;

        document.onmousemove = function (e) {
            eventBinder.placeHolder.style.left = (e.clientX - posX) + 'px';
            eventBinder.placeHolder.style.top = (e.clientY - posY) + 'px';
        }

        document.onmouseup = function (event) {
            let htmlNode = eventBinder.hostHtmlNode;

            let _style = elementNodeStyleHandler(htmlNode);
            event.cancelBubble = true;
            _style({
                position: 'absolute',
                margin: '0px', //IMPORTANT: OTHERWISE IT WILL OFFSET
                left: eventBinder.placeHolder.style.left,
                top: eventBinder.placeHolder.style.top
            });

            if (eventBinder.hostHtmlNode.style.position == 'absolute' &&
                eventBinder.hostHtmlNode.offsetTop < 100 &&
                eventBinder.hostHtmlNode.offsetLeft < 100
            ) {
                _style({
                    position: 'relative',
                    top: '0px',
                    left: '0px',
                    margin: '15px'
                })
            }
            htmlNode.parentElement.removeChild(eventBinder.placeHolder);
            document.onmousemove = null;
            document.onmouseup = null;
        }
        });
        return _element;
    },
    showSourceText: function (e) {
        e.cancelBubble = true;
        let htmlNode = e.currentTarget;
        let ASTunit = ASTPool.get(e.target.id);
        if (e.target.id === undefined) {
            return
        }
        ASTunit.detail === 0 && function () {
            htmlNode.innerHTML = unitRender.text(ASTunit.getText()).innerHTML;
            ASTunit.detail = !ASTunit.detail;
        };
        ASTunit.detail === 1 && function () {
            ASTunit.detail = !ASTunit.detail;
            htmlNode.innerHTML = draw.span(ASTunit.type.name, 'title');

        }
    },
    appendSourceText: function (e) {
        let htmlNode = e.currentTarget;
        let ASTunit = ASTPool.get(e.currentTarget.id);
        ASTunit.detail === 0 ? function () {
            htmlNode.innerHTML = ''; //clear content
            htmlNode.innerHTML = sM.detail_text.fn(ASTunit).innerHTML;
            // body frame div
            ASTunit.detail = 1;
        }() : function () {
            htmlNode.innerHTML = '';
            htmlNode.innerHTML = sM.presentMode.active().fn(ASTunit).innerHTML;
            // htmlNode.appendChild(_rend.head);
            ASTunit.detail = 0;
        }();

    }
}