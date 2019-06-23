import React from 'react';

const Loading = () => {
    return (
        <div className="loading_container">
            <div className="circle_box">
                <svg width="100" height="100">
                    <defs>
                        <linearGradient id="circlestroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: 'rgb(0, 90, 150)', stopOpacity: '1'}} />
                            <stop offset="100%" style={{stopColor: 'rgb(122, 201, 255)', stopOpacity: '1'}} />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" stroke="url(#circlestroke)" fill="white" stroke-width="4" className="loadingcircle" />
                </svg>
                <p>Loading...</p>
            </div>
        </div>
    )
}

export default Loading;