(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  jasmine.HeadlessConsoleReporter = (function() {

    __extends(HeadlessConsoleReporter, jasmine.HeadlessReporter);

    function HeadlessConsoleReporter(callback) {
      this.callback = callback != null ? callback : null;
      this._waitRunner = __bind(this._waitRunner, this);
      HeadlessConsoleReporter.__super__.constructor.call(this, this.callback);
      this.position = 0;
      this.positions = "|/-\\";
    }

    HeadlessConsoleReporter.prototype.reportRunnerResults = function(runner) {
      var result, resultLine, _i, _len, _ref;
      HeadlessConsoleReporter.__super__.reportRunnerResults.call(this);
      JHW.stdout.print("\n");
      resultLine = this.formatResultLine(this._runtime());
      if (this.failedCount === 0) {
        JHW.stdout.puts(("PASS: " + resultLine).foreground('green'));
      } else {
        JHW.stdout.puts(("FAIL: " + resultLine).foreground('red'));
      }
      _ref = this.results;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        JHW.stdout.puts(result.toString());
      }
      if (window.JHW) return window.onbeforeunload = null;
    };

    HeadlessConsoleReporter.prototype.reportRunnerStarting = function(runner) {
      HeadlessConsoleReporter.__super__.reportRunnerStarting.call(this, runner);
      if (!this.hasError()) {
        return JHW.stdout.puts("\nRunning Jasmine specs...".bright());
      }
    };

    HeadlessConsoleReporter.prototype.reportSpecResults = function(spec) {
      var _this = this;
      HeadlessConsoleReporter.__super__.reportSpecResults.call(this, spec);
      return this._reportSpecResult(spec, {
        success: function(results) {
          return JHW.stdout.print('.'.foreground('green'));
        },
        failure: function(results) {
          var failureResult, foundLine, result, testCount, _i, _len, _ref;
          JHW.stdout.print('F'.foreground('red'));
          failureResult = new HeadlessReporterResult(spec.getFullName(), spec.getSpecSplitName());
          testCount = 1;
          _ref = results.getItems();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            result = _ref[_i];
            if (result.type === 'expect' && !result.passed_) {
              if (foundLine = result.expectations[testCount - 1]) {
                result.line = foundLine[0], result.lineNumber = foundLine[1];
              }
              failureResult.addResult(result);
            }
            testCount += 1;
          }
          return _this.results.push(failureResult);
        }
      });
    };

    HeadlessConsoleReporter.prototype.reportSpecWaiting = function() {
      if (!this.timer) {
        this.timer = true;
        this.first = true;
        return this._waitRunner();
      }
    };

    HeadlessConsoleReporter.prototype.reportSpecRunning = function() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return JHW.stdout.print(Intense.moveBack());
      }
    };

    HeadlessConsoleReporter.prototype.formatResultLine = function(runtime) {
      var line;
      line = [];
      line.push(this.length);
      line.push((this.length === 1 ? "test" : "tests") + ',');
      line.push(this.failedCount);
      line.push((this.failedCount === 1 ? "failure" : "failures") + ',');
      line.push(runtime);
      line.push((runtime === 1.0 ? "sec" : "secs") + '.');
      return line.join(' ');
    };

    HeadlessConsoleReporter.prototype._waitRunner = function() {
      var _this = this;
      return this.timer = setTimeout(function() {
        if (_this.timer) {
          if (!_this.first) JHW.stdout.print(Intense.moveBack());
          JHW.stdout.print(_this.positions.substr(_this.position, 1).foreground('yellow'));
          _this.position += 1;
          _this.position %= _this.positions.length;
          _this.first = false;
          return _this._waitRunner();
        }
      }, 750);
    };

    return HeadlessConsoleReporter;

  })();

}).call(this);
