import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from 'react-markdown';
import styles from "./Editor.module.css";

function Editor() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem("markdown") || "";
  });
  
  const [title, setTitle] = useState(() => {
    return localStorage.getItem("documentTitle") || "Untitled Document";
  });
  
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("markdown", markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem("documentTitle", title);
  }, [title]);

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
      // Set the title to the filename without extension
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);

      const reader = new FileReader();
      reader.onload = (e) => setMarkdown(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleFileDownload = (format) => {
    if (format === 'md') {
      // Include title as a header in the markdown content
      const contentWithTitle = `# ${title}\n\n${markdown}`;
      const blob = new Blob([contentWithTitle], { type: "text/markdown" });
      downloadFile(blob, `${title}.md`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      // Add title to PDF
      doc.setFontSize(16);
      doc.text(title, 15, 15);
      // Add content
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(markdown, 180);
      doc.text(lines, 15, 25);
      doc.save(`${title}.pdf`);
    } else if (format === 'html') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
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
            <h1>${title}</h1>
            ${document.querySelector('.preview').innerHTML}
          </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: "text/html" });
      downloadFile(blob, `${title}.html`);
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
      <div className={styles.titleSection}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          placeholder="Enter document title..."
        />
      </div>
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
          link
        </button>
        <button onClick={() => insertFormatting('list')} title="Bullet List">
          list
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
        <h1>{title}</h1>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Editor;