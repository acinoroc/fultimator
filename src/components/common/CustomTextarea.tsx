import React, { useState } from 'react';
import { TextareaAutosize, useTheme, Button } from '@mui/material';

interface CustomTextareaProps {
  label: string;
  value: string;
  helperText: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  label,
  value,
  helperText,
  onChange,
  onFocus,
  onBlur,
  onMouseOver,
  onMouseOut,
}) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!e.currentTarget.matches(':focus')) {
      e.currentTarget.style.outlineColor = 'black';
    }
    if (onMouseOver) onMouseOver(e);
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!e.currentTarget.matches(':focus')) {
      e.currentTarget.style.outlineColor = isFocused ? primary : '#c4c4c4';
    }
    if (onMouseOut) onMouseOut(e);
  };

  const handleFormat = (format: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      default:
        break;
    }

    const newText = `${value.substring(0, start)}${formattedText}${value.substring(end)}`;
    onChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>);

    textarea.setSelectionRange(start + 2, start + 2 + selectedText.length);
    textarea.focus();
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    borderRadius: '4px',
    border: isFocused ? 'none' : '1px solid #c4c4c4',
    outline: 'none',
    resize: 'vertical',
    boxShadow: isFocused ? `0 0 0 2px ${primary}` : 'none',
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    padding: '0 2px',
    top: isFocused || value ? '-8px' : '12px',
    background: 'white',
    left: '14px',
    transition: 'top 0.2s ease, font-size 0.2s ease',
    fontSize: isFocused || value ? '0.8rem' : '1rem',
    color: isFocused ? primary : '#757575',
    pointerEvents: 'none',
  };

  const helperStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#757575',
    marginTop: '4px',
    marginRight: '14px',
    marginBottom: '0',
    marginLeft: '14px',
  };

  const toolbarStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-10px',
    right: '10px',
    display: 'flex',
    border: `1px solid ${primary}`,
    borderRadius: '50px',
    overflow: 'hidden',
    backgroundColor: 'white',
  };

  const buttonStyle = {
    fontSize: '12px',
    padding: '0',
    marginRight: '8px',
    transition: 'font-weight 0.3s ease',
    fontWeight: 'normal',
    '&:hover': {
      fontWeight: 'bold',
    },
  } as React.CSSProperties;  

  return (
    <div style={{ position: 'relative', margin: '5px 0' }}>
      <div style={toolbarStyle}>
        <Button onClick={() => handleFormat('bold')} style={buttonStyle}>
          Bold
        </Button>
        <Button onClick={() => handleFormat('italic')} style={buttonStyle}>
          Italic
        </Button>
      </div>
      <TextareaAutosize
        ref={textareaRef}
        aria-label={label}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={textareaStyle}
      />
      <label style={labelStyle}>{label}</label>
      <div style={helperStyle}>
        {helperText}
      </div>
    </div>
  );
};

export default CustomTextarea;
