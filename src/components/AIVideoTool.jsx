// AIVideoTool.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import avatars from '../data/AIAvatarData';
import '../styles/AIVideoDemoSection.css';

export default function AIVideoTool() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(3);
    const [avatarData, setAvatarData] = useState(avatars);
    const selectorRef = useRef(null);

  
  const SCRIPT_MAX_LENGTH = 250;

  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === selectedAvatarId),
    [selectedAvatarId]
  );

  useEffect(() => {
    if (selectorRef.current) {
      const selectedElement = selectorRef.current.querySelector('.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selectedAvatarId]);

  const charactersLeft = SCRIPT_MAX_LENGTH - (selectedAvatar?.script?.length || 0);

 const handleScriptChange = (e) => {
  const newScript = e.target.value;
  setAvatarData(currentAvatars => 
    currentAvatars.map(avatar => 
      avatar.id === selectedAvatarId 
        ? { ...avatar, script: newScript } 
        : avatar
    )
  );
};

  return (
    <div className="ai-video-tool-container">
        <div className="ai-video-tool">
          <div className="form-panel">
            
            <span className="free-demo-badge">FREE DEMO</span>
            <h1 className="title">Try out our free AI Video Tool</h1>

            {/* Step 1: Avatar Selection */}
            <div className="step">
              <p className="step-label">1. Select an AI avatar</p>
              <div className="avatar-selector" ref={selectorRef}>
                {avatarData.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`avatar-option ${
                      avatar.id === selectedAvatarId ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                  >
                    <div className="avatar-name-overlay">AVATAR: {avatar.name.toUpperCase()}</div>
                    <img src={avatar.thumbnail} alt={avatar.name} />
                  </div>
                ))}
              </div>
              <div className="avatar-dots">
                {avatarData.map((avatar) => (
                  <span
                    key={avatar.id}
                    className={`dot ${
                      avatar.id === selectedAvatarId ? 'active' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          {/* Step 2: Script Input */}
          <div className="step">
              <p className="step-label">2. Type your script</p>
              <textarea
                className="script-textarea"
                value={selectedAvatar?.script || ''}
                onChange={handleScriptChange}
                maxLength={SCRIPT_MAX_LENGTH}
                placeholder="Select an avatar and start typing..."
              />
              <p className="char-counter">{charactersLeft} characters left</p>
            </div>

            <button className="create-video-btn">
              Create free AI video &rarr;
            </button>
            <p className="disclaimer">
              Political, inappropriate and discriminatory content will not be approved.
            </p>
          </div>

        {/* --- Updated Preview Panel (with video) --- */}
        <div className="preview-panel">
            {selectedAvatar && (
              <div className="avatar-preview">
                <video
                  key={selectedAvatar.video} // Add key to force re-render on source change
                  src={selectedAvatar.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="avatar-video"
                />
                <p className="avatar-name">AVATAR: {selectedAvatar.name}</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
