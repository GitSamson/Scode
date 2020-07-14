define(["require", "exports", "path", "mocha", "glob"], function (require, exports, path, Mocha, glob) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.run = void 0;
    function run() {
        // Create the mocha test
        const mocha = new Mocha({
            ui: 'tdd',
        });
        mocha.useColors(true);
        const testsRoot = path.resolve(__dirname, '..');
        return new Promise((c, e) => {
            glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
                if (err) {
                    return e(err);
                }
                // Add files to the test suite
                files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
                try {
                    // Run the mocha test
                    mocha.run(failures => {
                        if (failures > 0) {
                            e(new Error(`${failures} tests failed.`));
                        }
                        else {
                            c();
                        }
                    });
                }
                catch (err) {
                    e(err);
                }
            });
        });
    }
    exports.run = run;
});
//# sourceMappingURL=index.js.map