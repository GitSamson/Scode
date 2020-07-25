/**
 * print element to doc / canvas / frame
 * @param {string} style_name html type {'unit' | 'placeholder'} : please refer to style.js
 * @param {string | number} value input value
 */
function pt_e(style_name, value) {
    let _e = element_build(style_name, value);
    document.body.appendChild(_e);
    return _e;
}

/**
 * get element
 * @param {string} style_name html type {'unit' | 'placeholder'} : please refer to style.js    
 * @param {string | number } content  input value
 */
function element_build(style_name, content) {
    let _s = styleLib[style_name];
    let _element = document.createElement(_s.type);
    _element.className = _s.css;
    _element.innerText = content;
    return element_eventBind(style_name, _element);
}

function element_eventBind(style_name, element) {
    let _element = element;
    let _s = styleLib[style_name];

    _s.events && _s.events.forEach(i=>{
        _element = eventBinder[i](_element);
    });

    return _element;
}

// bind property with element
function element_bindProperty(element, propertyName, value) {
    element[propertyName] = value;

    return;
}


var elementNodeStyleHandler = function (Node) {
    let node = Node;
    return function (styleName, content = null) {
        if (content) {
            node.style[styleName] = content;
        } else {
            Object.keys(styleName).forEach(i => {
                node.style[i] = styleName[i];
            });
        }
        return node;
    }
}