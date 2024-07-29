import React, { useEffect } from 'react';
import Quill from 'quill';

const QuillEditorJS = () => {
  useEffect(() => {
    const bubble = new Quill('#bubble-container', {
      theme: 'bubble',
      modules: {
        table: true,
      }
    });

    const snow = new Quill('#snow-container', {
      theme: 'snow',
      modules: {
        table: true,
        tableUI: true
      }
    });

    const output = new Quill('#output-container', {
      theme: 'bubble',
      modules: { table: true },
      readOnly: true,
    });

    bubble.on('text-change', function(delta, old, source) {
      if (source === 'user') {
        snow.updateContents(delta, 'api');
        updateOutput();
      }
    });

    const table = snow.getModule('table');
    snow.on('text-change', function(delta, old, source) {
      if (source === 'user') {
        bubble.updateContents(delta, 'api');
        updateOutput();
      }
    });

    function updateOutput() {
      const bubbleContent = bubble.getContents();
      const snowContent = snow.getContents();
      // TODO compare
      output.setContents(bubbleContent);
      const outputContent = output.getContents();
      // TODO compare outputContent
    }

    document.querySelector('#insert-table').addEventListener('click', function() {
      table.insertTable(3, 3);
    });

    // Clean up event listeners
    return () => {
      bubble.off('text-change');
      snow.off('text-change');
      document.querySelector('#insert-table').removeEventListener('click');
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="container">
      <div className="panel">
        <div id="snow-container"></div>
        <div>
          <button id="insert-table">Insert Table</button>
        </div>
      </div>
      <div className="panel">
        <div id="bubble-container"></div>
      </div>
      <div className="panel">
        <div id="output-container"></div>
      </div>
    </div>
  );
};

export default QuillEditorJS;
