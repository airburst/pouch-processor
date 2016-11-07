#!/usr/bin/env node
'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _sourceMapSupport = require('source-map-support');

var _couchService = require('./couchService');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport.install)();
var config = require('config');


var user = config.get('couchdb.user');
var pass = config.get('couchdb.password');
var remoteServer = config.get('couchdb.remoteServer');

// Get the collection of databases to watch
(0, _couchService.getUserDbs)();

var PouchService = require('./pouchService'),
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
    var addDoc = (0, _assign2.default)({}, doc, { _rev: undefined });
    completedDatabase.add(addDoc).then(removeIfNoError(doc._id)).catch(function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJyZXF1aXJlIiwidXNlciIsImdldCIsInBhc3MiLCJyZW1vdGVTZXJ2ZXIiLCJQb3VjaFNlcnZpY2UiLCJ3YXRjaGVkRGIiLCJjb21wbGV0ZWREYiIsIndhdGNoZWREYXRhYmFzZSIsImNvbXBsZXRlZERhdGFiYXNlIiwicHJvY2Vzc0NoYW5nZSIsImNoYW5nZSIsImRvYyIsIl9kZWxldGVkIiwidGVzdEZvckNvbXBsZXRlZCIsInN0YXR1cyIsIm1vdmVSZWNvcmQiLCJhZGREb2MiLCJfcmV2IiwidW5kZWZpbmVkIiwiYWRkIiwidGhlbiIsInJlbW92ZUlmTm9FcnJvciIsIl9pZCIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsImVyciIsImlkIiwiZmV0Y2giLCJyZW1vdmUiLCJEYXRlIiwidG9JU09TdHJpbmciLCJzdWJzY3JpYmUiLCJzeW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7QUFGQTtBQUNBLElBQU1BLFNBQVNDLFFBQVEsUUFBUixDQUFmOzs7QUFHQSxJQUFNQyxPQUFPRixPQUFPRyxHQUFQLENBQVcsY0FBWCxDQUFiO0FBQ0EsSUFBTUMsT0FBT0osT0FBT0csR0FBUCxDQUFXLGtCQUFYLENBQWI7QUFDQSxJQUFNRSxlQUFlTCxPQUFPRyxHQUFQLENBQVcsc0JBQVgsQ0FBckI7O0FBRUE7QUFDQTs7QUFFQSxJQUFNRyxlQUFlTCxRQUFRLGdCQUFSLENBQXJCO0FBQUEsSUFDSU0sWUFBWSxRQURoQjtBQUFBLElBRUlDLGNBQWMsa0JBRmxCOztBQUlBLElBQU1DLGtCQUFrQixJQUFJSCxZQUFKLENBQWlCQyxTQUFqQixFQUE0QkYsWUFBNUIsQ0FBeEIsQyxDQUF3RTtBQUN4RSxJQUFNSyxvQkFBb0IsSUFBSUosWUFBSixDQUFpQkUsV0FBakIsRUFBOEJILFlBQTlCLENBQTFCOztBQUVBO0FBQ0EsSUFBTU0sZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxNQUFELEVBQVk7QUFDOUIsUUFBSUEsT0FBT0MsR0FBUCxJQUFjLENBQUNELE9BQU9DLEdBQVAsQ0FBV0MsUUFBOUIsRUFBd0M7QUFBRUMseUJBQWlCSCxPQUFPQyxHQUF4QjtBQUE4QjtBQUMzRSxDQUZEOztBQUlBO0FBQ0EsSUFBTUUsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0YsR0FBRCxFQUFTO0FBQzlCLFFBQUlBLElBQUlHLE1BQUosSUFBZUgsSUFBSUcsTUFBSixLQUFlLFdBQWxDLEVBQWdEO0FBQUVDLG1CQUFXSixHQUFYO0FBQWlCO0FBQ3RFLENBRkQ7O0FBSUE7QUFDQSxJQUFNSSxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0osR0FBRCxFQUFTO0FBQzNCLFFBQUlLLFNBQVMsc0JBQWMsRUFBZCxFQUFrQkwsR0FBbEIsRUFBdUIsRUFBRU0sTUFBTUMsU0FBUixFQUF2QixDQUFiO0FBQ0dWLHNCQUFrQlcsR0FBbEIsQ0FBc0JILE1BQXRCLEVBQ0tJLElBREwsQ0FDVUMsZ0JBQWdCVixJQUFJVyxHQUFwQixDQURWLEVBRUtDLEtBRkwsQ0FFVztBQUFBLGVBQU9DLFFBQVFDLEdBQVIsQ0FBWSw4Q0FBWixFQUE0RGQsSUFBSVcsR0FBaEUsRUFBcUUsS0FBckUsRUFBNEUseUJBQWVJLEdBQWYsQ0FBNUUsQ0FBUDtBQUFBLEtBRlg7QUFHSCxDQUxEOztBQU9BO0FBQ0EsSUFBTUwsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDTSxFQUFELEVBQVE7QUFDNUJuQixzQkFBa0JvQixLQUFsQixDQUF3QkQsRUFBeEIsRUFDS1AsSUFETCxDQUNVLGVBQU87QUFDVGIsd0JBQWdCc0IsTUFBaEIsQ0FBdUJsQixJQUFJVyxHQUEzQixFQUNLRixJQURMLENBQ1VJLFFBQVFDLEdBQVIsQ0FBWSxnQkFBZ0JkLElBQUlXLEdBQXBCLEdBQTBCLG9CQUExQixHQUFpRCxJQUFJUSxJQUFKLEdBQVdDLFdBQVgsRUFBN0QsQ0FEVjtBQUVILEtBSkwsRUFLS1IsS0FMTCxDQUtXO0FBQUEsZUFBT0MsUUFBUUMsR0FBUixDQUFZLGdEQUFaLEVBQThERSxFQUE5RCxFQUFrRSxLQUFsRSxFQUF5RSx5QkFBZUQsR0FBZixDQUF6RSxDQUFQO0FBQUEsS0FMWDtBQU1ILENBUEQ7O0FBU0E7QUFDQW5CLGdCQUFnQnlCLFNBQWhCLENBQTBCdkIsYUFBMUI7O0FBRUE7QUFDQTtBQUNBRixnQkFBZ0IwQixJQUFoQjtBQUNBekIsa0JBQWtCeUIsSUFBbEI7O0FBRUFULFFBQVFDLEdBQVIsQ0FBWSxtQ0FBWiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgaW5zdGFsbCB9IGZyb20gJ3NvdXJjZS1tYXAtc3VwcG9ydCc7XG5pbnN0YWxsKCk7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcbmltcG9ydCB7IGdldFVzZXJEYnMgfSBmcm9tICcuL2NvdWNoU2VydmljZSdcblxuY29uc3QgdXNlciA9IGNvbmZpZy5nZXQoJ2NvdWNoZGIudXNlcicpO1xuY29uc3QgcGFzcyA9IGNvbmZpZy5nZXQoJ2NvdWNoZGIucGFzc3dvcmQnKTtcbmNvbnN0IHJlbW90ZVNlcnZlciA9IGNvbmZpZy5nZXQoJ2NvdWNoZGIucmVtb3RlU2VydmVyJyk7XG5cbi8vIEdldCB0aGUgY29sbGVjdGlvbiBvZiBkYXRhYmFzZXMgdG8gd2F0Y2hcbmdldFVzZXJEYnMoKVxuXG5jb25zdCBQb3VjaFNlcnZpY2UgPSByZXF1aXJlKCcuL3BvdWNoU2VydmljZScpLFxuICAgIHdhdGNoZWREYiA9ICd2aXNpdHMnLFxuICAgIGNvbXBsZXRlZERiID0gJ2NvbXBsZXRlZC12aXNpdHMnXG5cbmNvbnN0IHdhdGNoZWREYXRhYmFzZSA9IG5ldyBQb3VjaFNlcnZpY2Uod2F0Y2hlZERiLCByZW1vdGVTZXJ2ZXIpICAgICAgIC8vVE9ETzogaGFuZGxlIGFzIGFycmF5XG5jb25zdCBjb21wbGV0ZWREYXRhYmFzZSA9IG5ldyBQb3VjaFNlcnZpY2UoY29tcGxldGVkRGIsIHJlbW90ZVNlcnZlcilcblxuLy8gSWdub3JlIGRlbGV0ZWQgcmVjb3Jkc1xuY29uc3QgcHJvY2Vzc0NoYW5nZSA9IChjaGFuZ2UpID0+IHtcbiAgICBpZiAoY2hhbmdlLmRvYyAmJiAhY2hhbmdlLmRvYy5fZGVsZXRlZCkgeyB0ZXN0Rm9yQ29tcGxldGVkKGNoYW5nZS5kb2MpIH1cbn1cblxuLy8gRmlsdGVyIGNvbXBsZXRlZCByZWNvcmRzXG5jb25zdCB0ZXN0Rm9yQ29tcGxldGVkID0gKGRvYykgPT4ge1xuICAgIGlmIChkb2Muc3RhdHVzICYmIChkb2Muc3RhdHVzID09PSAnY29tcGxldGVkJykpIHsgbW92ZVJlY29yZChkb2MpIH1cbn1cblxuLy8gTW92ZSByZWNvcmQgaW50byBjb21wbGV0ZWQgcXVldWVcbmNvbnN0IG1vdmVSZWNvcmQgPSAoZG9jKSA9PiB7XG5cdGxldCBhZGREb2MgPSBPYmplY3QuYXNzaWduKHt9LCBkb2MsIHsgX3JldjogdW5kZWZpbmVkIH0pXG4gICAgY29tcGxldGVkRGF0YWJhc2UuYWRkKGFkZERvYylcbiAgICAgICAgLnRoZW4ocmVtb3ZlSWZOb0Vycm9yKGRvYy5faWQpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogQ29tcGxldGVkIHJlY29yZCBjb3VsZCBub3QgYmUgYWRkZWQ6ICcsIGRvYy5faWQsICcgOiAnLCBKU09OLnN0cmluZ2lmeShlcnIpKSlcbn1cblxuLy8gRW5zdXJlIHRoYXQgcmVjb3JkIGV4aXN0cyBpbiBjb21wbGV0ZWQgZGF0YWJhc2UgYmVmb3JlIHJlbW92aW5nXG5jb25zdCByZW1vdmVJZk5vRXJyb3IgPSAoaWQpID0+IHtcbiAgICBjb21wbGV0ZWREYXRhYmFzZS5mZXRjaChpZClcbiAgICAgICAgLnRoZW4oZG9jID0+IHsgXG4gICAgICAgICAgICB3YXRjaGVkRGF0YWJhc2UucmVtb3ZlKGRvYy5faWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oY29uc29sZS5sb2coJ0Fzc2Vzc21lbnQgJyArIGRvYy5faWQgKyAnIHdhcyBjb21wbGV0ZWQgYXQgJyArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSkpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiBDb21wbGV0ZWQgcmVjb3JkIGNvdWxkIG5vdCBiZSByZW1vdmVkOiAnLCBpZCwgJyA6ICcsIEpTT04uc3RyaW5naWZ5KGVycikpKVxufVxuXG4vLyBTdWJjcmliZSB0byBhbnkgY2hhbmdlcyBpbiB0aGUgbG9jYWwgZGF0YWJhc2VcbndhdGNoZWREYXRhYmFzZS5zdWJzY3JpYmUocHJvY2Vzc0NoYW5nZSlcblxuLy8gQ2FsbGluZyBTeW5jKCkgd2lsbCBncmFiIGEgZnVsbCBkYXRhc2V0IGZyb20gdGhlIHNlcnZlclxuLy8gYW5kIGNyZWF0ZSBhbiBvcGVuIGV2ZW50IGxpc3RlbmVyIHRoYXQga2VlcHMgdGhpcyBhcHAgYWxpdmVcbndhdGNoZWREYXRhYmFzZS5zeW5jKClcbmNvbXBsZXRlZERhdGFiYXNlLnN5bmMoKVxuXG5jb25zb2xlLmxvZygnTUZBIFByb2Nlc3NpbmcgU2VydmljZSBSdW5uaW5nLi4uJylcbiJdfQ==