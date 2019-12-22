// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "diagramcode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.DiagramCode', () => {
		console.log('src');
		
		// The code you place here will be executed every time your command is executed
		const panel = vscode.window.createWebviewPanel(
			"present",
			"diagram",
			vscode.ViewColumn.Two,
			{
				enableScripts: true,
			}
		);
		const vsc = vscode;

		const _editor = vscode.window.activeTextEditor;
		// it must be here! otherwise activeTextEditor is view
		var updateCursor = function (line:number,charater:number){
			var _p = new vscode.Position(line,charater);
			var _s = new vscode.Selection(_p,_p);
			var _r = new vscode.Range(_p,_p);
			_editor.selection = _s;
			_editor.revealRange(_r, vscode.TextEditorRevealType.InCenter);
			// _editor.commands.executeCommand('revealLine', { 'lineNumber': line, 'at': 'center' });
		};
		//handle message capture from webview
		panel.webview.onDidReceiveMessage(function(msg) {
			// return updateCursor(msg.line,msg.charater);
			return updateCursor(msg.line,msg.charater);
		}, undefined, context.subscriptions);

		//let extension read html outside
		const pathToHtml = vscode.Uri.file(
			path.join(context.extensionPath, 'src', 'test.html'));

		const pathUri = pathToHtml.with({ scheme: 'vscode-resource' });

		panel.webview.html = fs.readFileSync(pathUri.fsPath, 'utf8');



		vscode.workspace.onDidChangeTextDocument(function (event) {
			let _content = event.document.getText();
			console.log(_content);
			panel.webview.postMessage(_content);
			// console.log(event.document.fileName, event.document.getText());
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
