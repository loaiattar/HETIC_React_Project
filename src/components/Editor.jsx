import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from 'react-markdown';
import styles from "./Editor.module.css";

function Editor() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem("markdown") || "";
  });
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("markdown", markdown);
  }, [markdown]);

  const insertFormatting = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'heading1':
        formattedText = `# ${selectedText}`;
        break;
      case 'heading2':
        formattedText = `## ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      default:
        formattedText = selectedText;
    }

    const newText = markdown.substring(0, start) + formattedText + markdown.substring(end);
    setMarkdown(newText);
    
    // Reset focus to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setMarkdown(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleFileDownload = (format) => {
    if (format === 'md') {
      const blob = new Blob([markdown], { type: "text/markdown" });
      downloadFile(blob, "document.md");
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(markdown, 180);
      doc.setFontSize(12);
      doc.text(lines, 15, 20);
      doc.save("document.pdf");
    } else if (format === 'html') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Markdown Export</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
              }
              pre {
                background-color: #f4f4f4;
                padding: 15px;
                border-radius: 5px;
              }
              code {
                background-color: #f4f4f4;
                padding: 2px 5px;
                border-radius: 3px;
              }
            </style>
          </head>
          <body>
            ${document.querySelector('.preview').innerHTML}
          </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: "text/html" });
      downloadFile(blob, "document.html");
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.editorContainer}>
      <h1>Markdown Editor</h1>
      <div className={styles.toolbar}>
        <button onClick={() => insertFormatting('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={() => insertFormatting('italic')} title="Italic">
          <em>I</em>
        </button>
        <button onClick={() => insertFormatting('underline')} title="Underline">
          <u>U</u>
        </button>
        <button onClick={() => insertFormatting('heading1')} title="Heading 1">
          H1
        </button>
        <button onClick={() => insertFormatting('heading2')} title="Heading 2">
          H2
        </button>
        <button onClick={() => insertFormatting('link')} title="Insert Link">
          🔗
        </button>
        <button onClick={() => insertFormatting('list')} title="Bullet List">
          •
        </button>
        <button onClick={() => insertFormatting('code')} title="Code">
          &lt;/&gt;
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write your markdown here..."
      />
      <div className={styles.buttons}>
        <div className={styles.uploadSection}>
          <label htmlFor="fileUpload" className={styles.uploadButton}>
            Upload File
          </label>
          <input
            id="fileUpload"
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        <button onClick={() => handleFileDownload('md')}>Download .md</button>
        <button onClick={() => handleFileDownload('pdf')}>Download PDF</button>
        <button onClick={() => handleFileDownload('html')}>Download HTML</button>
      </div>
      <h2>Preview</h2>
      <div className={`${styles.preview} preview`}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Editor;