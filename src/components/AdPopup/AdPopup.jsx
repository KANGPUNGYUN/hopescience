import React, { useState } from "react";
import "./AdPopup.css";

export const AdPopup = ({ ad, onClose, onHideForWeek, position, url }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClose = () => {
    if (isChecked) {
      onHideForWeek();
    } else {
      onClose();
    }
  };

  const ImageContent = () => {
    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={ad.imageUrl} alt={ad.title} style={{ cursor: 'pointer' }} />
        </a>
      );
    }
    return <img src={ad.imageUrl} alt={ad.title} />;
  };

  return (
    <div className={`ad-popup position-${position}`}>
      <ImageContent />
      <div className="ad-footer">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          오늘 하루 보지 않기
        </label>
        <button onClick={handleClose}>닫기</button>
      </div>
    </div>
  );
};