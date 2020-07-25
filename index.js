class Main {
    constructor() {
        this.sourceText;
    }
    parse(input) {
        if(!input){return;}
        this.sourceText = input;
        let input_object = BP(input);
        node_Read(input_object.program);
    }
    getSourceText(loc_start, loc_end){
        return this.sourceText.slice(loc_start,loc_end);
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