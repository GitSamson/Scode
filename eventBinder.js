var posX, posY;

var eventBinder = {
    hostHtmlNode: null,
    // posX:0,
    // posY:0,
    placeHolder: null,
    dblClick: function (element) {
        let _element = element;
        _element.addEventListener('dblclick', event => {
            event.cancelBubble = true;
            console.log(main.getSourceText(element.start, element.end));

        });
        return _element;
    },
    click: function (element) {
        let _element = element;
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
            console.log('dragstart');
            event.cancelBubble = true;
            eventBinder.hostHtmlNode = element;
            eventBinder.placeHolder = element_build('placeHolder', '');
            eventBinder.placeHolder && console.log('placeHolder created');

            elementNodeStyleHandler(eventBinder.placeHolder)({
                width: getComputedStyle(_element, null).width,
                height: getComputedStyle(_element, null).height,
                left: _element.offsetLeft  + 'px',
                top: _element.offsetTop  +  'px',
                position:'absolute',
            });

            element.parentElement.appendChild(eventBinder.placeHolder);
            console.log('placeHolder appended into body');
            posX = event.x - eventBinder.placeHolder.offsetLeft;
            posY = event.y - eventBinder.placeHolder.offsetTop ;
            console.log(posX, posY);

            document.onmousemove = function (e) {
                // console.log('pos:',posX, ' ', posY);
                // console.log('client',e.clientX, ' ', e.clientY);
                posY<0 && console.log('posY < 0 ?');
                posX < 0 && console.log('posX < 0 ?');

                eventBinder.placeHolder.style.left = (e.clientX - posX) + 'px';
                eventBinder.placeHolder.style.top = (e.clientY - posY) + 'px';
            }

            document.onmouseup = function (event) {
                console.log('mouse up ');
                let htmlNode = eventBinder.hostHtmlNode;
                let _style = elementNodeStyleHandler(htmlNode);
                _style({
                    position: 'absolute',
                    margin: '0px', //IMPORTANT: OTHERWISE IT WILL OFFSET
                    left: eventBinder.placeHolder.style.left,
                    top: eventBinder.placeHolder.style.top,
                    user_select: 'none ',

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
                console.log('reset mouse move and mouse up');
            }
        });
        return _element;
    },

}