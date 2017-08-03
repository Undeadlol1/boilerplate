// fetch polyfill, used everywhere in code
require('isomorphic-fetch') // TODO to webpack?
require('babel-register')();
require('source-map-support').install();

// this is copy+paste from
// https://semaphoreci.com/community/tutorials/testing-react-components-with-enzyme-and-mocha
// and
// https://github.com/airbnb/enzyme/issues/942
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);

// This will search for files ending in .test.js and require them
// so that they are added to the webpack bundle
var context = require.context('.', true, /.+\.test\.js?$/);
context.keys().forEach(context);
module.exports = context;