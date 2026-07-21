import React, { useRef, useState, useEffect } from 'react';

export default function CustomVideoPlayer({ videoId, isWatchParty, roomCode }) {
    const videoRef = useRef(null);
    const wsRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (isWatchParty && roomCode) {
            wsRef.current = new WebSocket('ws://localhost:5000');
            
            wsRef.current.onopen = () => {
                wsRef.current.send(JSON.stringify({ type: 'JOIN_WATCH_PARTY', roomCode }));
            };

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'SYNC_PLAYER') {
                    if (Math.abs(videoRef.current.currentTime - data.time) > 1) {
                        videoRef.current.currentTime = data.time;
                    }
                    if (data.state === 'playing') videoRef.current.play();
                    else videoRef.current.pause();
                }
            };
        }
        return () => wsRef.current?.close();
    }, [isWatchParty, roomCode]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
            broadcastState('playing');
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
            broadcastState('paused');
        }
    };

    const broadcastState = (state) => {
        if (isWatchParty && wsRef.current) {
            wsRef.current.send(JSON.stringify({
                type: 'SYNC_PLAYER',
                time: videoRef.current.currentTime,
                state
            }));
        }
    };

    return (
        <div className="custom-player-container">
            <video 
                ref={videoRef} 
                src={`http://localhost:5000/api/videos/stream/${videoId}`} 
                onSeeked={() => broadcastState(isPlaying ? 'playing' : 'paused')}
                className="main-video"
            />
            <div className="custom-controls">
                <button onClick={togglePlay}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                {/* Add custom progress bars, volume controls, and settings here */}
            </div>
        </div>
    );
}

<video 
    ref={videoRef} 
    src={`http://localhost:5000/api/videos/stream/${videoId}`} 
    className="main-video"
    controls={false} // Disable default controls to force your custom UI
/>