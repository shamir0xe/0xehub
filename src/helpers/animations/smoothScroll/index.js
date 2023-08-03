const smoothScroll = (params) => {
    let startTime = null;
    const { duration = 2000, element = window } = params;
    let initX = element.scrollLeft;
    let initY = element.scrollTop;
    const { x = initX, y = initY } = params;

    const scrollOnNextTick = (timestamp) => {
        let ratio = (timestamp - startTime) / duration;
        if (ratio < 1.0) {
            // console.log(`scrolling, ratio = ${ratio}`);
            element.scrollTo(
                initX + (x - initX) * ratio,
                initY + (y - initY) * ratio
            );
            requestAnimationFrame(scrollOnNextTick);
        } else {
            // completed
        }
    };

    requestAnimationFrame((timestamp) => {
        startTime = timestamp;
        scrollOnNextTick(timestamp);
    });
};

export default smoothScroll;
