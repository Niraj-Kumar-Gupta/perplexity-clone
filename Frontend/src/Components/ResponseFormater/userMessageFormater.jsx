import React from 'react';
import { Code } from 'lucide-react';

const styles = {
  codeBlock: {
    margin: '8px 0',
  },

  preBlock: {
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  textBlock: {
    margin: '8px 0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }
};

const UserMessageFormatter = ({ role, message }) => {
  const isCodeBlock = (text) => {
    const codeIndicators = [
      'import ',
      'const ',
      'function ',
      'class ',
      'let ',
      'var ',
      '</',
      '=>',
      '{',
      '};'
    ];
    return codeIndicators.some(indicator => text.includes(indicator));
  };

  const formatCode = (code) => {
    return (
      <div style={styles.codeBlock}>
        <pre style={styles.preBlock}>
          {code}
        </pre>
      </div>
    );
  };

  // Function to format plain text
  const formatText = (text) => {
    return (
      <p style={styles.textBlock}>
        {text}
      </p>
    );
  };


  const formatMessage = (message) => {
    if (typeof message !== 'string') return formatText(String(message));

    const blocks = message.split('\n\n');
    return blocks.map((block, index) => {
      if (isCodeBlock(block)) {
        return formatCode(block);
      }
      return formatText(block);
    });
  };

  const containerStyle = {
    ...styles.container,
    ...(role === 'user' ? styles.userMessage : styles.assistantMessage),
  };

  return (
    <div >
        {formatMessage(message)}
    </div>
  );
};

export default UserMessageFormatter;