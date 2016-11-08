#!/usr/bin/env node
'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _sourceMapSupport = require('source-map-support');

var _couchService = require('./couchService');

var _couchService2 = _interopRequireDefault(_couchService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport.install)();
var config = require('config');


var watchedDatabaseList = [];

// Get the collection of databases to watch
var completedDatabase = new _couchService2.default('completed-visits');
completedDatabase.getUserDatabaseList().then(function (list) {
    start(list);
}).catch(function (err) {
    return console.log('Error: Unable to fetch list of user databases', err);
});

// TESTS
var removeTest = function removeTest(temp) {
    console.log('removing', temp);
    completedDatabase.remove(temp).then(function (doc) {
        return console.log(doc);
    }).catch(function (err) {
        return console.log(err);
    });
};

completedDatabase.add({ _id: new Date().toISOString(), name: 'Test', status: 'open' }).then(function (doc) {
    removeTest(doc);
}).catch(function (err) {
    return console.log(err);
});

// END TESTS

var start = function start(watchList) {
    watchList.forEach(function (d) {
        watchedDatabaseList[d] = new _couchService2.default(d);
        watchedDatabaseList[d].subscribe(processChange, handleError);
    });
    console.log('MFA Processing Service Running...');
};

// Ignore deleted records
// change is always an array
var processChange = function processChange(change) {
    change.forEach(function (c) {
        if (!c._deleted) {
            testForCompleted(c);
        }
    });
};

// Filter completed records
var testForCompleted = function testForCompleted(doc) {
    if (doc.status && doc.status === 'completed') {
        console.log('Will move:', (0, _stringify2.default)(doc)); /*moveRecord(doc)*/
    }
};

// Move record into completed queue
var moveRecord = function moveRecord(doc) {
    completedDatabase.add(doc).then(removeIfNoError(doc.id)).catch(function (err) {
        return console.log('Error: Completed record could not be added: ', doc.id, ' : ', (0, _stringify2.default)(err));
    });
};

// Ensure that record exists in completed database before removing
var removeIfNoError = function removeIfNoError(id) {
    completedDatabase.fetch(id).then(function (doc) {
        watchedDatabaseList['database'].remove(id).then(console.log('Assessment ' + id + ' was completed at ' + new Date().toISOString()));
    }).catch(function (err) {
        return console.log('Error: Completed record could not be removed: ', id, ' : ', (0, _stringify2.default)(err));
    });
};

var handleError = function handleError(error) {
    console.log(error);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJyZXF1aXJlIiwid2F0Y2hlZERhdGFiYXNlTGlzdCIsImNvbXBsZXRlZERhdGFiYXNlIiwiZ2V0VXNlckRhdGFiYXNlTGlzdCIsInRoZW4iLCJzdGFydCIsImxpc3QiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJlcnIiLCJyZW1vdmVUZXN0IiwidGVtcCIsInJlbW92ZSIsImRvYyIsImFkZCIsIl9pZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIm5hbWUiLCJzdGF0dXMiLCJ3YXRjaExpc3QiLCJmb3JFYWNoIiwiZCIsInN1YnNjcmliZSIsInByb2Nlc3NDaGFuZ2UiLCJoYW5kbGVFcnJvciIsImNoYW5nZSIsImMiLCJfZGVsZXRlZCIsInRlc3RGb3JDb21wbGV0ZWQiLCJtb3ZlUmVjb3JkIiwicmVtb3ZlSWZOb0Vycm9yIiwiaWQiLCJmZXRjaCIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7QUFHQTs7Ozs7O0FBRkE7QUFDQSxJQUFNQSxTQUFTQyxRQUFRLFFBQVIsQ0FBZjs7O0FBR0EsSUFBSUMsc0JBQXNCLEVBQTFCOztBQUVBO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFpQixrQkFBakIsQ0FBeEI7QUFDQUEsa0JBQWtCQyxtQkFBbEIsR0FDS0MsSUFETCxDQUNVLGdCQUFRO0FBQUVDLFVBQU1DLElBQU47QUFBYSxDQURqQyxFQUVLQyxLQUZMLENBRVc7QUFBQSxXQUFPQyxRQUFRQyxHQUFSLENBQVksK0NBQVosRUFBNkRDLEdBQTdELENBQVA7QUFBQSxDQUZYOztBQUlBO0FBQ0EsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLElBQUQsRUFBVTtBQUN6QkosWUFBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JHLElBQXhCO0FBQ0FWLHNCQUFrQlcsTUFBbEIsQ0FBeUJELElBQXpCLEVBQ0tSLElBREwsQ0FDVTtBQUFBLGVBQU9JLFFBQVFDLEdBQVIsQ0FBWUssR0FBWixDQUFQO0FBQUEsS0FEVixFQUVLUCxLQUZMLENBRVc7QUFBQSxlQUFPQyxRQUFRQyxHQUFSLENBQVlDLEdBQVosQ0FBUDtBQUFBLEtBRlg7QUFHSCxDQUxEOztBQU9BUixrQkFBa0JhLEdBQWxCLENBQXNCLEVBQUVDLEtBQUssSUFBSUMsSUFBSixHQUFXQyxXQUFYLEVBQVAsRUFBaUNDLE1BQU0sTUFBdkMsRUFBK0NDLFFBQVEsTUFBdkQsRUFBdEIsRUFDS2hCLElBREwsQ0FDVSxlQUFPO0FBQUVPLGVBQVdHLEdBQVg7QUFBaUIsQ0FEcEMsRUFFS1AsS0FGTCxDQUVXO0FBQUEsV0FBT0MsUUFBUUMsR0FBUixDQUFZQyxHQUFaLENBQVA7QUFBQSxDQUZYOztBQUlBOztBQUVBLElBQU1MLFFBQVEsU0FBUkEsS0FBUSxDQUFDZ0IsU0FBRCxFQUFlO0FBQ3pCQSxjQUFVQyxPQUFWLENBQWtCLGFBQUs7QUFDbkJyQiw0QkFBb0JzQixDQUFwQixJQUF5QiwyQkFBaUJBLENBQWpCLENBQXpCO0FBQ0F0Qiw0QkFBb0JzQixDQUFwQixFQUF1QkMsU0FBdkIsQ0FBaUNDLGFBQWpDLEVBQWdEQyxXQUFoRDtBQUNILEtBSEQ7QUFJQWxCLFlBQVFDLEdBQVIsQ0FBWSxtQ0FBWjtBQUNILENBTkQ7O0FBUUE7QUFDQTtBQUNBLElBQU1nQixnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNFLE1BQUQsRUFBWTtBQUM5QkEsV0FBT0wsT0FBUCxDQUFlLGFBQUs7QUFDaEIsWUFBSSxDQUFDTSxFQUFFQyxRQUFQLEVBQWlCO0FBQUVDLDZCQUFpQkYsQ0FBakI7QUFBcUI7QUFDM0MsS0FGRDtBQUdILENBSkQ7O0FBTUE7QUFDQSxJQUFNRSxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFDaEIsR0FBRCxFQUFTO0FBQzlCLFFBQUlBLElBQUlNLE1BQUosSUFBZU4sSUFBSU0sTUFBSixLQUFlLFdBQWxDLEVBQWdEO0FBQUVaLGdCQUFRQyxHQUFSLENBQVksWUFBWixFQUEwQix5QkFBZUssR0FBZixDQUExQixFQUFGLENBQWdEO0FBQXFCO0FBQ3hILENBRkQ7O0FBSUE7QUFDQSxJQUFNaUIsYUFBYSxTQUFiQSxVQUFhLENBQUNqQixHQUFELEVBQVM7QUFDeEJaLHNCQUFrQmEsR0FBbEIsQ0FBc0JELEdBQXRCLEVBQ0tWLElBREwsQ0FDVTRCLGdCQUFnQmxCLElBQUltQixFQUFwQixDQURWLEVBRUsxQixLQUZMLENBRVc7QUFBQSxlQUFPQyxRQUFRQyxHQUFSLENBQVksOENBQVosRUFBNERLLElBQUltQixFQUFoRSxFQUFvRSxLQUFwRSxFQUEyRSx5QkFBZXZCLEdBQWYsQ0FBM0UsQ0FBUDtBQUFBLEtBRlg7QUFHSCxDQUpEOztBQU1BO0FBQ0EsSUFBTXNCLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsRUFBRCxFQUFRO0FBQzVCL0Isc0JBQWtCZ0MsS0FBbEIsQ0FBd0JELEVBQXhCLEVBQ0s3QixJQURMLENBQ1UsZUFBTztBQUNUSCw0QkFBb0IsVUFBcEIsRUFBZ0NZLE1BQWhDLENBQXVDb0IsRUFBdkMsRUFDSzdCLElBREwsQ0FDVUksUUFBUUMsR0FBUixDQUFZLGdCQUFnQndCLEVBQWhCLEdBQXFCLG9CQUFyQixHQUE0QyxJQUFJaEIsSUFBSixHQUFXQyxXQUFYLEVBQXhELENBRFY7QUFFSCxLQUpMLEVBS0tYLEtBTEwsQ0FLVztBQUFBLGVBQU9DLFFBQVFDLEdBQVIsQ0FBWSxnREFBWixFQUE4RHdCLEVBQTlELEVBQWtFLEtBQWxFLEVBQXlFLHlCQUFldkIsR0FBZixDQUF6RSxDQUFQO0FBQUEsS0FMWDtBQU1ILENBUEQ7O0FBU0EsSUFBTWdCLGNBQWMsU0FBZEEsV0FBYyxDQUFDUyxLQUFELEVBQVc7QUFBRTNCLFlBQVFDLEdBQVIsQ0FBWTBCLEtBQVo7QUFBb0IsQ0FBckQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgaW5zdGFsbCB9IGZyb20gJ3NvdXJjZS1tYXAtc3VwcG9ydCc7XHJcbmluc3RhbGwoKTtcclxuY29uc3QgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmltcG9ydCBDb3VjaFNlcnZpY2UgZnJvbSAnLi9jb3VjaFNlcnZpY2UnXHJcblxyXG5sZXQgd2F0Y2hlZERhdGFiYXNlTGlzdCA9IFtdXHJcblxyXG4vLyBHZXQgdGhlIGNvbGxlY3Rpb24gb2YgZGF0YWJhc2VzIHRvIHdhdGNoXHJcbmxldCBjb21wbGV0ZWREYXRhYmFzZSA9IG5ldyBDb3VjaFNlcnZpY2UoJ2NvbXBsZXRlZC12aXNpdHMnKVxyXG5jb21wbGV0ZWREYXRhYmFzZS5nZXRVc2VyRGF0YWJhc2VMaXN0KClcclxuICAgIC50aGVuKGxpc3QgPT4geyBzdGFydChsaXN0KSB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6IFVuYWJsZSB0byBmZXRjaCBsaXN0IG9mIHVzZXIgZGF0YWJhc2VzJywgZXJyKSlcclxuXHJcbi8vIFRFU1RTXHJcbmNvbnN0IHJlbW92ZVRlc3QgPSAodGVtcCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JlbW92aW5nJywgdGVtcClcclxuICAgIGNvbXBsZXRlZERhdGFiYXNlLnJlbW92ZSh0ZW1wKVxyXG4gICAgICAgIC50aGVuKGRvYyA9PiBjb25zb2xlLmxvZyhkb2MpKVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcclxufVxyXG5cclxuY29tcGxldGVkRGF0YWJhc2UuYWRkKHsgX2lkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIG5hbWU6ICdUZXN0Jywgc3RhdHVzOiAnb3BlbicgfSlcclxuICAgIC50aGVuKGRvYyA9PiB7IHJlbW92ZVRlc3QoZG9jKSB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxyXG5cclxuLy8gRU5EIFRFU1RTXHJcblxyXG5jb25zdCBzdGFydCA9ICh3YXRjaExpc3QpID0+IHtcclxuICAgIHdhdGNoTGlzdC5mb3JFYWNoKGQgPT4ge1xyXG4gICAgICAgIHdhdGNoZWREYXRhYmFzZUxpc3RbZF0gPSBuZXcgQ291Y2hTZXJ2aWNlKGQpXHJcbiAgICAgICAgd2F0Y2hlZERhdGFiYXNlTGlzdFtkXS5zdWJzY3JpYmUocHJvY2Vzc0NoYW5nZSwgaGFuZGxlRXJyb3IpXHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coJ01GQSBQcm9jZXNzaW5nIFNlcnZpY2UgUnVubmluZy4uLicpXHJcbn1cclxuXHJcbi8vIElnbm9yZSBkZWxldGVkIHJlY29yZHNcclxuLy8gY2hhbmdlIGlzIGFsd2F5cyBhbiBhcnJheVxyXG5jb25zdCBwcm9jZXNzQ2hhbmdlID0gKGNoYW5nZSkgPT4ge1xyXG4gICAgY2hhbmdlLmZvckVhY2goYyA9PiB7XHJcbiAgICAgICAgaWYgKCFjLl9kZWxldGVkKSB7IHRlc3RGb3JDb21wbGV0ZWQoYykgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gRmlsdGVyIGNvbXBsZXRlZCByZWNvcmRzXHJcbmNvbnN0IHRlc3RGb3JDb21wbGV0ZWQgPSAoZG9jKSA9PiB7XHJcbiAgICBpZiAoZG9jLnN0YXR1cyAmJiAoZG9jLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcpKSB7IGNvbnNvbGUubG9nKCdXaWxsIG1vdmU6JywgSlNPTi5zdHJpbmdpZnkoZG9jKSkvKm1vdmVSZWNvcmQoZG9jKSovIH1cclxufVxyXG5cclxuLy8gTW92ZSByZWNvcmQgaW50byBjb21wbGV0ZWQgcXVldWVcclxuY29uc3QgbW92ZVJlY29yZCA9IChkb2MpID0+IHtcclxuICAgIGNvbXBsZXRlZERhdGFiYXNlLmFkZChkb2MpXHJcbiAgICAgICAgLnRoZW4ocmVtb3ZlSWZOb0Vycm9yKGRvYy5pZCkpXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6IENvbXBsZXRlZCByZWNvcmQgY291bGQgbm90IGJlIGFkZGVkOiAnLCBkb2MuaWQsICcgOiAnLCBKU09OLnN0cmluZ2lmeShlcnIpKSlcclxufVxyXG5cclxuLy8gRW5zdXJlIHRoYXQgcmVjb3JkIGV4aXN0cyBpbiBjb21wbGV0ZWQgZGF0YWJhc2UgYmVmb3JlIHJlbW92aW5nXHJcbmNvbnN0IHJlbW92ZUlmTm9FcnJvciA9IChpZCkgPT4ge1xyXG4gICAgY29tcGxldGVkRGF0YWJhc2UuZmV0Y2goaWQpXHJcbiAgICAgICAgLnRoZW4oZG9jID0+IHtcclxuICAgICAgICAgICAgd2F0Y2hlZERhdGFiYXNlTGlzdFsnZGF0YWJhc2UnXS5yZW1vdmUoaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihjb25zb2xlLmxvZygnQXNzZXNzbWVudCAnICsgaWQgKyAnIHdhcyBjb21wbGV0ZWQgYXQgJyArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogQ29tcGxldGVkIHJlY29yZCBjb3VsZCBub3QgYmUgcmVtb3ZlZDogJywgaWQsICcgOiAnLCBKU09OLnN0cmluZ2lmeShlcnIpKSlcclxufVxyXG5cclxuY29uc3QgaGFuZGxlRXJyb3IgPSAoZXJyb3IpID0+IHsgY29uc29sZS5sb2coZXJyb3IpIH1cclxuIl19