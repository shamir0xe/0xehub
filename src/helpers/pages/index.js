/**
 * set the active page in props
 */
const activePage = (props) => getPage(props) === props.selfPageName;

/**
 * returns page number based on props
 */
const getPage = (props) => props.page;

export {
    activePage,
    getPage
};
