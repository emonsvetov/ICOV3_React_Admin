import React from "react";

const TooltipPopup = ({
  title,
  text,
  children,
  openTooltipPopup,
  handleCloseTooltipPopup,
  handleOpenTooltipPopup,
}) => {
  const tooltipContainerStyle = {
    position: "relative",
    display: "inline-block",
  };

  const tooltipContentStyle = {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translate(-50%, 10px)", // Adjust the vertical position as needed
    backgroundColor: "#333",
    color: "#fff",
    padding: "5px",
    borderRadius: "4px",
    fontSize: "14px",
    opacity: "0.9",
    zIndex: "1",
    display: openTooltipPopup == title ? "block" : "none",
    width: "300px",
    height: "auto",
    wordWrap: "break-word",
  };

  const createMarkup = (value) => {
    return { __html: value };
  };

  return (
    <div
      style={tooltipContainerStyle}
      onMouseEnter={handleOpenTooltipPopup}
      onMouseLeave={handleCloseTooltipPopup}
    >
      {children}
      <div
        style={tooltipContentStyle}
        dangerouslySetInnerHTML={createMarkup(text)}
      ></div>
    </div>
  );
};

export default TooltipPopup;
