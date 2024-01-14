import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let selectedDirectory: string | undefined;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('code-combiner.compileFiles', async () => {
        let workspaceFolder = vscode.workspace.workspaceFolders;
        let defaultPath = workspaceFolder ? workspaceFolder[0].uri.fsPath : undefined;

        const selectedOption = await vscode.window.showQuickPick(['Use Open Workspace', 'Choose Different Directory'], {
            placeHolder: 'Use the open workspace folder or choose a different directory?'
        });

        let directoryPath;
        if (selectedOption === 'Choose Different Directory') {
            const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false });
            if (folderUri && folderUri.length > 0) {
                directoryPath = folderUri[0].fsPath;
            } else {
                return;
            }
        } else if (selectedOption === 'Use Current Workspace' && defaultPath) {
            directoryPath = defaultPath;
        } else {
            vscode.window.showWarningMessage('No workspace folder is open.');
            return;
        }
		vscode.window.showInformationMessage(`Selected directory: ${directoryPath}`);

        const extensions = await showQuickPickForExtensions();
        if (extensions && extensions.length > 0) {
            compileFiles(directoryPath, extensions, path.join(directoryPath, 'compiled_files.txt'));
            vscode.window.showInformationMessage('Files compiled successfully');
        }
    }));
}

async function showQuickPickForExtensions(): Promise<string[]> {
    const items: vscode.QuickPickItem[] = ['py', 'go', 'js', 'java', 'txt'].map(ext => ({ label: ext }));
    const selected = await vscode.window.showQuickPick(items, {
        canPickMany: true,
        placeHolder: 'Select file extensions'
    });
    return selected?.map(item => item.label) ?? [];
}

function compileFiles(directory: string, extensions: string[], outputFileName: string) {
    let compiledContent = '';
    extensions.forEach(ext => {
        fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
            if (dirent.isFile() && dirent.name.endsWith(`.${ext}`)) {
                const filePath = path.join(directory, dirent.name);
                console.log(`Reading file: ${filePath}`);
                const content = fs.readFileSync(filePath, 'utf8');
                compiledContent += `File: ${filePath}\n${content}\n\n`;
            } else if (dirent.isDirectory()) {
                compileFiles(path.join(directory, dirent.name), [ext], outputFileName);
            }
        });
    });

    if (compiledContent) {
        console.log(`Writing to ${outputFileName}`);
        fs.appendFileSync(outputFileName, compiledContent);
    } else {
        console.log('No content to write');
    }
}

export function deactivate() {}
