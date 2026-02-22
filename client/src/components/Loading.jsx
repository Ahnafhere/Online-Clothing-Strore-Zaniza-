import React from 'react';
import zanizaLogo from '../assets/zaniza-logo.png';
import './Loading.css';

const Loading = ({ message = "Loading Collection..." }) => {
    return (
        <div className="global-loading-container">
            <div className="loading-content">
                <div className="loading-logo-wrap">
                    <img src={zanizaLogo} alt="Zaniza" className="loading-logo" />
                </div>
                <div className="loading-spinner"></div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default Loading;
