const domSelector = (reference, childMap) => {
    let children = childMap.split("-").map((value) => parseInt(value));
    if (!reference || !reference.current) return null;
    let stack = [reference.current];
    // console.log('children array' + children);
    for (let child of children) {
        const component = stack.pop();
        // console.log(component)
        stack.push(component.childNodes[child]);
        // console.log(component.childNodes[child])
    }
    return stack.pop();
};

export default domSelector;
