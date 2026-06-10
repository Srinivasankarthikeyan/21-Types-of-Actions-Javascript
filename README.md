# JavaScript Action - Code Analyzer

## Overview
This is a **JavaScript Action** that analyzes code metrics and generates reports.

## Why JavaScript Actions?
- ✅ Fast execution (runs directly on runner, no container build)
- ✅ Easy to write and maintain
- ✅ Direct access to @actions/core and @actions/github libraries
- ✅ Good for most simple-to-medium complexity tasks
- ❌ Language-specific (JavaScript/Node.js only)
- ❌ No isolated environment (depends on runner tools)

## Files Breakdown

### `action.yml`
Metadata file defining:
- **inputs**: file-path (directory/file to analyze), report-format (json/markdown/text)
- **outputs**: lines-of-code, file-count, report
- **runs**: Specifies `node20` as runtime and `index.js` as main entry point

### `index.js`
Main action logic using @actions/core:
- Reads inputs with `core.getInput()`
- Analyzes directory recursively for code files
- Generates report in specified format
- Sets outputs with `core.setOutput()`
- Logs info/errors with `core.info()` / `core.setFailed()`

### `package.json`
Node.js dependencies:
- `@actions/core`: For reading inputs, setting outputs, logging
- `@actions/github`: For GitHub API access

### `package-lock.json`
Locks dependency versions for reproducibility.

### `example-workflow.yml`
Sample workflow showing how to use this action.

## How to Use

1. Commit all files to your GitHub repository
2. Run `npm install` locally to install dependencies
3. Reference the action in a workflow:
   ```yaml
   - uses: your-org/javascript-action-repo@main
     with:
       file-path: './src'
       report-format: 'markdown'
   ```
4. Access outputs:
   ```yaml
   - run: echo "${{ steps.analyze.outputs.lines-of-code }}"
   ```

## Exam Tips
- JavaScript actions are faster than Docker actions (no build overhead)
- Use @actions/core for I/O and @actions/github for GitHub API calls
- Always use `core.getInput()`, `core.setOutput()`, and `core.setFailed()`
- Set `runs: using: node20` (or node16, node18 depending on support)
- Outputs can be consumed by subsequent steps or jobs
