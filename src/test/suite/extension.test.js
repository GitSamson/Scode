define(["require", "exports", "assert", "vscode"], function (require, exports, assert, vscode) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import * as myExtension from '../extension';
    suite('Extension Test Suite', () => {
        vscode.window.showInformationMessage('Start all tests.');
        test('Sample test', () => {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});
//# sourceMappingURL=extension.test.js.map