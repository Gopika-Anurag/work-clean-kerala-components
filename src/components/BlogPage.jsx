// BlogPage.jsx
import React from "react";
import { blogData, categoryMap } from "../data/blogData";
import "../styles/BlogPage.css";

const BlogCard = ({ post, cardType, forceTextLeft }) => {
  // Background class
  let bgClass = "";
  if (cardType === "chrome") bgClass = "bg-chrome-light";
  else if (cardType === "ai") bgClass = "bg-ai-light";
  else if (cardType === "lighthouse") bgClass = "bg-lighthouse-light";

  // Header layout & circle alignment
  let headerDirection = "row"; // default Chrome/Lighthouse
  let circleAlignmentClass = "align-left"; // default Chrome/Lighthouse
  let isAI = false;

  // Override for forced left text (second card)
  if (forceTextLeft) {
    headerDirection = "row"; // text left, circle right
    circleAlignmentClass = "align-right";
    isAI = true; // use AI styling for alignment, circle size etc
  } else if (cardType === "ai") {
    headerDirection = "row";
    circleAlignmentClass = "align-right";
    isAI = true;
  }

  // Merge categories and subCategories
  const allBadges = [...(post.categories || []), ...(post.subCategories || [])];

  if (forceTextLeft) {
  headerDirection = "row";        // text left, circle right
  circleAlignmentClass = "align-right";
  isAI = true;                   // apply AI styling for circle size and alignment
}


  return (
    <div className={`blog-card ${cardType}`}>
      {/* Header */}
      <div className={`card-header-bg ${circleAlignmentClass} ${bgClass}`}>
        {/* Circle */}
        <div
          className={`circle-bg ${isAI ? "small-circle" : ""}`}
          style={{ background: post.headerBG }}
        >
          {isAI && <div className="icon-inside-circle">{post.svg}</div>}
        </div>

        {/* Header Content */}
        <div
          className={`header-content ${headerDirection} ${
            isAI ? "justify-between text-left" : ""
          }`}
        >
          {/* Non-AI icon */}
          {!isAI && <span className="icon-header">{post.svg}</span>}

          {/* Header Text */}
          <span
            className="header-text"
            style={{
              background: post.headerBG,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {post.headerText}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-desc">{post.description}</p>

        {/* Tags */}
        <div className="card-tags">
          {allBadges.map((badgeName, index) => {
            const badgeStyle = categoryMap[badgeName] || {
              color: "#ccc",
              textColor: "#333",
            };
            return (
              <span
                key={index}
                className="card-tag"
                style={{
                  backgroundColor: badgeStyle.color,
                  color: badgeStyle.textColor,
                }}
              >
                {badgeName}
              </span>
            );
          })}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="author">{post.author}</div>
          <div className="date">{post.date}</div>
        </div>
      </div>
    </div>
  );
};

const BlogPage = () => (
  <div className="blog-main-container">
    <h1 className="main-heading">From the Blog</h1>
    <div className="blog-grid">
      {blogData.map((post, index) => (
        <BlogCard
          key={post.id}
          post={post}
          cardType={post.cardType}
          forceTextLeft={index === 1} // Force second card text left
        />
      ))}
    </div>
  </div>
);

export default BlogPage;
