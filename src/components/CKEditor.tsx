'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ClassicEditor: any;
  }
}

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

let scriptLoaded = false;
let loadingPromise: Promise<void> | null = null;

const loadCKEditorScript = () => {
  if (scriptLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/40.1.0/classic/ckeditor.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      loadingPromise = null;
      resolve();
    };
    script.onerror = (error) => {
      loadingPromise = null;
      reject(error);
    };
    document.head.appendChild(script);
  });

  return loadingPromise;
};

const CKEditor: React.FC<CKEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let editor: any = null;

    const initEditor = async () => {
      try {
        await loadCKEditorScript();
        
        if (!mounted || !editorContainerRef.current || !window.ClassicEditor) {
          return;
        }

        // Only initialize if not already initialized
        if (!isInitializedRef.current) {
          editor = await window.ClassicEditor.create(editorContainerRef.current, {
            placeholder: placeholder || 'Type your content here...',
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'insertTable',
              'undo',
              'redo'
            ],
          });

          if (!mounted) {
            editor.destroy();
            return;
          }

          editorRef.current = editor;
          isInitializedRef.current = true;

          // Set initial value
          editor.setData(value);

          // Handle changes with debounce
          let timeoutId: NodeJS.Timeout;
          editor.model.document.on('change:data', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              const data = editor.getData();
              onChange(data);
            }, 300); // 300ms debounce
          });
        } else if (editorRef.current) {
          // Update content if editor is already initialized
          const currentData = editorRef.current.getData();
          if (currentData !== value) {
            editorRef.current.setData(value);
          }
        }
      } catch (error) {
        console.error('Error initializing CKEditor:', error);
      }
    };

    initEditor();

    return () => {
      mounted = false;
      if (editor) {
        try {
          editor.destroy();
          isInitializedRef.current = false;
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
      editorRef.current = null;
    };
  }, [value, onChange, placeholder]);

  return (
    <div className="ckeditor-container">
      <div ref={editorContainerRef}></div>
      <style jsx global>{`
        .ckeditor-container {
          width: 100%;
          margin: 1rem 0;
        }
        .ck-editor__editable {
          min-height: 200px;
        }
        .ck-content {
          font-size: 1rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default CKEditor; 