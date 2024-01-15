import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';


let selectedDirectory: string | undefined;

const languageConfig = {
    "go": {
        include: ["**/*.go", "**/go.mod"],
        exclude: ['vendor/**']
    },
    "javascript": {
        include: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.json"],
        exclude: ["node_modules/**", "package-lock.json"]
    },
    "python": {
        include: ["**/*.py"],
        exclude: ["__pycache__/**"]
    },
    "java": {
        include: ["**/*.java"],
        exclude: ["**/target/**"]
    },
    "ruby": {
        include: ["**/*.rb"],
        exclude: []
    },
    "php": {
        include: ["**/*.php"],
        exclude: []
    },
};


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

function compileFiles(directory: string, languages: string[], outputFileName: string) {
    let compiledContent = '';

    languages.forEach(lang => {
        const config = languageConfig[lang as keyof typeof languageConfig];
        if (!config) {
            console.log(`No configuration found for language: ${lang}`);
            return;
        }
        const excludePatterns = config.exclude.map(e => path.normalize(path.join(directory, e)).replace(/\\/g, '/'));
        config.include.forEach(pattern => {
            const fullPattern = path.normalize(path.join(directory, pattern)).replace(/\\/g, '/');
            console.log(`Searching for files matching pattern ${fullPattern}`);
            console.log(`Excluding files matching patterns ${excludePatterns}`);

            try {
                glob.sync(fullPattern, { ignore: excludePatterns, nodir: true }).forEach(filePath => {
                    console.log(`Found file ${filePath}`);
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        compiledContent += `File: ${filePath}\n\`\`\`\n${content}\n\`\`\`\n`;
                        console.log(`Read file ${filePath}`);
                    } catch (readError) {
                        console.error(`Failed to read file ${filePath}: ${readError}`);
                    }
                });
            } catch (globError) {
                console.error(`Failed to find files matching pattern ${fullPattern}: ${globError}`);
            }
        });
    });

    if (compiledContent) {
        try {
            fs.writeFileSync(outputFileName, compiledContent);
        } catch (writeError) {
            console.error(`Failed to write to file ${outputFileName}: ${writeError}`);
        }
    } else {
        console.log('No content to write');
    }
}

export function deactivate() {}
