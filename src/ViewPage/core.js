
'use strict';


function postMsg(line, character) {
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ line, character });
}

// Handle the message inside the webview


window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    setup(message); // initialize data, rebuild code structure
});



/**
 * Initial whole process
 * @function
 */
function setup(content) {
    let _result = ASThandler(content);
    let container = document.getElementById('container');
    let container_ed = document.getElementById('container_end');

}


/* ||||||||||||||||||||||||||||||||||| Text handle functions||||||||||||||||||||||||||||||||||||*/
/**
 * Text handler
 * @function
 * RegExp extension
 */
var reg = {
    /**
    * search regExp in whole string, will return a list for all information
    * @param {string} source source input text
    * @param {RegExp} k searching keyword.
    * @retrun {[]} list for all information in sourceText.['result-1','result-2',...]
    */
    list: function (source, k) {
        let _key = new RegExp(k, 'g');
        //Attention: Here must be 'g' as attr, otherwise only output first result;
        let _result = [];
        let _s = source;
        let _item = _key.exec(_s);
        let _check = 10;
        while (_item != null && _check > 0) {
            _check -= 1;
            // _result.push(_item);
            _result.push(_item);
            _item = _key.exec(_s);// Attention sequence with push.
        }
        return _result;
    },
    keyList: function (source, k) {
        let _fullList = this.list(source, k);
        let _result = { result: [], groups: [], index: [], input: [], length: [] };
        _fullList.forEach(element => {

            _result.result.push(element[0])
            _result.groups.push(element.groups);
            _result.index.push(element.index);
            _result.input.push(element.input);
            _result.length.push(element.length);
        });
        return _result;
    },

    /** get RegExp instance between Beginning and end keywords;
     * @param {string} beginning beginning keyword
     * @param {string} end end keyword
     * @returns {RegExp} retrun RegExp instance;
     */
    regBetween: function (beginning, end) {
        let _source = '(?<=' + beginning + ').*?(?=' + end + ')';
        return new RegExp(_source, 'g');
    }
}
/** content comparison function
 * 
 */
var contentComparison = {


}
/** get line from block.
 */
var lineHandler = {
    lineMarker: '\n',
    list: [],
    /** reset line marker pool. 
    * @returns return marker list.
    */
    refresh: function () {
        this.list = [];
        return this.list;
    },
    /** update line marker list pool
    * @param {number} beginning updating start index of source text.
    * @param {number} end updating end index in source text.
    * @return {[]} return lineHandler.list.
    */
    update: function (source, beginning = 0, end = null) {

        let _source = end != null ? source.slice(beginning, end) : source;

        let updateContent = reg.keyList(_source, this.lineMarker);

        // find location for beginning and end in list.
        let _range_st = index.divisionFind(this.list, beginning);
        let _range_ed = index.divisionFind(this.list, end);

        //update list
        this.list.splice(_range_st, _range_ed - _range_st, [...updateContent.index]);

        return this.list;

    },
    get: function (indexCheck) {
        // each update will compare where updated, take out updating lines marker do insert/delete in list;
        // if index less than last item in list, then check where is the index, return its index in list.
        // else: generate following index list, to indexCheck.

        let _lastIndexInList; // get last index in list.
        // list is empty last index is 0 , else is last item in list.
        if (this.list.length == 0) {
            _lastIndexInList = 0;
        } else {
            _lastIndexInList = this.list[this.list.length - 1];
        }

        // indexCheck already had in list then return it.
        // else push line markers from last one to indexCheck.
        if (_lastIndexInList >= indexCheck) {

        }

    },

};

// extension of get line function. provide functions of how to locate where index 
var indexLocate = {
    /** function of division find.
    @param {[]} list where this function find from 
    @param {number} key finding key.
    @returns {number} index where the key is or where it should be.
    */
    divisionFind: function (list, key) {
        if (list.length == 0) { return; }

        let _l = list;

        // if length <= 3 use beginningFind function.
        if (_l.length <= 3) {
            return this.beginningFind(list, key);
        }

        let _OverRange = (key > _l[_l.length - 1] && _l.length) || (key < _l[0] && 0);
        if (_OverRange !== false) { return _OverRange; }
        let _left = 0; // left pointer 
        let _over = 12;
        let _right = _l.length - 1; // right pointer
        let _indexPointer; // mid index 
        do {
            _indexPointer = ((_right - _left) % 2 == 0) ? ((_right - _left) / 2 + _left) : ((_right - _left - 1) / 2 + _left);
            _over -= 1;
            if (_over == 0) {
                throw ('over while');
            }

            // if mid is result then just return mid.
            if (_l[_indexPointer] == key) {
                return _indexPointer;
            }
            // mid > finding key, result on the left
            if (key < _l[_indexPointer]) {

                _right = _indexPointer;
            } else if (key > _l[_indexPointer]) {
                _left = _indexPointer;
            }
            // two index ?  get smaller one, cause it will repalce the larger one in result.
        } while (_right - _left > 2);

        let _result;
        if (key == _l[_left] | key == _l[_right] | key == _l[_indexPointer]) {

            _result = key == _l[_left] ? _left : key == _l[_right] ? _right : _indexPointer;
            return _result
        }

        _result = key < _l[_indexPointer] ? _indexPointer : _right;

        return _result;
    },
    beginningFind: function (list, key) {
        let _resultIndex = 0;
        if (this.list.length == 0) { return 0; }

        while (_resultIndex < list.length) {
            if (element == key) {
                return _resultIndex;
            }

            // element same as key | element < result < element[i+1];
            if ((list[_resultIndex] < key && list[_resultIndex + 1] > key)) {
                return _resultIndex + 1;
            }

            // if 2th of last still not match, means result should in the last of list. return last index +1/
            if (_resultIndex == list.length - 2) { return list.length }

            _resultIndex += 1;
        }
    }

}

//-------------------------------------------------------

//                  ASThandler

//-------------------------------------------------------

/**
 *  AST handler Main function
 */
function ASThandler(input) {
    let _result = AST.tokenize(input);

    _result = AST.onionize(_result);

    let diagram = new Diagram(document.getElementById('container'));
    diagram.update(_result);

    return _result;

}

function toArray(input) {
    let result = input;
    if (!result) {
        return false;
    }
    result = Array.isArray(result) ? result : [result];
    return result;
}

//-------------------------------------------------------

//                  AST_TYPE_REGISTER

//-------------------------------------------------------

/**
 * AST type register for instance types
 */
class AST_Type_Register {
    constructor(
        attr = {
            typeIndicator: 'unknown',
            name: 'unknown',
            start: '',
            end: '\n'
        },
        prop = {},
    ) {
        this.index = {};
        this.typeIndicator = attr.typeIndicator;
        this.name = attr.name;
        this.end = toArray(attr.end) || [';', '\n'];
        this.start = attr.start;
        this.prop = prop;
    }
    endCheck(input) {
        if (Array.isArray(this.end)) {
            return this.end.includes(input);
        }

        return input == this.end;
    }
    startCheck(input) {
        if (!this.start) { return; }
        if (Array.isArray(this.start)) {
            let _r = this.start.includes(input);
            return (_r);
        }

        return (input == this.start);
    }

}
//-------------------------------------------------------

//                  TYPEMARKER

//-------------------------------------------------------
class Constructor{
    constructor(){

    }
}
class SyntaxType{
    constructor(structure){
        this.structure = structure;
        this.index = 0;
    }
    push(current){
        if(current === this.structurt[this.index]){
            this.index++;
            return;
        }
        // Here should save into this property
        // pushed current wont be string all the time, if have bracket should stack somehow.
        

    }
}

/**
 * types save all Syntax types structure.
 */
var types = {
    variable: new SyntaxType([properties.name , '=',properties.value]),

    function : new SyntaxType([
        properties.name,
         '(', properties.param,')',
         '{',properties.statement,'}'
        ]),

    class : new SyntaxType([
        properties.name,
        '{',properties.statement,'}'
    ]),
    expression : new SyntaxType([
        '(',
        properties.statement,
        ')'
    ])
}


/**
 * Baisc unit to have instances for properties.
 * each Property has own syntax analysis/ state check / manage input..
 */
class Property {
    constructor(){
        
    }
    text(){}
    push(input){}
}
/**
 * Properties library 
 * basic unit for syntax 
 */
var properties = {
    arguements: new Property(),
    body:new Property(),
    description: new Property(),
    name : new Property(),
    value : new Property(),
    statement: new Property()
}

var propDetect = {
    conditionDetect: function (propName, start, end, condition, currentPush) {

        if (this.prop[propName] == undefined) {
            // initial condition
            if (currentPush !== start) { return; } else {
                // avoid body include other ( condition )
                if (condition && currentPush==start) {
                    this.prop[propName] = [];
                }
            }
        } else {

            if (this.prop[propName][this.prop[propName].length -1] === null) {
                return;
            } else {
                // use null as end mark for param list
                currentPush === end ?
                    this.prop[propName].push(null) :
                    this.prop[propName].push(currentPush)
            }
        }
    },
    nameDetect: function (keyword, currentPush) {
        var currentPush = currentPush;
        if (this.prop.name !== undefined) return;
        if(Array.isArray(keyword)===true){
            for (let i = 0; i < keyword.length; i++) {
                const element = keyword[i];
                if (this.body[this.body.length-1] == element) {
                    this.prop.name = currentPush;
                }
            }
        }
        else{
            if(this.body[this.body.length - 1] == keyword) {
                this.prop.name = currentPush;
            }
        }
    },
    arguementsDetect: function(){

    }
}


/**
 * for generate AST unit, can be lines/ block
 */
var typeMarker = {
    
    startCheck: function (input) {

        let _in = input;
        let _result = false;
        for (const i in this) {
            if (this.hasOwnProperty(i)) {
                const element = this[i];
                if (element instanceof AST_Type_Register) {
                    if (element.startCheck(_in) == true) {
                        _result = element;
                        break;
                    }
                }

            }

        }
        return _result;
    },
    function: new AST_Type_Register({
        typeIndicator: 'function_Indicator',
        name: 'function',
        start: 'function',
        end: '}',
        block: true
    }, {
        name: function (currentPush) {
            typeMarker.nameDetect.call(this, 'function', currentPush);
        },
        param: function (currentPush) {

            typeMarker.conditionDetect.call(this,
                'param',
                '(',
                ')',
                this.body[this.body.length - 2] == 'function',
                currentPush);
        },
        body: function (currentPush) {

            typeMarker.conditionDetect.call(this,
                'body',
                '{',
                '}',
                this.body[this.body.length - 1] === ')',
                currentPush)
        },

    }),

    class: new AST_Type_Register({
        typeIndicator: 'class_Indicator',
        name: 'class',
        start: 'class',
        end: '}',
        block: true
    }, {
        name: function (currentPush) {
            typeMarker.nameDetect.call(this, this.type.start, currentPush);
        }
        ,
        param: function (currentPush) {
            typeMarker.conditionDetect.call(this, 'param',
                '(',
                ')',
                this.body && this.body[this.body.length - 2] === 'constructor',
                currentPush);
        },
    }),
    variable: new AST_Type_Register({
        typeIndicator: 'variable_Indicator',
        name: 'variable',
        start: ['var', 'let', 'const'],
        end: [';', '\n'],
        block: false
    }, {
        name: function (currentPush) {
            typeMarker.nameDetect.call(this,this.type.start,currentPush);
        }
    }),
    description: new AST_Type_Register({
        typeIndicator: 'description',
        name:'description',
        start:'/**',
        end:'*/',
    },{
        name : function(currentPush){
            typeMarker.nameDetect.call(this,'*',currentPush);
        }
    }),
    annotation: new AST_Type_Register({
        typeIndicator: 'annotation',
        name: 'annotation',
        start: '//', 
        end: '\n',
        block: false
    }),
    expression: new AST_Type_Register({
        typeIndicator: 'command',
        name: 'command',
        start: false,
        end: '',
        block: false
    })
};
class SymbolMark {
    constructor(symbol = null) {
        this.symbol = symbol;
    }
}
var specialMarker = {
    start: new SymbolMark(),
    end: new SymbolMark(),
}

//-------------------------------------------------------

//                  AST_UNIT

//-------------------------------------------------------


class AST_Unit {
    constructor() {
        this.body_content = [];
        this.body_units = [];
        this.body = [];
        this.type;
        this.detail = 0;
        this.id = ASTPool.push(this);
        this.prop = {};
        this.parent = null;
        this.index = 0;
    }
    getBodyElements() {

        let _result = new String();


        for (let i = 0; i < this.body.length; i++) {

            let element = this.body[i];
            if (typeof (element) == 'object') {
                _result = _result + (element.getBodyElements());
            } else {
                if (_result[_result.length - 1] != '\n') {
                    _result += ' '
                }

                _result += element;
            }
        }

        return _result;
    }

    push(content) {
        if (this.type !== undefined) {
            this.type.prop && Object.values(this.type.prop).forEach(function (i) {
                i.call(this, content);
            }, this);
        }

        this.body.push(content);
        if (typeof (content) == 'string') {
            this.body_content.push(content);
        } else if (content instanceof AST_Unit == true) {
            this.body_units.push(content);
        }

    };
    /**
     * analysis is for content analysis after whole body finish;
     */
    analysis() {
        if(this.parent){
            this.previousUnit = this.index==0 ? 
            this.parent.body[this.parent.body.length-2] :
            this.parent.body[this.index-1];
        }
        if(this.previousUnit instanceof AST_Unit){
            
            if(this.previousUnit.type == typeMarker.description){
                this.prop.description = this.previousUnit;
            }
            
        }
        
    }
    do(command) {
        if (this.type[command]) {
            return this.type[command].call(this);
        }
    }
    /** type check prototype function
     * @returns false | type
     */
    getType(content = null) {


        if (!content) { return typeMarker.expression }

        let _type = typeMarker.expression;

        for (let i in typeMarker) {
            let _e = typeMarker.startCheck(content);
            if (_e) {
                _type = typeMarker[i]; // return type instance
                break;
            }
        }
        return _type;
    }
    endCheck(input) {
        if (!this.type) {
            if (input == '\n' | input == ';') {
                return true;
            }
        } else {
            return this.type.endCheck(input);
        }
    }
    getContentNode() {
        this.type.renderNode(this);
    }

    renderNode() {
        return sM.presentMode.active().fn(this);
    }
    getText() {
        let _result = [];
        this.body.forEach(i => {
            if (typeof (i) == 'string') {
                i !== '\n' ? _result.push(i + ' ') : _result.push(i);

            } else {
                _result = _result.concat(i.getText());
            }
        });
        return _result;
    }
}

//-------------------------------------------------------

//                        _AST 

//-------------------------------------------------------


var AST = {
    breaker: ['{', '}', ';', '(', ')', '='],
    /** replace key symbol with space
    */
    tokenize: function (input) {
        let _result = input.replace(/\n/g, ' \n ');
        // _result = _result.replace(/,/g, ' ');


        let _symbol = this.breaker;

        for (let i = 0; i < _symbol.length; i++) {
            let element = _symbol[i];
            let _replace = new RegExp('\\' + element, 'gm');
            // attention here, need double \ to make it works.
            _result = _result.replace(_replace, ' ' + element + ' ');
        };
        _result = _result.split(' ');

        _result = _result.filter(i => i);
        return _result;
    },
    /**
     * make cuted string have array structure
     * @param {[]} input expect result from tokenize
     */
    onionize: function (input) {

        let _source = input;
        let _result = [];
        let _unit;
        while (_source != false) {
            _unit = this.readSource(_source, true);
                        
            _unit != false && function(){
                if(_unit instanceof AST_Unit ){
                    _unit.previousUnit = _result[_result.length-1];
                }
                _unit.analysis();
                _result.push(_unit);

                
            
            }();
        }

        // let _resultList = this.listAll(_regResult);

        return _result;
    },
    /**
     * Show full list
     * @param {object} source AST_unit
     */
    listAll: function (source) {
        return source.getBodyElements();
    },
    /**
     * structure analysis
     * @param {[]} s souce text splted by space
     * @param {string} start start marker
     */
    readSource: function (s, start = false) {
        // for source have to have start and end for all. like {function...}
        if (!s) { return; }
        let _e = s.shift();

        let isStart = typeMarker.startCheck(_e);
        if (isStart != false) {
            let _res = new AST_Unit();
            _res.type = isStart;
            _res.push(_e);

            let _index = 0;
            while (1) {
                let _unit = this.readSource(s);
                _index = _index +1;
                _unit instanceof AST_Unit && function() {
                    _unit.parent = _res;
                    _unit.index = _index;
                }();

                _res.push(_unit);
                if (_res.endCheck(s[0]) == true) {
                    break;
                };
            }
            _res.push(s.shift());
            return _res;
        }
        return _e;
        // throw ('unexpected');
    }
}

//-------------------------------------------------------
//                   
//                      _AST POOL
//
//-------------------------------------------------------
var ASTPool = {
    list: [],
    push: function (input) {
        this.list.push(input);
        return this.list.length - 1;
    },
    get: function (id) {
        return this.list[id];
    }
}
//-------------------------------------------------------

//                  _SHOW 

//  SHOW FUNCTION INCLUDE COMPARISION THEN HANDLE SHOWING
//  KIND OF LIKE REACT
//-------------------------------------------------------
class Diagram {
    constructor(canv) {
        this.canv = canv;
        this.contentList = [];
    }
    update(list) {
        list.forEach(i => {
            let _node = i.renderNode();
            this.canv.appendChild(_node);
        })

    }
}

//=========================================

//                _DRAW

//========================================

var draw = {
    div: function (content = null, className = 'title') {
        let _result = document.createElement('div');
        _result.className = className;

        if (content) { _result.innerHTML = content }
        return _result;
    },
    break: function () {
        let _result = document.createElement('p');
        return _result;
    },
    p: function (content) {
        let _result = document.createElement('p');
        _result.innerHTML = content;
        return _result;
    },
    span: function (content, className) {
        let _result = document.createElement('span');
        _result.innerText = content;
        _result.className = className;

        return _result;
    }

}
//-------------------------------------------------------

//                  _RENDER

//-------------------------------------------------------
var unitRender = {
    divFrame: function () {
        let _result = draw.div(null, 'default');
        return _result;
    },
    text: function (textArray) {
        let _result = this.divFrame();
        _result.style.margin = '5px'
        textArray.forEach(i => {
            _result.appendChild(draw.span(i, 'text'));
        });
        return _result;
    },
    head: function (...textArray) {
        let _result = draw.div(null, 'frame_title');
        textArray.forEach(i => {
            i !== undefined && _result.appendChild(draw.span(i, 'title'));
            _result.appendChild(draw.span(' ', 'default'));
        });
        return _result;
    },
    param: function (param) {
        if (!param) { return; }
        let _unitHeight = 20;
        let _result = draw.div(null, 'default');
        _result.style.backgroundColor = 'white';
        _result.style.height = (param.length-1) * _unitHeight + 'px';
        // _result.style.width = '20px'
        _result.style.position = 'relative'; 

        for (let i = 0; i < param.length; i++) {
            const element = param[i];
                if(element!=null){ // exclude null in list end 
                    
                    let _component = draw.div(element, 'component');
                    _component.style.top = _unitHeight * (i) + 'px';
                    _component.style.left = '0px';
                    i == 0 && (_component.style.borderTopStyle = 'none');
                    _result.appendChild(_component);
                }
        }
        return _result;
    }
}

var ASTRender = function (ASTunit) {
    return {
        head: unitRender.head(ASTunit.type.name, ASTunit.prop.name),
        body: unitRender.text(ASTunit.getText()),
        param: unitRender.param(ASTunit.prop['param'])
    }
}
//-------------------------------------------------------

//                  _EVENT BINDING

//-------------------------------------------------------
var eventBind = {
    unitMode: function (htmlNode) {
        // => draggable
        htmlNode.draggable = true;
        htmlNode.addEventListener('dragstart', e => { diagramEvent.drag(e, htmlNode) });
        // => show Source Text
        htmlNode.setAttribute('state', 'unit');
        htmlNode.addEventListener('dblclick', e => { diagramEvent.showSourceText(e) });
        _htmlNode.addEventListener('click',e=>{diagramEvent.click(e)})

        return htmlNode;
    },
    batteryMode: function (htmlNode) {
        let _htmlNode = htmlNode;
        _htmlNode.draggable = true;
        _htmlNode.addEventListener('dragstart', e => { diagramEvent.drag(e, _htmlNode) });
        // => show Source Text
        _htmlNode.addEventListener('dblclick', e => { diagramEvent.appendSourceText(e) });
        _htmlNode.addEventListener('click',e=>{diagramEvent.click(e)})

        return _htmlNode;
    }
}

//-------------------------------------------------------

//                  _DIAGRAM EVENT

//-------------------------------------------------------
var htmlNodeStyleHandler = function (Node) {
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

var posX, posY;
var diagramEvent = {
    hostHtmlNode: null,
    // posX:0,
    // posY:0,
    placeHolder: null,
    click : function(event){
        event.cancelBubble = true;
        let _target = event.target;

        while(_target.id==false ){
            _target = _target.parentElement;
        }
        console.log('unit id = ',_target.id,ASTPool.get(_target.id))
    },
    drag: function (event) {
        event.cancelBubble = true;
        let htmlNode = event.target;
        this.hostHtmlNode = htmlNode;

        this.placeHolder = draw.div('', 'placeHolder');

        htmlNodeStyleHandler(diagramEvent.placeHolder)({
            position: 'absolute',
            width: getComputedStyle(htmlNode, null).width,
            height: getComputedStyle(htmlNode, null).height,
            left: htmlNode.offsetLeft + 'px',
            top: htmlNode.offsetTop + 'px'
        });

        htmlNode.parentElement.appendChild(diagramEvent.placeHolder);

        posX = event.x - diagramEvent.placeHolder.offsetLeft;
        posY = event.y - diagramEvent.placeHolder.offsetTop;

        document.onmousemove = function (e) {
            diagramEvent.placeHolder.style.left = (e.clientX - posX) + 'px';
            diagramEvent.placeHolder.style.top = (e.clientY - posY) + 'px';
        }

        document.onmouseup = function (event) {
            let htmlNode = diagramEvent.hostHtmlNode;

            let _style = htmlNodeStyleHandler(htmlNode);
            event.cancelBubble = true;
            _style({
                position: 'absolute',
                margin: '0px', //IMPORTANT: OTHERWISE IT WILL OFFSET
                left: diagramEvent.placeHolder.style.left,
                top: diagramEvent.placeHolder.style.top
            });

            if (diagramEvent.hostHtmlNode.style.position == 'absolute' &&
                diagramEvent.hostHtmlNode.offsetTop < 100 &&
                diagramEvent.hostHtmlNode.offsetLeft < 100
            ) {
                _style({
                    position: 'relative',
                    top: '0px',
                    left: '0px',
                    margin: '15px'
                })
            };
            htmlNode.parentElement.removeChild(diagramEvent.placeHolder);
            document.onmousemove = null;
            document.onmouseup = null;
        }
    },
    showSourceText: function (e) {
        e.cancelBubble = true;
        let htmlNode = e.currentTarget;
        let ASTunit = ASTPool.get(e.target.id);
        if (e.target.id === undefined) { return }
        ASTunit.detail === 0 && function () {
            htmlNode.innerHTML = unitRender.text(ASTunit.getText()).innerHTML;
            ASTunit.detail = !ASTunit.detail;
        };
        ASTunit.detail === 1 && function () {
            ASTunit.detail = !ASTunit.detail;
            htmlNode.innerHTML = draw.span(ASTunit.type.name, 'title');

            // document.write(unitRender.text(ASTunit.getText()).innerHTML);
        }
    },
    appendSourceText: function (e) {
        let htmlNode = e.currentTarget;
        let ASTunit = ASTPool.get(e.currentTarget.id);
        let _rend = ASTRender(ASTunit);
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
var a;
//-------------------------------------------------------

//                  _STATE_MANAGER

//-------------------------------------------------------

class State {
    constructor(name, on = false, fn = null) {
        // repeating State check;
        this.name = name;
        this.on = on;
        this.fn = fn;
    }
}

class StateSet {
    constructor(setA, setB) {
        this.setA = setA;
        this.setB = setB;
        [this.setA.set, this.setB.set] = [this, this];
        if (this.setA.on === this.setB.on) { this.setB.on = !this.setB.on }
    }
    active() {
        if (this.setA.on === true) return this.setA;
        return this.setB;
    }
    turn() {
        this.setA.on = !this.setA.on;
        this.setB.on = !this.setB.on;
        return this.active();
    }
}


var sM = new Set();
sM.presentMode = new StateSet(
    new State('unitMode', false, function (ASTunit) {

        let frame = draw.div(null, 'frame');
        frame.appendChild(ASTRender(ASTunit).head);
        let _body = draw.div(null, 'body');
        for (let i = 0; i < ASTunit.body.length; i++) {
            if (typeof (ASTunit.body[i]) == 'string') {
                _body.appendChild(draw.span(ASTunit.body[i]));

            } else if (typeof (ASTunit.body[i]) == 'object') {
                let _node = ASTunit.body[i].renderNode()
                _node.style.top = (_body.lastChild.offsetTop + _body.lastChild.offsetHeight) + 'px';
                _body.appendChild(_node);
            }
        }
        frame.appendChild(_body);
        frame.id = ASTunit.id;
        frame = eventBind.unitMode(frame);
        return frame;
    }),
    new State('batteryMode', false, function (ASTunit) {
        let frame = draw.div(null, 'default');
        frame = htmlNodeStyleHandler(frame)
            ({
                'barckground-color': 'white',
                width: 'fit-content',
                height: 'fit-content',
                padding: '0px',
                margin: '15px',
                'border-color': 'grey',
                'border-style': 'solid'
            });
            let _unitHtml = ASTRender(ASTunit);
            frame.appendChild(_unitHtml.head);

        function subElement(unitList){
            let _parameters = draw.div(null, 'default');
            _parameters = htmlNodeStyleHandler(_parameters)({
                height: 'fit-content',
                top: tool.toPx(_unitHtml.head.top) - tool.toPx(_unitHtml.head.margin) + 'px',
                left: '0px'
                //remove width, otherwise cannot get width ??? make no sense
            });
            if (unitList) {
                // unitList.top = tool.toPx(_unitHtml.head.top) - tool.toPx(_unitHtml.head.margin) + 'px';
                // unitList.left = tool.toPx(_unitHtml.head.left) - tool.toPx(_unitHtml.head.margin) + 'px';
                _parameters.appendChild(unitList);
            }
            frame.appendChild(_parameters);
        }

        subElement(_unitHtml.param)

        frame.id = ASTunit.id;
        frame = eventBind.batteryMode(frame);
        return frame;
    })
);

sM.detail_text = new State('sourceText', false, function (ASTunit) {
    let _result = draw.div(null, 'default');
    let _unitHtml = ASTRender(ASTunit);

    _result.appendChild(_unitHtml.head);
    _result.appendChild(_unitHtml.body)
    return _result;
})


//-------------------------------------------------------

//                  _TOOLS

//-------------------------------------------------------

var tool = {
    toPx: function (input) {
        if (typeof (input) == 'number') {
            return input + 'px';
        } else {
            return parseInt(input);
        }
    },
    Px: {
        add: function (A, B) {
            return tool.toPx(A) + tool.toPx(B) + 'px';
        }
    },
}


setup(`var a = 12;
function a (asdasdx,asdasdasdasdy,x,y){
var a = 12;   
var b =13;
let c = 14;}
/**
     * bravo
     */
class opps(){

    
    function a (){
        class a () {
            asdasd
        }
    }
}

function b(a=12,b) { asd}
function asd (){
    function a {}
}function c (){ 
    var c =13;
}
var a = 13;
var asd asd = 111;`);
var a = ASTPool.list[1];
console.log(a.do('param'));