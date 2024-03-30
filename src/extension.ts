import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "simple-lazygit.open",
    openLazygit
  );

  context.subscriptions.push(disposable);
}

async function openLazygit() {
  const hasFocusedExistingInstance = await focusActiveLazygitInstance();
  if (!hasFocusedExistingInstance) {
    await newLazygitInstance();
  }
}

/**
 * Tries to find an instance and focus on the tab.
 * @returns If an instance was found and focused
 */
async function focusActiveLazygitInstance(): Promise<boolean> {
  for (let openTerminal of vscode.window.terminals) {
    if (openTerminal.name === "lazygit") {
      openTerminal.show();
      return true;
    }
  }
  return false;
}

async function newLazygitInstance() {
  // Always create a new terminal
  let terminal = vscode.window.createTerminal();

  terminal.sendText("lazygit && exit");
  terminal.show();

  // Move the terminal to the editor area
  await vscode.commands.executeCommand(
    "workbench.action.terminal.moveToEditor"
  );

  // Move focus back to the editor view
  await vscode.commands.executeCommand(
    "workbench.action.focusActiveEditorGroup"
  );

  // toggle terminal off if more than 1, so lazygit is focused
  if (vscode.window.terminals.length > 1) {
    // 1 time to focus, another one to toggle off
    vscode.commands
      .executeCommand("workbench.action.terminal.toggleTerminal")
      .then(() => {
        vscode.commands.executeCommand(
          "workbench.action.terminal.toggleTerminal"
        );
      });
  }
}

export function deactivate() {}
