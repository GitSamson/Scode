class Main {
    constructor() {}
    parse(input) {
        let input_object = acorn.parse(input);
        node_Read(input_object);
    }

}

// debug function. 
// run sc.input / sc.read(input) 
// here is the property list you can access to :
// nodeRead | here restore all node processed in sequence
var Sinfo = function () {
};
Sinfo.prototype.createList = function (listName, content = null) {
    this[listName] = [];
    content && this[listName].push(content);
};

Sinfo.prototype.push = function (listName, content) {
    this.hasOwnProperty(listName) ? this[listName].push(content) : this.createList(listName, content);
    return;
};
Sinfo.prototype.read = function (listName) {
    if(!listName){return;}
    this[listName].forEach(element => {
        console.log(element);
    });
};
var sc = new Sinfo();



function node_Read(node) {
    //state check
    sc.push('nodeRead', node);

    node.id && document.body.appendChild(canvas_build('p', node.id.name));
    node.declarations && node_Read(node.declarations[0]);
    if (node.body) {
        for (let i = 0; i < node.body.length; i++) {
            const element = node.body[i];
            node_Read(element);
        };
    }
}


function canvas_build(type, content) {
    let _element = document.createElement(type);
    _element.innerText = content;
    return _element;
}

// bind property with element
function canvas_bindProperty(element,propertyName,value){
    element[propertyName] = value;
    return;
}


// run test
var main = new Main();
main.parse(
    `function a(){}; function b(){}; 
    var aa = 12;
    var sb = 13;
    let test = 111;
    `
);