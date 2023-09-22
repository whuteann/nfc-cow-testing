import ErrorMessage from '@/components/atoms/typography/ErrorMessage';
import { Variant } from '@/types/Mui';
import {
  Box,
  FormControl,
  FormHelperText,
  styled
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface inputProps {
  value?: any,
  placeholder?: string,
  label?: string,
  onChangeText?: (text: any) => void,
  variant?: Variant,
  disabled?: boolean,
  password?: boolean,
  number?: boolean,
  hasError?: boolean,
  errorMessage?: any,
}

const EditorWrapper = styled(Box)(
  ({ theme }) => `
    .ql-editor {
      min-height: 100px;
    }

    .ql-snow .ql-picker {
      color: ${theme.colors.alpha.black[100]};
    }

    .ql-snow .ql-stroke {
      stroke: ${theme.colors.alpha.black[100]};
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};

    }

    .ql-invalid .ql-editor {
      border: 1px solid ${theme.palette.error.main}; 
      border-bottom-left-radius: ${theme.general.borderRadius}; 
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

const QuillField = ({
  value,
  placeholder = '',
  onChangeText = () => null,
  disabled = false,
  hasError = false,
  errorMessage = '',
}: inputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <EditorWrapper>
        <ReactQuill
          value={localValue}
          placeholder={placeholder}
          onChange={(content, delta, source, editor) => {
            setLocalValue(editor.getContents());
          }}
          onBlur={() => {
            onChangeText(localValue);
          }}
          className={hasError ? 'ql-invalid' : ''}
          readOnly={disabled}
        />
      </EditorWrapper>
      
      {
        hasError 
        ?
          <FormHelperText error={true}>{ errorMessage }</FormHelperText>
        :
          <></>
      }
    </Box>
  );
}

export default QuillField;