#!/usr/bin/env node
'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _sourceMapSupport = require('source-map-support');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport.install)();

var PouchService = require('./pouchService'),
    remoteServer = 'http://couchdb.fairhursts.net:5984',
    watchedDb = 'visits',
    completedDb = 'completed-visits';

var watchedDatabase = new PouchService(watchedDb, remoteServer); //TODO: handle as array
var completedDatabase = new PouchService(completedDb, remoteServer);

// Ignore deleted records
var processChange = function processChange(change) {
    if (change.doc && !change.doc._deleted) {
        testForCompleted(change.doc);
    }
};

// Filter completed records
var testForCompleted = function testForCompleted(doc) {
    if (doc.status && doc.status === 'completed') {
        moveRecord(doc);
    }
};

// Move record into completed queue
var moveRecord = function moveRecord(doc) {
    completedDatabase.add(doc).then(removeIfNoError(doc._id)).catch(function (err) {
        return console.log('Error: Completed record could not be added: ', doc._id, ' : ', (0, _stringify2.default)(err));
    });
};

// Ensure that record exists in completed database before removing
var removeIfNoError = function removeIfNoError(id) {
    completedDatabase.fetch(id).then(function (doc) {
        watchedDatabase.remove(doc._id).then(console.log('Assessment ' + doc._id + ' was completed at ' + new Date().toISOString()));
    }).catch(function (err) {
        return console.log('Error: Completed record could not be removed: ', id, ' : ', (0, _stringify2.default)(err));
    });
};

// Subcribe to any changes in the local database
watchedDatabase.subscribe(processChange);

// Calling Sync() will grab a full dataset from the server
// and create an open event listener that keeps this app alive
watchedDatabase.sync();
completedDatabase.sync();

console.log('MFA Processing Service Running...');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJQb3VjaFNlcnZpY2UiLCJyZXF1aXJlIiwicmVtb3RlU2VydmVyIiwid2F0Y2hlZERiIiwiY29tcGxldGVkRGIiLCJ3YXRjaGVkRGF0YWJhc2UiLCJjb21wbGV0ZWREYXRhYmFzZSIsInByb2Nlc3NDaGFuZ2UiLCJjaGFuZ2UiLCJkb2MiLCJfZGVsZXRlZCIsInRlc3RGb3JDb21wbGV0ZWQiLCJzdGF0dXMiLCJtb3ZlUmVjb3JkIiwiYWRkIiwidGhlbiIsInJlbW92ZUlmTm9FcnJvciIsIl9pZCIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsImVyciIsImlkIiwiZmV0Y2giLCJyZW1vdmUiLCJEYXRlIiwidG9JU09TdHJpbmciLCJzdWJzY3JpYmUiLCJzeW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOztBQUVBLElBQU1BLGVBQWVDLFFBQVEsZ0JBQVIsQ0FBckI7QUFBQSxJQUNJQyxlQUFlLG9DQURuQjtBQUFBLElBRUlDLFlBQVksUUFGaEI7QUFBQSxJQUdJQyxjQUFjLGtCQUhsQjs7QUFLQSxJQUFNQyxrQkFBa0IsSUFBSUwsWUFBSixDQUFpQkcsU0FBakIsRUFBNEJELFlBQTVCLENBQXhCLEMsQ0FBd0U7QUFDeEUsSUFBTUksb0JBQW9CLElBQUlOLFlBQUosQ0FBaUJJLFdBQWpCLEVBQThCRixZQUE5QixDQUExQjs7QUFFQTtBQUNBLElBQU1LLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsTUFBRCxFQUFZO0FBQzlCLFFBQUlBLE9BQU9DLEdBQVAsSUFBYyxDQUFDRCxPQUFPQyxHQUFQLENBQVdDLFFBQTlCLEVBQXdDO0FBQUVDLHlCQUFpQkgsT0FBT0MsR0FBeEI7QUFBOEI7QUFDM0UsQ0FGRDs7QUFJQTtBQUNBLElBQU1FLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNGLEdBQUQsRUFBUztBQUM5QixRQUFJQSxJQUFJRyxNQUFKLElBQWVILElBQUlHLE1BQUosS0FBZSxXQUFsQyxFQUFnRDtBQUFFQyxtQkFBV0osR0FBWDtBQUFpQjtBQUN0RSxDQUZEOztBQUlBO0FBQ0EsSUFBTUksYUFBYSxTQUFiQSxVQUFhLENBQUNKLEdBQUQsRUFBUztBQUN4Qkgsc0JBQWtCUSxHQUFsQixDQUFzQkwsR0FBdEIsRUFDS00sSUFETCxDQUNVQyxnQkFBZ0JQLElBQUlRLEdBQXBCLENBRFYsRUFFS0MsS0FGTCxDQUVXO0FBQUEsZUFBT0MsUUFBUUMsR0FBUixDQUFZLDhDQUFaLEVBQTREWCxJQUFJUSxHQUFoRSxFQUFxRSxLQUFyRSxFQUE0RSx5QkFBZUksR0FBZixDQUE1RSxDQUFQO0FBQUEsS0FGWDtBQUdILENBSkQ7O0FBTUE7QUFDQSxJQUFNTCxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNNLEVBQUQsRUFBUTtBQUM1QmhCLHNCQUFrQmlCLEtBQWxCLENBQXdCRCxFQUF4QixFQUNLUCxJQURMLENBQ1UsZUFBTztBQUNUVix3QkFBZ0JtQixNQUFoQixDQUF1QmYsSUFBSVEsR0FBM0IsRUFDS0YsSUFETCxDQUNVSSxRQUFRQyxHQUFSLENBQVksZ0JBQWdCWCxJQUFJUSxHQUFwQixHQUEwQixvQkFBMUIsR0FBaUQsSUFBSVEsSUFBSixHQUFXQyxXQUFYLEVBQTdELENBRFY7QUFFSCxLQUpMLEVBS0tSLEtBTEwsQ0FLVztBQUFBLGVBQU9DLFFBQVFDLEdBQVIsQ0FBWSxnREFBWixFQUE4REUsRUFBOUQsRUFBa0UsS0FBbEUsRUFBeUUseUJBQWVELEdBQWYsQ0FBekUsQ0FBUDtBQUFBLEtBTFg7QUFNSCxDQVBEOztBQVNBO0FBQ0FoQixnQkFBZ0JzQixTQUFoQixDQUEwQnBCLGFBQTFCOztBQUVBO0FBQ0E7QUFDQUYsZ0JBQWdCdUIsSUFBaEI7QUFDQXRCLGtCQUFrQnNCLElBQWxCOztBQUVBVCxRQUFRQyxHQUFSLENBQVksbUNBQVoiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGluc3RhbGwgfSBmcm9tICdzb3VyY2UtbWFwLXN1cHBvcnQnO1xuaW5zdGFsbCgpO1xuXG5jb25zdCBQb3VjaFNlcnZpY2UgPSByZXF1aXJlKCcuL3BvdWNoU2VydmljZScpLFxuICAgIHJlbW90ZVNlcnZlciA9ICdodHRwOi8vY291Y2hkYi5mYWlyaHVyc3RzLm5ldDo1OTg0JyxcbiAgICB3YXRjaGVkRGIgPSAndmlzaXRzJyxcbiAgICBjb21wbGV0ZWREYiA9ICdjb21wbGV0ZWQtdmlzaXRzJ1xuXG5jb25zdCB3YXRjaGVkRGF0YWJhc2UgPSBuZXcgUG91Y2hTZXJ2aWNlKHdhdGNoZWREYiwgcmVtb3RlU2VydmVyKSAgICAgICAvL1RPRE86IGhhbmRsZSBhcyBhcnJheVxuY29uc3QgY29tcGxldGVkRGF0YWJhc2UgPSBuZXcgUG91Y2hTZXJ2aWNlKGNvbXBsZXRlZERiLCByZW1vdGVTZXJ2ZXIpXG5cbi8vIElnbm9yZSBkZWxldGVkIHJlY29yZHNcbmNvbnN0IHByb2Nlc3NDaGFuZ2UgPSAoY2hhbmdlKSA9PiB7XG4gICAgaWYgKGNoYW5nZS5kb2MgJiYgIWNoYW5nZS5kb2MuX2RlbGV0ZWQpIHsgdGVzdEZvckNvbXBsZXRlZChjaGFuZ2UuZG9jKSB9XG59XG5cbi8vIEZpbHRlciBjb21wbGV0ZWQgcmVjb3Jkc1xuY29uc3QgdGVzdEZvckNvbXBsZXRlZCA9IChkb2MpID0+IHtcbiAgICBpZiAoZG9jLnN0YXR1cyAmJiAoZG9jLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcpKSB7IG1vdmVSZWNvcmQoZG9jKSB9XG59XG5cbi8vIE1vdmUgcmVjb3JkIGludG8gY29tcGxldGVkIHF1ZXVlXG5jb25zdCBtb3ZlUmVjb3JkID0gKGRvYykgPT4ge1xuICAgIGNvbXBsZXRlZERhdGFiYXNlLmFkZChkb2MpXG4gICAgICAgIC50aGVuKHJlbW92ZUlmTm9FcnJvcihkb2MuX2lkKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6IENvbXBsZXRlZCByZWNvcmQgY291bGQgbm90IGJlIGFkZGVkOiAnLCBkb2MuX2lkLCAnIDogJywgSlNPTi5zdHJpbmdpZnkoZXJyKSkpXG59XG5cbi8vIEVuc3VyZSB0aGF0IHJlY29yZCBleGlzdHMgaW4gY29tcGxldGVkIGRhdGFiYXNlIGJlZm9yZSByZW1vdmluZ1xuY29uc3QgcmVtb3ZlSWZOb0Vycm9yID0gKGlkKSA9PiB7XG4gICAgY29tcGxldGVkRGF0YWJhc2UuZmV0Y2goaWQpXG4gICAgICAgIC50aGVuKGRvYyA9PiB7IFxuICAgICAgICAgICAgd2F0Y2hlZERhdGFiYXNlLnJlbW92ZShkb2MuX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGNvbnNvbGUubG9nKCdBc3Nlc3NtZW50ICcgKyBkb2MuX2lkICsgJyB3YXMgY29tcGxldGVkIGF0ICcgKyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogQ29tcGxldGVkIHJlY29yZCBjb3VsZCBub3QgYmUgcmVtb3ZlZDogJywgaWQsICcgOiAnLCBKU09OLnN0cmluZ2lmeShlcnIpKSlcbn1cblxuLy8gU3ViY3JpYmUgdG8gYW55IGNoYW5nZXMgaW4gdGhlIGxvY2FsIGRhdGFiYXNlXG53YXRjaGVkRGF0YWJhc2Uuc3Vic2NyaWJlKHByb2Nlc3NDaGFuZ2UpXG5cbi8vIENhbGxpbmcgU3luYygpIHdpbGwgZ3JhYiBhIGZ1bGwgZGF0YXNldCBmcm9tIHRoZSBzZXJ2ZXJcbi8vIGFuZCBjcmVhdGUgYW4gb3BlbiBldmVudCBsaXN0ZW5lciB0aGF0IGtlZXBzIHRoaXMgYXBwIGFsaXZlXG53YXRjaGVkRGF0YWJhc2Uuc3luYygpXG5jb21wbGV0ZWREYXRhYmFzZS5zeW5jKClcblxuY29uc29sZS5sb2coJ01GQSBQcm9jZXNzaW5nIFNlcnZpY2UgUnVubmluZy4uLicpXG4iXX0=