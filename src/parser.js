const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = (html) => {
    const dom = new JSDOM(html);
    const bottomLineNode = dom.window.document.querySelector('div.advisory-row.advanced .row-sub-table p');

    if (!bottomLineNode) {
        return 'I can\'t find a bottom line. You\'ll have to check the website.';
    }

    const content = bottomLineNode.textContent;

    return content;
};
