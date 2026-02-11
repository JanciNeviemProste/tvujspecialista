'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useVideoStreamUrl } from '@/lib/hooks/useAcademy';
import { VideoControls } from '@/components/academy/VideoControls';
import type { Video } from '@/types/academy';

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Fetch video stream URL
  const { data: streamData, isLoading, error } = useVideoStreamUrl(video.id);

  // Setup video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !streamData?.streamUrl) return;

    videoElement.src = streamData.streamUrl;
    videoElement.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [streamData, volume, onComplete]);

  // Progress tracking with 30s debounce
  useEffect(() => {
    if (!isPlaying) return;

    progressTimerRef.current = setInterval(() => {
      const currentSeconds = Math.floor(currentTime);
      if (currentSeconds > lastProgressUpdateRef.current) {
        onProgressUpdate(currentSeconds);
        lastProgressUpdateRef.current = currentSeconds;
      }
    }, 30000); // 30 seconds

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, currentTime, onProgressUpdate]);

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
      videoRef.current.play();
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
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-white text-lg">Video sa spracováva...</p>
          <p className="text-muted-foreground text-sm">Skúste to prosím neskôr</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'relative bg-black aspect-video flex items-center justify-center',
          className,
        )}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !streamData) {
    return (
      <div
        className={cn(
          'relative bg-black aspect-video flex items-center justify-center',
          className,
        )}
      >
        <div className="text-center space-y-2">
          <p className="text-white text-lg">Video nie je dostupné</p>
          <p className="text-muted-foreground text-sm">
            Skúste obnoviť stránku alebo kontaktujte podporu
          </p>
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
      {/* Video element */}
      <video ref={videoRef} className="w-full h-full" onClick={togglePlay} />

      {/* Controls overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* Center play button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-20 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
              onClick={togglePlay}
            >
              <Play className="h-10 w-10 fill-current" />
            </Button>
          </div>
        )}

        {/* Bottom controls */}
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
  );
}
