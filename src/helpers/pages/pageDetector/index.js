import range from "src/helpers/arrays/range";

const pageDetector = (params) => {
    const { mainPage, pageRefs, callback = () => {} } = params;
    const pageOffsets = getOffsets(pageRefs);
    let offset = null;
    const onScroll = () => {
        const component = mainPage.current;
        offset = component.scrollTop;
        let pagePrim = 1e-12;
        for (let i of range(pageRefs.length)) {
            if (offset * 2 > pageOffsets[i] + pageOffsets[i - 1]) {
                pagePrim =
                    (2 * offset - pageOffsets[i] - pageOffsets[i - 1]) /
                    (pageOffsets[i + 1] - pageOffsets[i - 1]);
                pagePrim += i;
            }
        }
        pagePrim = Math.max(0, Math.floor(pagePrim));
        callback(pagePrim, offset);
    };
    const setup = () => {
        mainPage.current.addEventListener("scroll", onScroll);
    };
    const closure = () => {
        mainPage.current.removeEventListener("scroll", onScroll);
    };
    closure();
    setup();
    return closure;
};

const getOffsets = (pageRefs) => {
    const getOffset = (idx, type = OffsetTypes.TOP) => {
        if (idx < 0) return 0;
        if (idx >= pageRefs.length || !pageRefs[idx] || !pageRefs[idx].current)
            return getOffset(idx - 1, OffsetTypes.BOTTOM);
        let ret = pageRefs[idx].current[OffsetTypes.TOP];
        if (type === OffsetTypes.BOTTOM)
            ret += pageRefs[idx].current[OffsetTypes.HEIGHT];
        return parseInt(ret);
    };
    let res = {};
    res[-1] = getOffset(-1);
    for (let i in pageRefs) {
        res[i] = getOffset(i);
    }
    res[pageRefs.length] = getOffset(pageRefs.length);
    return res;
};

const OffsetTypes = {
    TOP: "offsetTop",
    BOTTOM: "offsetBottom",
    HEIGHT: "offsetHeight",
};

export default pageDetector;
