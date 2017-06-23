var parser = require('../src/parser');
var expect = require('chai').expect;
var fs = require('fs');

describe('parser', function () {
    it('should return the bottom line', function () {
        const html = fs.readFileSync('test/data/report.html', 'utf8');

        expect(parser(html)).to.equal('Mostly Low hazard early this morning will quickly rise to a Moderate risk of loose, wet avalanches with warm temperatures and strong sunshine. There also is a Moderate risk of both human-triggered - as well as natural - cornice falls.  Notoriously unpredictable glide avalanches are also possible in localized terrain.');
    });
});
