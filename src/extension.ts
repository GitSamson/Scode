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
		// The code you place here will be executed every time your command is executed


	const panel = vscode.window.createWebviewPanel(
    "present",
    "diagram",
    vscode.ViewColumn.Two,
    { 
		enableScripts:true,
	   }
  );

const pathToHtml= vscode.Uri.file(
            path.join(context.extensionPath, 'src','test.html'));

const pathUri = pathToHtml.with({scheme: 'vscode-resource'});

panel.webview.html = fs.readFileSync(pathUri.fsPath,'utf8');



vscode.workspace.onDidChangeTextDocument(function(event) {
		let _content = event.document.getText();
		console.log(_content);
		panel.webview.postMessage(_content);
		// console.log(event.document.fileName, event.document.getText());
	  });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
