import React from 'react';
import { useRouter } from 'next/router';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import LiveChat from '../components/LiveChat';

export default function WatchPage() {
    const router = useRouter();
    const { v: videoId, party: roomCode } = router.query;

    if (!videoId) return <div>Loading player...</div>;

    return (
        <div className="watch-layout">
            <div className="player-section">
                <CustomVideoPlayer 
                    videoId={videoId} 
                    isWatchParty={!!roomCode} 
                    roomCode={roomCode} 
                />
                <div className="video-metadata">
                    <h1>Video Title Placeholder</h1>
                    <button onClick={() => alert('Kronos helper engagement action triggered')}>Like</button>
                    <button onClick={() => alert('Kronos helper engagement action triggered')}>Subscribe</button>
                </div>
            </div>
            <div className="engagement-section">
                <LiveChat videoId={videoId} />
            </div>
        </div>
    );
}