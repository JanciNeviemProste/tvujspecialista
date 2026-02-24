'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { VideoControls } from '@/components/academy/VideoControls';
import type { Video } from '@/types/academy';

/**
 * Pridá Cloudinary transformáciu pre browser-kompatibilný formát (MP4 + H.264 + AAC).
 * Rieši MEDIA_ERR_DECODE keď originálny súbor má nekompatibilný kodek.
 */
function ensureBrowserCompatibleUrl(url: string): string {
  if (!url || !url.includes('/video/upload/')) return url;
  // Ak už obsahuje transformácie, nepridávaj duplicitne
  if (url.includes('/f_mp4') || url.includes('/vc_h264')) return url;
  return url.replace('/video/upload/', '/video/upload/f_mp4,vc_h264/');
}

interface VideoPlayerProps {
  video: Video;
  lessonId: string;
  onProgressUpdate: (watchTimeSeconds: number) => void;
  onComplete: () => void;
  className?: string;
}

export function VideoPlayer({
  video,
  lessonId,
  onProgressUpdate,
  onComplete,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressUpdateRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Progress tracking with 30s debounce — uses ref to avoid constant interval restart
  useEffect(() => {
    if (!isPlaying) return;

    progressTimerRef.current = setInterval(() => {
      const currentSeconds = Math.floor(currentTimeRef.current);
      if (currentSeconds > lastProgressUpdateRef.current) {
        onProgressUpdate(currentSeconds);
        lastProgressUpdateRef.current = currentSeconds;
      }
    }, 30000);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, onProgressUpdate]);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        setVideoError('Video sa nepodarilo prehrať. Skúste obnoviť stránku.');
      });
    }
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const time = value[0];
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (newMuted) {
      setVolume(0);
    } else {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Video not ready
  if (video.status !== 'ready') {
    return (
      <div
        className={cn(
          'relative bg-black aspect-video flex items-center justify-center',
          className,
        )}
      >
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-white text-lg">Video sa spracováva...</p>
          <p className="text-gray-400 text-sm">Skúste to prosím neskôr</p>
        </div>
      </div>
    );
  }

  // No cloudinary URL available
  if (!video.cloudinaryUrl) {
    return (
      <div
        className={cn(
          'relative bg-black aspect-video flex items-center justify-center',
          className,
        )}
      >
        <div className="text-center space-y-2">
          <p className="text-white text-lg">Video nie je dostupné</p>
          <p className="text-gray-400 text-sm">
            Skúste obnoviť stránku alebo kontaktujte podporu
          </p>
        </div>
      </div>
    );
  }

  // Video playback error
  if (videoError) {
    return (
      <div
        className={cn(
          'relative bg-black aspect-video flex items-center justify-center',
          className,
        )}
      >
        <div className="text-center space-y-3">
          <p className="text-white text-lg">Chyba prehrávania videa</p>
          <p className="text-gray-400 text-sm">{videoError}</p>
          <Button
            variant="ghost"
            className="text-blue-400 hover:text-blue-300"
            onClick={() => setVideoError(null)}
          >
            Skúsiť znova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-black aspect-video group', className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video element — src priamo v JSX, React event handlery */}
      <video
        ref={videoRef}
        src={ensureBrowserCompatibleUrl(video.cloudinaryUrl)}
        className="w-full h-full"
        preload="metadata"
        playsInline
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setVideoError(null);
          }
        }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            const t = videoRef.current.currentTime;
            setCurrentTime(t);
            currentTimeRef.current = t;
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onCompleteRef.current();
        }}
        onError={() => {
          const err = videoRef.current?.error;
          setVideoError(
            err
              ? `Chyba prehrávania (${err.code}): ${err.message}`
              : 'Neznáma chyba prehrávania',
          );
        }}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0',
        )}
        onClick={togglePlay}
      >
        {/* Center play button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            >
              <Play className="h-10 w-10 fill-current" />
            </Button>
          </div>
        )}

        {/* Bottom controls */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div onClick={(e) => e.stopPropagation()}>
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            showControls={showControls}
            onTogglePlay={togglePlay}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
}
