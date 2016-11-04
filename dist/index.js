#!/usr/bin/env node
'use strict';

var _sourceMapSupport = require('source-map-support');

(0, _sourceMapSupport.install)();

var PouchService = require('./pouchService');
var remoteServer = 'http://couchdb.fairhursts.net:5984';
var db = 'visits';

var pouch = new PouchService(db, remoteServer);

// Ignore deleted records
var processChange = function processChange(change) {
    if (change.doc && !change.doc._deleted) {
        testForCompleted(change.doc);
    }
};

// Filter completed records
var testForCompleted = function testForCompleted(doc) {
    if (doc.status && doc.status === 'completed') {
        moveDoc(doc);
    }
};

// Move record into completed queue
var moveDoc = function moveDoc(doc) {
    console.log('Moving ' + doc._id + ' to completed queue');
};

// Subcribe to any changes in the local database
pouch.subscribe(processChange);

// Calling Sync() will grab a full dataset from the server
// and create an open event listener that keeps this app alive
pouch.sync();

console.log('MFA Processing Service Running...');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJQb3VjaFNlcnZpY2UiLCJyZXF1aXJlIiwicmVtb3RlU2VydmVyIiwiZGIiLCJwb3VjaCIsInByb2Nlc3NDaGFuZ2UiLCJjaGFuZ2UiLCJkb2MiLCJfZGVsZXRlZCIsInRlc3RGb3JDb21wbGV0ZWQiLCJzdGF0dXMiLCJtb3ZlRG9jIiwiY29uc29sZSIsImxvZyIsIl9pZCIsInN1YnNjcmliZSIsInN5bmMiXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTUEsZUFBZUMsUUFBUSxnQkFBUixDQUFyQjtBQUNBLElBQU1DLGVBQWUsb0NBQXJCO0FBQ0EsSUFBTUMsS0FBSyxRQUFYOztBQUVBLElBQU1DLFFBQVEsSUFBSUosWUFBSixDQUFpQkcsRUFBakIsRUFBcUJELFlBQXJCLENBQWQ7O0FBRUE7QUFDQSxJQUFNRyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLE1BQUQsRUFBWTtBQUM5QixRQUFJQSxPQUFPQyxHQUFQLElBQWMsQ0FBQ0QsT0FBT0MsR0FBUCxDQUFXQyxRQUE5QixFQUF3QztBQUFFQyx5QkFBaUJILE9BQU9DLEdBQXhCO0FBQThCO0FBQzNFLENBRkQ7O0FBSUE7QUFDQSxJQUFNRSxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFDRixHQUFELEVBQVM7QUFDOUIsUUFBSUEsSUFBSUcsTUFBSixJQUFlSCxJQUFJRyxNQUFKLEtBQWUsV0FBbEMsRUFBZ0Q7QUFBRUMsZ0JBQVFKLEdBQVI7QUFBYztBQUNuRSxDQUZEOztBQUlBO0FBQ0EsSUFBTUksVUFBVSxTQUFWQSxPQUFVLENBQUNKLEdBQUQsRUFBUztBQUNyQkssWUFBUUMsR0FBUixDQUFZLFlBQVlOLElBQUlPLEdBQWhCLEdBQXNCLHFCQUFsQztBQUNILENBRkQ7O0FBSUE7QUFDQVYsTUFBTVcsU0FBTixDQUFnQlYsYUFBaEI7O0FBRUE7QUFDQTtBQUNBRCxNQUFNWSxJQUFOOztBQUVBSixRQUFRQyxHQUFSLENBQVksbUNBQVoiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGluc3RhbGwgfSBmcm9tICdzb3VyY2UtbWFwLXN1cHBvcnQnO1xuaW5zdGFsbCgpO1xuXG5jb25zdCBQb3VjaFNlcnZpY2UgPSByZXF1aXJlKCcuL3BvdWNoU2VydmljZScpXG5jb25zdCByZW1vdGVTZXJ2ZXIgPSAnaHR0cDovL2NvdWNoZGIuZmFpcmh1cnN0cy5uZXQ6NTk4NCdcbmNvbnN0IGRiID0gJ3Zpc2l0cydcblxuY29uc3QgcG91Y2ggPSBuZXcgUG91Y2hTZXJ2aWNlKGRiLCByZW1vdGVTZXJ2ZXIpXG5cbi8vIElnbm9yZSBkZWxldGVkIHJlY29yZHNcbmNvbnN0IHByb2Nlc3NDaGFuZ2UgPSAoY2hhbmdlKSA9PiB7XG4gICAgaWYgKGNoYW5nZS5kb2MgJiYgIWNoYW5nZS5kb2MuX2RlbGV0ZWQpIHsgdGVzdEZvckNvbXBsZXRlZChjaGFuZ2UuZG9jKSB9XG59XG5cbi8vIEZpbHRlciBjb21wbGV0ZWQgcmVjb3Jkc1xuY29uc3QgdGVzdEZvckNvbXBsZXRlZCA9IChkb2MpID0+IHtcbiAgICBpZiAoZG9jLnN0YXR1cyAmJiAoZG9jLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcpKSB7IG1vdmVEb2MoZG9jKSB9XG59XG5cbi8vIE1vdmUgcmVjb3JkIGludG8gY29tcGxldGVkIHF1ZXVlXG5jb25zdCBtb3ZlRG9jID0gKGRvYykgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdNb3ZpbmcgJyArIGRvYy5faWQgKyAnIHRvIGNvbXBsZXRlZCBxdWV1ZScpXG59XG5cbi8vIFN1YmNyaWJlIHRvIGFueSBjaGFuZ2VzIGluIHRoZSBsb2NhbCBkYXRhYmFzZVxucG91Y2guc3Vic2NyaWJlKHByb2Nlc3NDaGFuZ2UpXG5cbi8vIENhbGxpbmcgU3luYygpIHdpbGwgZ3JhYiBhIGZ1bGwgZGF0YXNldCBmcm9tIHRoZSBzZXJ2ZXJcbi8vIGFuZCBjcmVhdGUgYW4gb3BlbiBldmVudCBsaXN0ZW5lciB0aGF0IGtlZXBzIHRoaXMgYXBwIGFsaXZlXG5wb3VjaC5zeW5jKClcblxuY29uc29sZS5sb2coJ01GQSBQcm9jZXNzaW5nIFNlcnZpY2UgUnVubmluZy4uLicpIl19