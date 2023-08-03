import domSelector from "src/helpers/dom/domSelector/index";
import { readFile } from "src/helpers/files/index";

/**
 *
 * conditional appending class to array of classes
 * @param {condition} value
 * @param {class that should be added if condition is true} targetClass
 * @param  {array of other default classes, added either way} baseClasses
 */
const appendConditionalClass = (value, targetClass, ...baseClasses) => {
    return value
        ? [...baseClasses, targetClass].join(" ")
        : [...baseClasses].join(" ");
};

/**
 *
 * @param {path of the html file} filePath
 * @param {React ref of the root element} reference
 * @param {string of child order separated by '-' from the root element} childMap
 */
const updateInnerHtmlFromFile = (
    filePath,
    reference,
    childMap = "",
    callback = () => {}
) => {
    readFile(filePath, (html) => {
        let component = domSelector(reference, childMap);
        // console.log('')
        // console.log(`${filePath} -- ${childMap} -- ${html}`)
        // console.log(component)
        component.innerHTML = html;
        callback();
    });
};

export {
    appendConditionalClass,
    updateInnerHtmlFromFile,
};
