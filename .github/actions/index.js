const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

// Main action logic
async function run() {
  try {
    // Get inputs
    const filePath = core.getInput('file-path');
    const reportFormat = core.getInput('report-format');

    core.info(`📊 Starting code analysis on: ${filePath}`);

    // Analyze files
    const analysis = analyzeDirectory(filePath);

    // Generate report based on format
    let report = '';
    if (reportFormat === 'json') {
      report = JSON.stringify(analysis, null, 2);
    } else if (reportFormat === 'markdown') {
      report = generateMarkdownReport(analysis);
    } else {
      report = generateTextReport(analysis);
    }

    // Set outputs
    core.setOutput('lines-of-code', analysis.totalLines);
    core.setOutput('file-count', analysis.fileCount);
    core.setOutput('report', report);

    // Log summary
    core.info(`✅ Analysis complete!`);
    core.info(`📁 Files analyzed: ${analysis.fileCount}`);
    core.info(`📝 Total lines: ${analysis.totalLines}`);
    core.info(`\n${report}`);

  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

// Recursively analyze directory
function analyzeDirectory(dirPath) {
  let totalLines = 0;
  let fileCount = 0;
  const files = [];

  function walk(currentPath) {
    if (!fs.existsSync(currentPath)) {
      throw new Error(`Path does not exist: ${currentPath}`);
    }

    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const entries = fs.readdirSync(currentPath);
      entries.forEach(entry => {
        if (!entry.startsWith('.')) {
          walk(path.join(currentPath, entry));
        }
      });
    } else if (stats.isFile() && isCodeFile(currentPath)) {
      const content = fs.readFileSync(currentPath, 'utf8');
      const lines = content.split('\n').length;
      totalLines += lines;
      fileCount += 1;
      files.push({
        name: path.basename(currentPath),
        path: currentPath,
        lines: lines
      });
    }
  }

  walk(dirPath);
  return { fileCount, totalLines, files };
}

// Check if file is a code file
function isCodeFile(filePath) {
  const codeExtensions = ['.js', '.ts', '.py', '.java', '.cs', '.go', '.rb', '.php', '.yml', '.yaml', '.json'];
  const ext = path.extname(filePath).toLowerCase();
  return codeExtensions.includes(ext);
}

// Generate markdown report
function generateMarkdownReport(analysis) {
  let report = `# Code Analysis Report\n\n`;
  report += `**Files Analyzed:** ${analysis.fileCount}\n`;
  report += `**Total Lines:** ${analysis.totalLines}\n\n`;
  report += `## File Details\n\n`;
  report += `| File | Lines |\n`;
  report += `|------|-------|\n`;
  
  analysis.files.forEach(file => {
    report += `| ${file.name} | ${file.lines} |\n`;
  });

  return report;
}

// Generate text report
function generateTextReport(analysis) {
  let report = `CODE ANALYSIS REPORT\n`;
  report += `===================\n\n`;
  report += `Files Analyzed: ${analysis.fileCount}\n`;
  report += `Total Lines: ${analysis.totalLines}\n\n`;
  report += `File Details:\n`;
  report += `-------------\n`;
  
  analysis.files.forEach(file => {
    report += `${file.name}: ${file.lines} lines\n`;
  });

  return report;
}

// Run the action
run();
