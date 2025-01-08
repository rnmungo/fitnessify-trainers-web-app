import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import MuiButton from '@mui/material/Button';
import MuiStack from '@mui/material/Stack';
import { VIDEO_FILE_EXTENSIONS } from '@/constants/file-extensions';
import Dropzone from '@/core/components/presentational/dropzone';
import Spinner from '@/core/components/presentational/spinner';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationVideo from '../../../hooks/useMutationVideo';

const VideoUploader: React.FC = () => {
  const [filesState, setFilesState] = useState<Array<File>>([]);
  const uploadVideo = useMutationVideo();
  const snackbar = useSnackbar();

  const handleSelectFile = useCallback((files: Array<File>) => {
    setFilesState(files);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    snackbar.error(errorMessage);
  }, [snackbar]);

  const handleUpload = useCallback(() => {
    if (filesState.length === 0) {
      snackbar.caution('Debe seleccionar un video');
      return;
    }

    uploadVideo.mutate(filesState[0]);
  }, [uploadVideo, filesState, snackbar]);

  useEffect(() => {
    if (uploadVideo.status === 'success') {
      setFilesState([]);
      snackbar.success('Video cargado correctamente');
      uploadVideo.reset();
    }

    if (uploadVideo.status === 'error') {
      const error = uploadVideo.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      uploadVideo.reset();
    }
  }, [uploadVideo, snackbar]);

  return (
    <>
      <Spinner loading={uploadVideo.status === 'pending'} label="Cargando video" />
      <MuiStack sx={{ width: '100%' }} direction="column" alignItems="start" spacing={2}>
        <MuiButton variant="outlined" onClick={handleUpload} disabled={uploadVideo.status === 'pending' || !filesState.length}>Subir</MuiButton>
        <Dropzone
          maxFiles={1}
          acceptedFileTypes={VIDEO_FILE_EXTENSIONS}
          onError={handleError}
          onSelect={handleSelectFile}
          selectedFiles={filesState}
        />
      </MuiStack>
    </>
  );
};

export default VideoUploader;
