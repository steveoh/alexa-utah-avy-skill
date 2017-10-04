const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = (html) => {
    const dom = new JSDOM(html);
    const bottomLineNode = dom.window.document.querySelector('div.advisory-row.advanced .row-sub-table p');

    if (!bottomLineNode) {
        return 'I can\'t find a bottom line. If there is snow, you\'ll have to check ' +
        'the website, otherwise it\'s summer time!';
    }

    const content = bottomLineNode.textContent;

    return content;
};
