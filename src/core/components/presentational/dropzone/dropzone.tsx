import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiBox from '@mui/material/Box';
import MuiIconButton from '@mui/material/IconButton';
import MuiList from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemIcon from '@mui/material/ListItemIcon';
import MuiListItemText from '@mui/material/ListItemText';
import MuiPaper from '@mui/material/Paper';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import MuiCloudUploadIcon from '@mui/icons-material/CloudUpload';
import MuiDescriptionIcon from '@mui/icons-material/Description';
import MuiImageIcon from '@mui/icons-material/Image';
import MuiInsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MuiCloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/core/i18n/context';

const StyledPaper = styled(MuiPaper)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 200,
  border: '2px dashed grey',
  cursor: 'pointer',
}));

const StyledCloudUploadIcon = styled(MuiCloudUploadIcon)(() => ({
  fontSize: 50,
}));

const StyledInput = styled('input')(() => ({
  display: 'none',
}));

type DropzoneProps = {
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  onError?: (message: string) => void;
  onSelect?: (files: File[]) => void;
  selectedFiles?: File[];
};

const Dropzone = ({
  maxFiles = 1,
  maxFileSize = 0,
  acceptedFileTypes = [],
  onError = () => {},
  onSelect = () => {},
  selectedFiles = [],
}: DropzoneProps) => {
  const [selectedFilesState, setSelectedFilesState] = useState<File[]>(selectedFiles ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const preventDefault = (event: React.DragEvent | React.ChangeEvent | React.MouseEvent) => {
    event.preventDefault();
  };

  const resetInputReference = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      preventDefault(event);

      const files = event.dataTransfer?.files;
      if (!files) return;

      const filteredFiles: File[] = Array.from(files).filter(file =>
        acceptedFileTypes.includes(file.type)
      );

      if (filteredFiles.length > maxFiles) {
        onError(t('dropzone.validations.quantity', { maxFiles }));
        return;
      }

      if (filteredFiles.some(file => file.size > (maxFileSize ?? Infinity))) {
        onError(t('dropzone.validations.size', { maxSize: `${maxFileSize / (1024 * 1024)} MB` }));
        return;
      }

      setSelectedFilesState(filteredFiles);
      onSelect(filteredFiles);
    },
    [maxFiles, onSelect, acceptedFileTypes, onError, t, maxFileSize]
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filteredFiles: File[] = Array.from(files).filter(file =>
      acceptedFileTypes.includes(file.type)
    );

    if (filteredFiles.length > maxFiles) {
      onError(t('dropzone.validations.quantity', { maxFiles }));
      return;
    }

    if (filteredFiles.some(file => file.size > (maxFileSize ?? Infinity))) {
      onError(t('dropzone.validations.size', { maxSize: `${maxFileSize / (1024 * 1024)} MB` }));
      return;
    }

    setSelectedFilesState(filteredFiles);
    onSelect(filteredFiles);
    resetInputReference();
  }, [acceptedFileTypes, maxFileSize, maxFiles, onError, onSelect, t]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = selectedFilesState.filter((_, index) => index !== indexToRemove);
    setSelectedFilesState(newFiles);
    onSelect(newFiles);
    resetInputReference();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <MuiImageIcon />;
    } else if (type === 'application/pdf') {
      return <MuiDescriptionIcon />;
    } else {
      return <MuiInsertDriveFileIcon />;
    }
  };

  useEffect(() => {
    setSelectedFilesState(selectedFiles);
  }, [selectedFiles]);

  return (
    <MuiStack
      sx={{ width: '100%' }}
      direction="column"
      alignItems="center"
      spacing={2}
    >
      <StyledPaper
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onClick={handleClick}
      >
        <MuiStack
          sx={{ width: '100%' }}
          direction="column"
          alignItems="center"
          spacing={2}
        >
          <StyledCloudUploadIcon />
          {acceptedFileTypes.length > 0 && (
            <MuiTypography variant="body2" color="textSecondary">
              {t('dropzone.validations.accepted-types-size', {
                types: acceptedFileTypes.join(', '),
                maxSize: `${maxFileSize / (1024 * 1024)} MB`
                })}
            </MuiTypography>
          )}
        </MuiStack>
        <StyledInput
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          multiple={maxFiles > 1}
          accept={acceptedFileTypes.join(',')}
        />
      </StyledPaper>
      <MuiBox sx={{ alignSelf: 'flex-end' }}>
        <MuiTypography variant="body2" sx={{ mr: 1 }}>
          {t('dropzone.caption', { selected: selectedFilesState.length, maxFiles })}
        </MuiTypography>
      </MuiBox>
      <MuiList sx={{ width: '100%' }}>
        {selectedFilesState.map((selectedFile, index) => (
          <MuiListItem
            key={index}
            secondaryAction={
              <MuiIconButton
                color="primary"
                size="small"
                edge="end"
                aria-label={t('dropzone.list-selected-files.remove', { fileName: selectedFile.name })}
                onClick={() => handleRemoveFile(index)}
              >
                <MuiCloseIcon />
              </MuiIconButton>
            }
          >
            <MuiListItemIcon>{getFileIcon(selectedFile.type)}</MuiListItemIcon>
            <MuiListItemText primary={selectedFile.name} />
          </MuiListItem>
        ))}
      </MuiList>
    </MuiStack>
  );
};

export default Dropzone;
