import React, { useEffect, useState } from 'react';

export default function TrendingPage() {
    const [trendingVideos, setTrendingVideos] = useState([]);

    useEffect(() => {
        // This endpoint will return data sorted natively by the backend TreeMap
        fetch('http://localhost:5000/api/videos/trending')
            .then(res => res.json())
            .then(data => setTrendingVideos(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="trending-container">
            <h1>Trending Now</h1>
            <div className="video-grid">
                {trendingVideos.map(video => (
                    <div key={video.id} className="video-card">
                        <h3>{video.title}</h3>
                        <p>Views: {video.views}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}