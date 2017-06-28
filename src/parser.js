const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = (html) => {
    const dom = new JSDOM(html);
    const content = dom.window.document.querySelector('div.advisory-row.advanced .row-sub-table p').textContent;

    return content;
};
