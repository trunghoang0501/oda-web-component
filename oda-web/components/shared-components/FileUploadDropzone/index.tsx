import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Typography, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light}08`,
  },
  '&.drag-active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light}12`,
  },
}));

interface IFileUploadDropzone {
  onFileSelect: (file: File) => void;
  onFileError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  description?: string;
  multiple?: boolean;
  hideDetails?: boolean;
  showButton?: boolean;
  browseLinkLabel?: string;
  descriptionSuffix?: string;
  secondaryTextOverride?: string;
  iconColor?: string;
}

const FileUploadDropzone = (props: IFileUploadDropzone) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    onFileSelect,
    onFileError,
    accept = '*',
    maxSize,
    description,
    multiple = false,
    hideDetails = false,
    showButton = true,
    browseLinkLabel,
    descriptionSuffix,
    secondaryTextOverride,
    iconColor,
  } = props;

  const [isDragActive, setIsDragActive] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        onFileError?.(
          t(
            'file_too_large',
            `File size (${fileSizeMB}MB) exceeds the maximum limit (${maxSizeMB}MB).`
          )
        );
        return false;
      }

      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map((type) => type.trim());
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

        if (!acceptedTypes.includes(fileExtension)) {
          const acceptedFormats = acceptedTypes.join(', ');
          onFileError?.(
            t(
              'wrong_file_format',
              `Wrong file format. Only support uploading ${acceptedFormats} files.`
            )
          );
          return false;
        }
      }

      return true;
    },
    [maxSize, accept, onFileError, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelect(file);
          // Reset input value to allow selecting the same file again
          if (hiddenInputRef.current) {
            hiddenInputRef.current.value = '';
          }
        }
      }
    },
    [onFileSelect, validateFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [onFileSelect, validateFile]
  );

  const openFileDialog = useCallback(() => {
    hiddenInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <DropzoneContainer
      className={isDragActive ? 'drag-active' : ''}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <CloudUploadIcon
        sx={{
          fontSize: theme.spacing(16),
          color: iconColor || theme.palette.primary.main,
          marginBottom: theme.spacing(2),
          cursor: 'pointer',
        }}
        onClick={openFileDialog}
        role="button"
        aria-label={String(t('browse_files'))}
      />

      <Typography
        variant="h6"
        sx={{
          marginBottom: theme.spacing(1),
          fontWeight: 400,
          color: 'rgb(110, 107, 123)',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        }}
      >
        {description || t('drag_drop_or_browse_file')}
        {browseLinkLabel && (
          <>
            {' '}
            <Box
              component="span"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={openFileDialog}
            >
              {browseLinkLabel}
            </Box>
          </>
        )}
        {descriptionSuffix && <>{descriptionSuffix}</>}
      </Typography>

      {!hideDetails && (
        <Typography
          variant="body2"
          sx={{
            marginBottom: theme.spacing(4),
            color: theme.palette.text.secondary,
          }}
        >
          {secondaryTextOverride || (
            <>
              {t('supported_formats')}: {accept}
              {maxSize && (
                <>
                  <br />
                  {t('max_file_size')}: {formatFileSize(maxSize)}
                </>
              )}
            </>
          )}
        </Typography>
      )}

      {showButton && (
        <Button
          variant="outlined"
          component="label"
          sx={{
            borderRadius: theme.spacing(2),
            textTransform: 'none',
            fontWeight: 500,
            px: theme.spacing(4),
            py: theme.spacing(2),
          }}
        >
          {t('browse_files')}
          <input
            type="file"
            hidden
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
          />
        </Button>
      )}

      {/* Hidden input for link-based browse */}
      <input
        ref={hiddenInputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
      />
    </DropzoneContainer>
  );
};

export default FileUploadDropzone;
