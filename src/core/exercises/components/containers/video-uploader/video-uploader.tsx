import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import MuiButton from '@mui/material/Button';
import MuiStack from '@mui/material/Stack';
import { VIDEO_FILE_EXTENSIONS, VIDEO_FILE_MAX_SIZE } from '@/constants/file-extensions';
import Dropzone from '@/core/components/presentational/dropzone';
import Spinner from '@/core/components/presentational/spinner';
import { useSnackbar } from '@/core/context/snackbar';
import { useTranslation } from '@/core/i18n/context';
import useMutationUploadVideo from '../../../hooks/useMutationUploadVideo';

const VideoUploader = () => {
  const [filesState, setFilesState] = useState<Array<File>>([]);
  const uploadVideo = useMutationUploadVideo();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const handleSelectFile = useCallback((files: Array<File>) => {
    setFilesState(files);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    snackbar.error(errorMessage);
  }, [snackbar]);

  const handleUpload = useCallback(() => {
    if (filesState.length === 0) {
      snackbar.caution(t('videos-page.uploader.video-required'));
      return;
    }

    uploadVideo.mutate(filesState[0]);
  }, [uploadVideo, filesState, snackbar, t]);

  useEffect(() => {
    if (uploadVideo.status === 'success') {
      setFilesState([]);
      snackbar.success(t('videos-page.uploader.mutation.success'));
      uploadVideo.reset();
    }

    if (uploadVideo.status === 'error') {
      const error = uploadVideo.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      uploadVideo.reset();
    }
  }, [uploadVideo, snackbar, t]);

  return (
    <>
      <Spinner loading={uploadVideo.status === 'pending'} label={t('videos-page.uploader.mutation.loading')} />
      <MuiStack sx={{ width: '100%' }} direction="column" alignItems="start" spacing={2}>
        <MuiButton
          variant="outlined"
          onClick={handleUpload}
          disabled={uploadVideo.status === 'pending' || !filesState.length}
        >
          {t('videos-page.uploader.button')}
        </MuiButton>
        <Dropzone
          maxFiles={1}
          maxFileSize={VIDEO_FILE_MAX_SIZE}
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
