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
import useMutationDeleteVideo from '../../../../hooks/useMutationDeleteVideo';

import type { Video } from '@/types/exercise';

interface DeleteVideoDialogProps {
  open: boolean;
  onClose: () => void;
  video?: Video | null;
  onVideoDeleted?: () => void;
}

const DeleteVideoDialog: React.FC<DeleteVideoDialogProps> = ({
  open = false,
  onClose,
  video = null,
  onVideoDeleted,
}) => {
  const snackbar = useSnackbar();
  const deleteVideo = useMutationDeleteVideo();

  useEffect(() => {
    if (deleteVideo.status === 'success') {
      snackbar.success('El video ha sido eliminado correctamente.');
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
  }, [deleteVideo, snackbar, onVideoDeleted, onClose]);

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
        Aguarde
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-video-dialog-description">
          ¿Estás seguro que deseas eliminar el video <strong>{video?.title}</strong>? Esta acción no se puede deshacer.
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="error"
          loading={isPending}
          loadingIndicator="Eliminando..."
          variant="contained"
          onClick={handleDelete}
        >
          Eliminar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeleteVideoDialog;
