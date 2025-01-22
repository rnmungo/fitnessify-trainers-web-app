import { useCallback, useEffect, useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import MuiButton from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import MuiCardActionArea from '@mui/material/CardActionArea';
import MuiCardMedia from '@mui/material/CardMedia';
import MuiChip from '@mui/material/Chip';
import MuiGrid from '@mui/material/Grid2';
import MuiSkeleton from '@mui/material/Skeleton';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@/core/i18n/context';
import { getFileExtension, removeFileExtension } from '@/utilities/file.utility';
import useQueryVideos from '../../../hooks/useQueryVideos';

import type { Video } from '@/types/exercise';

interface VideoGalleryProps {
  selectedVideo?: Video | null;
  onSelectVideo?: (video: Video) => void;
}

const VideosGallery: React.FC<VideoGalleryProps> = ({ selectedVideo = null, onSelectVideo = () => {} }) => {
  const [selectedVideoState, setSelectedVideoState] = useState<Video | null>(selectedVideo);
  const { data: videos, status, refetch } = useQueryVideos();
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    setSelectedVideoState(selectedVideo);
  }, [selectedVideo]);

  const handleSelectVideo = useCallback((video: Video) => {
    setSelectedVideoState(video);
    if (onSelectVideo) {
      onSelectVideo(video);
    }
  }, [onSelectVideo]);

  return (
    <MuiGrid container spacing={2}>
      {status === 'pending' && Array.from(new Array(6)).map((_, index) => (
        <MuiGrid key={index} sx={{ gap: 0 }} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <MuiCard sx={{ width: '100%' }}>
            <MuiSkeleton variant="rectangular" width="100%" height={200} />
            <MuiStack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{
                px: 1,
                py: 2,
              }}
            >
              <MuiSkeleton
                variant="text"
                width={200}
                height={40}
              />
              <MuiSkeleton
                variant="text"
                width={60}
                height={40}
              />
            </MuiStack>
          </MuiCard>
        </MuiGrid>
      ))}
      {status === 'error' && (
        <MuiGrid size={12} sx={{ width: '100%' }}>
          <MuiAlert
            severity="error"
            variant="outlined"
            action={
              <MuiButton
                aria-label={t('common.wordings.retry')}
                color="inherit"
                size="small"
                onClick={() => refetch()}
              >
                {t('common.wordings.retry')}
              </MuiButton>
            }
          >
            {t('videos-page.gallery.alert.error')}
          </MuiAlert>
        </MuiGrid>
      )}
      {status === 'success' && videos && videos.map(video => {
        const fileExtension = getFileExtension(video.title);
        const titleWithoutExtension = removeFileExtension(video.title);

        return (
          <MuiGrid key={video.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <MuiCard
              sx={{
                border: selectedVideoState?.id === video.id ? `2px solid ${theme.palette.primary.main}` : '',
                width: '100%',
              }}
            >
              <MuiCardMedia
                component="video"
                src={video.url}
                controls
                sx={{
                  height: 'auto',
                  objectFit: 'cover',
                  aspectRatio: 16 / 9,
                }}
              />
              <MuiCardActionArea onClick={() => handleSelectVideo(video)}>
                <MuiTypography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    px: 1,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {titleWithoutExtension}
                  {fileExtension && (
                    <MuiChip
                      label={fileExtension}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </MuiTypography>
              </MuiCardActionArea>
            </MuiCard>
          </MuiGrid>
        );
      })}
    </MuiGrid>
  );
};

export default VideosGallery;
