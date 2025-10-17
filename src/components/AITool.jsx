// AIVideoTool.jsx
import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';import avatars from '../data/AIAvatarData';
import '../styles/AITool.css';

export default function AITool() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [avatarData, setAvatarData] = useState(avatars);
    const [script, setScript] = useState('');

  const selectorRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialMount = useRef(true); // Add this ref


  const SCRIPT_MAX_LENGTH = 250;

// useLayoutEffect(() => {
//     const originalScrollRestoration = window.history.scrollRestoration;

//     // Set to manual before scrolling
//     if ('scrollRestoration' in window.history) {
//       window.history.scrollRestoration = 'manual';
//     }
    
//     // Scroll to top before the page is painted
//     window.scrollTo(0, 0);

//     // Cleanup function to restore the original setting
//     return () => {
//       if ('scrollRestoration' in window.history) {
//         window.history.scrollRestoration = originalScrollRestoration;
//       }
//     };
//   }, []);

  // 🧩 Ensure avatar selector starts at the beginning on first load

  useEffect(() => {
  if (inputRef.current) {
    inputRef.current.textContent = '';
  }
}, []);


  // 🧠 Automatically select the first avatar when the component loads
  useEffect(() => {
    if (avatars.length > 0 && selectedAvatarId === null) {
      setSelectedAvatarId(avatars[0].id);
    }
  }, [selectedAvatarId]);

  // 🔹 Scroll selected avatar into view (mobile + desktop)
 useEffect(() => {
  // Check if it's the first render.
  if (isInitialMount.current) {
    // If it is, set the ref to false and do nothing else.
    isInitialMount.current = false;
  } else {
    // If it's not the first render (i.e., a user clicked an avatar), then run the scroll logic.
    if (selectorRef.current) {
      const selectedElement = selectorRef.current.querySelector('.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }
}, [selectedAvatarId]);

  useEffect(() => {
  if (selectorRef.current) {
    selectorRef.current.scrollTo({
      left: 0,
      behavior: 'instant' // ensures no animation
    });
  }
}, []);


  // 🔹 Ensure videos auto-play (handle browser restrictions)
  useEffect(() => {
    const videos = document.querySelectorAll('.avatar-video');
    videos.forEach((video) => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {}); // Retry silently
        });
      }
    });
  }, [avatarData, selectedAvatarId]);

  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === selectedAvatarId),
    [selectedAvatarId]
  );

  const charactersLeft = SCRIPT_MAX_LENGTH - (selectedAvatar?.script?.length || 0);

  const handleScriptChange = (e) => {
    const newScript = e.target.value;
    setAvatarData((currentAvatars) =>
      currentAvatars.map((avatar) =>
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
                  className={`avatar-option ${avatar.id === selectedAvatarId ? 'selected' : ''}`}
onClick={() => {
  setSelectedAvatarId(avatar.id);
  setScript(""); // 🧹 clear script text
  if (inputRef.current) {
    inputRef.current.textContent = ""; // clear div visually
  }
}}
                >
                  <div className="avatar-name-overlay">AVATAR: {avatar.name.toUpperCase()}</div>

                  {/* Desktop: Image preview */}
                  <img
                    src={avatar.thumbnail}
                    alt={avatar.name}
                    className="avatar-image desktop-only"
                  />

                  {/* Mobile: Only play selected video */}
                  {avatar.id === selectedAvatarId ? (
                    <video
                      key={avatar.video}
                      src={avatar.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="avatar-video mobile-only"
                    />
                  ) : (
                    <div className="avatar-video-placeholder mobile-only">
                      <img
                        src={avatar.thumbnail}
                        alt={avatar.name}
                        className="avatar-video-thumbnail"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dots for navigation */}
            <div className="avatar-dots">
              {avatarData.map((avatar, index) => (
                <span
                  key={avatar.id}
                  className={`dot ${avatar.id === selectedAvatarId ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAvatarId(avatar.id);
                    const element = selectorRef.current?.querySelector(
                      `.avatar-option:nth-child(${index + 1})`
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest'
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step 2: Script Input */}
<div className="step">
  <p className="step-label">2. Type your script</p>

  <div
    className="script-input-div"
    contentEditable
    suppressContentEditableWarning={true}
    ref={inputRef}
    onInput={(e) => {
      const value = e.currentTarget.textContent.trim();
      setScript(value);
    }}
    data-placeholder="Type your script here..."
  ></div>
</div>





          <button className="create-video-btn">
            Create free AI video &rarr;
          </button>
          <p className="disclaimer">
            Political, inappropriate and discriminatory content will not be approved.
          </p>
        </div>

        {/* --- Preview Panel (Desktop) --- */}
        <div className="preview-panel">
          {selectedAvatar && (
            <div className="avatar-preview">
              <video
                key={selectedAvatar.video}
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