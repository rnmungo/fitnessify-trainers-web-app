import { useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from '@/core/context/snackbar';
import { useTranslation } from '@/core/i18n/context';
import useMutationDeleteVideo from '../../../../hooks/useMutationDeleteVideo';

import type { Video } from '@/types/exercise';

interface DeleteVideoDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  video?: Video | null;
  onVideoDeleted?: () => void;
}

const DeleteVideoDialog: React.FC<DeleteVideoDialogProps> = ({
  open = false,
  onClose,
  video = null,
  onVideoDeleted,
}) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const deleteVideo = useMutationDeleteVideo();

  useEffect(() => {
    if (deleteVideo.status === 'success') {
      snackbar.success(t('videos-page.actions.remove.mutation.success'));
      deleteVideo.reset();

      if (onVideoDeleted) {
        onVideoDeleted();
        onClose();
      }
    }

    if (deleteVideo.status === 'error') {
      const error = deleteVideo.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      deleteVideo.reset();
    }
  }, [deleteVideo, snackbar, onVideoDeleted, onClose, t]);

  const handleDelete = useCallback(() => {
    if (video) {
      deleteVideo.mutate(video.id);
    }
  }, [video, deleteVideo]);

  const isPending = deleteVideo.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-video-dialog-title"
      aria-describedby="delete-video-dialog-description"
    >
      <MuiDialogTitle id="delete-video-dialog-title">
        {t('common.wordings.wait')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-video-dialog-description">
          {t('videos-page.actions.remove.query')} <strong>{video?.title}</strong>? {t('common.wordings.action-cannot-undone')}
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton
          aria-label={t('common.wordings.cancel')}
          onClick={onClose}
          color="inherit"
          disabled={isPending}
        >
          {t('common.wordings.cancel')}
        </MuiButton>
        <MuiLoadingButton
          aria-label={t('common.wordings.delete')}
          color="error"
          loading={isPending}
          loadingIndicator={t('common.wordings.deleting')}
          variant="contained"
          onClick={handleDelete}
        >
          {t('common.wordings.delete')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeleteVideoDialog;
