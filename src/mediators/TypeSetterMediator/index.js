let keyPress = null; 


const TypeSetterMediator = class {
    static initialize = (virtualKeyPress) => {
        keyPress = virtualKeyPress;
    }
}

export default TypeSetterMediator;
