
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
    ASThandler(content);


    let container = document.getElementById('container');
    let container_ed = document.getElementById('container_end');

    // analysis contetn text and generate a content node tree;

    //render node tree;
    // diagramRender(sourceTree, container);

    //when click on each element rendered on container, move cursor to where it is.
    eventHandler.do_vscCursor();
    // event include these:
    // 1: mouse :   cilck on diagram move cursor to the position
    // 2: zoom:     select and zoom in.
    // 3: modify:   change diagram content (add/delete/modify)update to vscode
    // 4: gesture:  move or drag update to vscode

}



var eventHandler = {
    do_vscCursor: function (param) { }
};
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


    let a = new diagram(document.getElementById('container'));
    a.update(_result);

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
        prop = {
            typeIndicator: 'unknown',
            name: 'unknown',
            start: '',
            end: '\n',
        }
    ) {
        this.typeIndicator = prop.typeIndicator;
        this.name = prop.name;
        this.end = toArray(prop.end) || [';', '\n'];
        this.start = prop.start;
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
    analysisId(content) {
        return content[1];
    }

    renderAllNode(unit, parent) {

    }
}
//-------------------------------------------------------

//                  TYPEMARKER

//-------------------------------------------------------

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
        end: '}'
    }),

    class: new AST_Type_Register({
        typeIndicator: 'class_Indicator',
        name: 'class',
        start: 'class',
        end: '}'
    }),
    variable: new AST_Type_Register({
        typeIndicator: 'variable_Indicator',
        name: 'variable',
        start: ['var', 'let', 'const'],
        end: [';', '\n']
    }),
    expression: new AST_Type_Register({
        typeIndicator: 'command',
        name: 'command',
        start: false,
        end: ''
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

    }


    getBodyElements() {

        let _result = [];


        for (let i = 0; i < this.body.length; i++) {

            let element = this.body[i];

            if (typeof (element) == 'object') {
            } else {
                _result = _result.concat(element.getBodyElements());
            }
        }

        if (_result == false) { return this }
        return _result;
    }

    push(content) {
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
            if (input == '\n' | ';') {
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
        let frame = draw.div(null, 'frame');
        frame.appendChild(draw.span(this.type.name, 'title'));
        let _body = draw.div(null, 'body');
        for (let i = 0; i < this.body.length; i++) {

            if (typeof (this.body[i]) == 'string') {

                _body.appendChild(draw.span(this.body[i]));

            } else if (typeof (this.body[i]) == 'object') {
                let _node = this.body[i].renderNode()

                _node.style.top = (_body.lastChild.offsetTop + _body.lastChild.offsetHeight) + 'px';

                _body.appendChild(_node);
            }
        }
        frame.appendChild(_body);
        return frame;
    }
}

//-------------------------------------------------------

//                        AST

//-------------------------------------------------------


var AST = {
    keySymbol: ['{', '}', ';', '\n', '(', ')'],
    /** replace key symbol with space
    */
    tokenize: function (input) {
        let _result = input;
        let _symbol = this.keySymbol;

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
        while (_source != false) {
            _result.push(this.readSource(_source, true));
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
     * @param {string} end end marker 
     */
    readSource: function (s, start = false) {
        // for source have to have start and end for all. like {function...}
        if (!s) {
            return;
        }
        let _e = s.shift();

        let isStart = typeMarker.startCheck(_e);
        if (start === true || isStart != false) {
            let _res = new AST_Unit();
            _res.type = isStart;
            _res.push(_e);
            while (1) {
                _res.push(this.readSource(s));
                if (_res.endCheck(s[0]) == true) {
                    break;
                };

                //TODO : COMMAND END HAVE PROBLEM NEED MORE END MARKER
            }
            _res.push(s.shift());
            _res.analysis();
            return _res;
        }

        else {
            return _e;

            // throw ('unexpected');
        }
    }
}


//-------------------------------------------------------
//                  SHOW 
//  SHOW FUNCTION INCLUDE COMPARISION THEN HANDLE SHOWING
//  KIND OF LIKE REACT
//-------------------------------------------------------
class diagram {
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

//                DIV _DRAW

//========================================

var draw = {
    div: function (content = null, className = 'title') {
        let _result = document.createElement('div');
        _result.className = className;
        _result.addEventListener('mousedown', e => { diagramEvent.click(e, _result) })
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

//                  EVENT

//-------------------------------------------------------
var activeNode;
var activeNodeStyle;
var posX, posY;
var diagramEvent = {
    click: function (event, bindNode) {
        if (activeNode) {
            activeNode.style.borderStyle = ''
        }
        event.cancelBubble = true;
        activeNode = bindNode;
        activeNodeStyle = activeNode.style;
        activeNode.style.borderStyle = 'solid'

        let placeHolder;

        if (!placeHolder) {
            placeHolder = draw.div('', 'placeHolder');
            placeHolder.style.position = 'absolute';
            placeHolder.style.width = getComputedStyle(bindNode, null).width;
            placeHolder.style.height = getComputedStyle(bindNode, null).height;
            placeHolder.style.left = bindNode.offsetLeft + 'px';
            placeHolder.style.top = bindNode.offsetTop + 'px';
            bindNode.parentElement.appendChild(placeHolder);
        };

        posX = event.x - placeHolder.offsetLeft;
        posY = event.y - placeHolder.offsetTop;

        activeNode.ondblclick = function () {
            event.cancelBubble = true;
            this.style.position = 'relative';
            this.style.left = '';
            this.style.top = '';
        }

        document.onmousemove = function (e) {

            placeHolder.style.left = (e.clientX - posX) + 'px';
            placeHolder.style.top = (e.clientY - posY) + 'px';

        }
        document.onmouseup = function (event) {
            event.cancelBubble = true;

            activeNode.style.position = 'absolute';
            activeNode.style.left = placeHolder.style.left;
            activeNode.style.top = placeHolder.style.top;

            if (activeNode.style.position == 'absolute' &&
                activeNode.offsetTop < 100 &&
                activeNode.offsetLeft < 100
            ) {
                console.log('ss');

                activeNode.style.position = 'relative';
                activeNode.style.top = '';
                activeNode.style.left = '';

            }
            bindNode.parentElement.removeChild(placeHolder);
            document.onmousemove = null;
            document.onmouseup = null;

        }
    }


}
var a = document.body;


//-------------------------------------------------------

//                  TOOLS

//-------------------------------------------------------

var tool = {
    toPx: function (input) {
        if (typeof (input) == 'number') {
            return input + 'px';
        } else {
            return parseInt(input);
        }
    }
}
var a = draw.div('asdasd', 'body');
setup(`var a = 12;
function a {
var a = 12;   
var b =13;
let c = 14;}

class opps(){
    function a (){
        class a () {
            asdasd
        }
    }
}

function b() { asd}
function asd (){
    function a {}
}function c (){ 
    var c =13;
}
var a = 13;
var asd asd = 111;
 `);