'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var Class = require('nd-class');
var Events = require('nd-events');
var Aspect = require('../index');

describe('ln-aspect', function() {

  it('aspect', function() {
    var counter = 1;

    var A = Class.create({
      Implements: [Events, Aspect],
      xxx: function(n, m) {
        return counter += n + m;
      }
    });

    var a = new A();

    a.before('xxx', function(n, m) {
      expect(n).to.equal(1);
      expect(m).to.equal(2);
      expect(this).to.equal(a);
    });

    a.after('xxx', function(ret) {
      expect(ret).to.equal(4);
      expect(this).to.equal(a);
      counter++;
    });

    a.xxx(1, 2);
    expect(counter).to.equal(5);


    // invalid
    counter = 1;
    try {
      a.before('zzz', function() {
      });
    } catch (e) {
      counter++;
    }

    expect(counter).to.equal(2);

  });

});
