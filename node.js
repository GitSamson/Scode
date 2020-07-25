/**
 *  if have property then inside read
 * @param {object} node  object to be read   
 * @param {string} nodeProperty property name to be read
 */
function node_inside(node) {
    return function (nodeProperty) {

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

    let _e_name = node.name && pt_e('title', node.name);
    let _e_value = node.value && pt_e('note', node.value);
    
    element_bindProperty(_e_name, 'start', node.start);
    element_bindProperty(_e_name, 'end', node.end);
    element_bindProperty(_e_value, 'start', node.start);
    element_bindProperty(_e_value, 'end', node.end);


    _ni('leadingComments');
    _ni('commentsLine');
    _ni('declarations');
    _ni('id');
    _ni('body');
    _ni('innerComments');

}