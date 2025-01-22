import { forwardRef, useCallback, useEffect, useState } from 'react';
import MuiButton from '@mui/material/Button';
import MuiCheckCircleIcon from '@mui/icons-material/CheckCircle';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiSlide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from '@/core/i18n/context';
import VideosGallery from './videos-gallery';

import type { Video } from '@/types/exercise';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <MuiSlide direction="up" ref={ref} {...props} />;
});

interface VideosGalleryDialogProps {
  selectedVideo?: Video | null;
  onSelectVideo?: (video: Video) => void;
  [key: string]: any;
}

const VideosGalleryDialog = ({
  selectedVideo = null,
  onSelectVideo,
  ...buttonProps
}: VideosGalleryDialogProps) => {
  const [selectedVideoState, setSelectedVideoState] = useState<Video | null>(selectedVideo);
  const [isOpenState, setIsOpenState] = useState(false);
  const [confirmState, setConfirmState] = useState(false);
  const { t } = useTranslation();

  const handleOnApply = useCallback(() => {
    if (onSelectVideo && selectedVideoState) {
      setConfirmState(true);
      onSelectVideo(selectedVideoState);
    }
    setIsOpenState(false);
  }, [onSelectVideo, selectedVideoState]);

  const handleClose = useCallback(() => {
    setIsOpenState(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpenState(true);
  }, []);

  useEffect(() => {
    setSelectedVideoState(selectedVideo);
    if (!selectedVideo) {
      setConfirmState(false);
    }
  }, [selectedVideo]);

  return (
    <>
      <MuiButton
        aria-label={t('videos-page.gallery.button')}
        onClick={handleOpen}
        variant="outlined"
        color={confirmState ? 'success' : 'primary'}
        endIcon={confirmState ? <MuiCheckCircleIcon /> : undefined}
        {...buttonProps}
      >
        {t('videos-page.gallery.button')}
      </MuiButton>
      <MuiDialog
        fullScreen
        open={isOpenState}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <MuiDialogTitle>{t('videos-page.gallery.dialog.title')}</MuiDialogTitle>
        <MuiDialogContent>
          <VideosGallery
            selectedVideo={selectedVideoState}
            onSelectVideo={(video: Video) => setSelectedVideoState(video)}
          />
        </MuiDialogContent>
        <MuiDialogActions>
          <MuiButton
            aria-label={t('common.wordings.close')}
            onClick={handleClose}
          >
            {t('common.wordings.close')}
          </MuiButton>
          <MuiButton
            aria-label={t('common.wordings.confirm')}
            variant="contained"
            disabled={!selectedVideoState}
            onClick={handleOnApply}
          >
            {t('common.wordings.confirm')}
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>
    </>
  );
};

export default VideosGalleryDialog;
