class Main {
    constructor() {}
    parse(input) {
        let input_object = BP(input);
        console.log(input_object);
        node_Read(input_object.program);
    }

}

// debug function. 
// run sc.input / sc.read(input) 
// here is the property list you can access to :
// nodeRead | here restore all node processed in sequence
var Sinfo = function () {};
Sinfo.prototype.createList = function (listName, content = null) {
    this[listName] = [];
    content && this[listName].push(content);
};

Sinfo.prototype.push = function (listName, content) {
    this.hasOwnProperty(listName) ? this[listName].push(content) : this.createList(listName, content);
    return;
};
Sinfo.prototype.read = function (listName) {
    if (!listName) {
        return;
    }
    this[listName].forEach(element => {
        console.log(element);
    });
};
var sc = new Sinfo();



/**
 *  if have property then inside read
 * @param {object} node  object to be read   
 * @param {string} nodeProperty property name to be read
 */
function node_inside(node) {
    return function (nodeProperty){

    if (!node[nodeProperty]) {
        return;
    }
    // node[nodeProperty] : Arrary | object | undefined 
    // node[nodeProperty] = Arrary?
    Array.isArray(node[nodeProperty]) ?
        node[nodeProperty].forEach(i => {
            node_Read(i);
        }) : (
            // node[nodeProperty] == object ?
            node[nodeProperty] && node_Read(node[nodeProperty])
        );
    }
}

function node_Read(node) {

    let _ni = node_inside(node);
    //record processed node to Sinfo-sc. type sc.nodeRead  to check 
    sc.push('nodeRead', node);
    
    node.name && pt_e('div',node.name);
    node.value && pt_e('div',node.value);

    _ni('leadingComments');
    _ni('commentsLine');
    _ni('declarations');
    _ni('id');
    _ni('body');
    _ni('innerComments');

}

/**
 * print element to doc / canvas / frame
 * @param {string} type html type {'p' | 'div' | 'span'}
 * @param {string | number} value input value
 */
function pt_e(type, value) {
    document.body.appendChild(element_build(type, value));
}

/**
 * get element
 * @param {string} type html type {'p' | 'div' | 'span'}    
 * @param {string | number } content  input value
 */
function element_build(type, content) {
    let _element = document.createElement(type);
    _element.innerText = content;
    return element_eventBind(_element);
}

function element_eventBind(element) {
    element.addEventListener('dblclick', e => {
        console.log(element.innerText);
    });
    return element;
}

// bind property with element
function element_bindProperty(element, propertyName, value) {
    element[propertyName] = value;
    return;
}

// run test
var main = new Main();
main.parse(
    `// here is the start
    //here is the var a 
    var a = 12;
    // here is function a 
    function a (){
        
        //here is inside of function

    }
    `
);