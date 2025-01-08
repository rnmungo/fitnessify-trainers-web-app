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
  acceptedFileTypes?: string[];
  onError?: (message: string) => void;
  onSelect?: (files: File[]) => void;
  selectedFiles?: File[];
};

const Dropzone: React.FC<DropzoneProps> = ({
  maxFiles = 1,
  acceptedFileTypes = [],
  onError = () => {},
  onSelect = () => {},
  selectedFiles = [],
}) => {
  const [selectedFilesState, setSelectedFilesState] = useState<File[]>(selectedFiles ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onError(`Solo puedes subir hasta ${maxFiles} archivo(s).`);
        return;
      }

      setSelectedFilesState(filteredFiles);
      onSelect(filteredFiles);
    },
    [maxFiles, acceptedFileTypes, onSelect, onError]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filteredFiles: File[] = Array.from(files).filter(file =>
      acceptedFileTypes.includes(file.type)
    );

    if (filteredFiles.length > maxFiles) {
      onError(`Solo puedes subir hasta ${maxFiles} archivo(s).`);
      return;
    }

    setSelectedFilesState(filteredFiles);
    onSelect(filteredFiles);
    resetInputReference();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
        <StyledCloudUploadIcon />
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
          {`${selectedFilesState.length} de ${maxFiles} archivos seleccionados`}
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
                aria-label="delete"
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
