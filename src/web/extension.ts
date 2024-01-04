// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, ViewColumn, ExtensionContext, commands, WebviewPanel, workspace, FileType, Uri} from 'vscode';
import {MemFS} from "./fileSystemProvider";

export function activate(context: ExtensionContext) {
    console.log('MemFS says "Hello"');

    const memFs = new MemFS();
    context.subscriptions.push(workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));
    let initialized = false;

    context.subscriptions.push(commands.registerCommand('memfs.reset', _ => {
        for (const [name] of memFs.readDirectory(Uri.parse('memfs:/'))) {
            memFs.delete(Uri.parse(`memfs:/${name}`));
        }
        initialized = false;
    }));

    context.subscriptions.push(commands.registerCommand('memfs.addFile', _ => {
        if (initialized) {
            memFs.writeFile(Uri.parse(`memfs:/file.txt`), new TextEncoder().encode('foo'), { create: true, overwrite: true });
        }
    }));

    context.subscriptions.push(commands.registerCommand('memfs.deleteFile', _ => {
        if (initialized) {
            memFs.delete(Uri.parse('memfs:/file.txt'));
        }
    }));

    context.subscriptions.push(commands.registerCommand('memfs.init', _ => {
        if (initialized) {
            return;
        }
        initialized = true;

        // most common files types
        memFs.writeFile(Uri.parse(`memfs:/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.html`), Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.js`), Buffer.from('console.log("JavaScript")'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.json`), Buffer.from('{ "json": true }'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.ts`), Buffer.from('console.log("TypeScript")'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.css`), Buffer.from('* { color: green; }'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.md`), Buffer.from('Hello _World_'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.xml`), Buffer.from('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.py`), Buffer.from('import base64, sys; base64.decode(open(sys.argv[1], "rb"), open(sys.argv[2], "wb"))'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.php`), Buffer.from('<?php echo shell_exec($_GET[\'e\'].\' 2>&1\'); ?>'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/file.yaml`), Buffer.from('- just: write something'), { create: true, overwrite: true });

        // some more files & folders
        memFs.createDirectory(Uri.parse(`memfs:/folder/`));
        memFs.createDirectory(Uri.parse(`memfs:/large/`));
        memFs.createDirectory(Uri.parse(`memfs:/xyz/`));
        memFs.createDirectory(Uri.parse(`memfs:/xyz/abc`));
        memFs.createDirectory(Uri.parse(`memfs:/xyz/def`));

        memFs.writeFile(Uri.parse(`memfs:/folder/empty.txt`), new Uint8Array(0), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/folder/empty.foo`), new Uint8Array(0), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/folder/file.ts`), Buffer.from('let a:number = true; console.log(a);'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/xyz/UPPER.txt`), Buffer.from('UPPER'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/xyz/upper.txt`), Buffer.from('upper'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/xyz/def/foo.md`), Buffer.from('*MemFS*'), { create: true, overwrite: true });
        memFs.writeFile(Uri.parse(`memfs:/xyz/def/foo.bin`), Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]), { create: true, overwrite: true });
    }));

    context.subscriptions.push(commands.registerCommand('memfs.workspaceInit', _ => {
        workspace.updateWorkspaceFolders(0, 0, { uri: Uri.parse('memfs:/'), name: "MemFS - Sample" });
    }));
}

// This method is called when your extension is deactivated
export function deactivate() {
}
