# Code Combiner Extension for VS Code

## Description

The Code Combiner extension for Visual Studio Code allows users to easily compile multiple code files into a single file. This tool is especially useful for developers looking to consolidate various source code files for streamlined review or archiving purposes.

## Features

- **Compile Multiple Files**: Quickly compile files from various programming languages into a single file.
- **Flexible File Selection**: Supports a wide range of file extensions, including `.py`, `.go`, `.js`, `.java`, and `.txt`.
- **Workspace Integration**: Automatically detects and suggests using the currently open VS Code workspace directory for file compilation.
- **Custom Directory Selection**: Offers the option to compile files from a directory other than the current workspace.
- **User-Friendly Interface**: Easy-to-use command palette options for a seamless user experience.

## Usage

1. **Open your project/workspace** in Visual Studio Code.
2. **Run the 'Compile Files' command** from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. **Choose the source directory** for file compilation:
   - Use the currently open workspace directory, or
   - Select a different directory through the dialog box.
4. **Select the file extensions** you want to compile (e.g., `py`, `go`, `js`).
5. The extension will **compile the files** and save them as `compiled_files.txt` in the chosen directory.

## Requirements

No specific requirements. This extension should work on any system that can run Visual Studio Code.

## Extension Settings

Currently, there are no additional settings for this extension. All options are presented through the command palette.

## Known Issues

No known issues at this time. Please report any issues you encounter on the GitHub issues page.

## Release Notes

### 1.0.0

Initial release of Code Combiner

- Feature: Compile multiple code files into a single file.
- Feature: Support for various file extensions.
- Feature: Workspace integration for source directory selection.
- Feature: Option to choose a custom directory for file compilation.

## Contributing

Contributions to the Code Combiner extension are welcome! Please feel free to fork the repository, make changes, and submit pull requests. For major changes or suggestions, please open an issue first to discuss what you would like to change.

## License

This extension is released under the MIT License. See the [LICENSE](LICENSE) file for more details.
