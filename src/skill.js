const utahavy = require('./utahavy');

console.log('SCHEMA: ');
console.log(utahavy.schemas.intent());

console.log();
console.log('UTTERANCES: ');
console.log(utahavy.utterances());

console.log();
console.log('SKILL BUILDER:');
console.log(utahavy.schemas.skillBuilder());
