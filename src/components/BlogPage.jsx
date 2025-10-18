import React, { useRef } from "react";
import { blogData, categoryMap } from "../data/blogData";
import "../styles/BlogPage.css";

const BlogCard = ({ post, cardType, forceTextLeft }) => {
  let bgClass = "";
  if (cardType === "chrome") bgClass = "bg-chrome-light";
  else if (cardType === "ai") bgClass = "bg-ai-light";
  else if (cardType === "lighthouse") bgClass = "bg-lighthouse-light";

  let headerDirection = "row";
  let circleAlignmentClass = "align-left";
  let isAI = false;

  if (forceTextLeft) {
    headerDirection = "row";
    circleAlignmentClass = "align-right";
    isAI = true;
  } else if (cardType === "ai") {
    headerDirection = "row";
    circleAlignmentClass = "align-right";
    isAI = true;
  }

  const allBadges = [...(post.categories || []), ...(post.subCategories || [])];

  return (
    <div className={`blog-card ${cardType}`}>
      {/* Header */}
      <div className={`card-header-bg ${circleAlignmentClass} ${bgClass}`}>
        <div
          className={`circle-bg ${isAI ? "small-circle" : ""}`}
          style={{ background: post.headerBG }}
        >
          {isAI && <div className="icon-inside-circle">{post.svg}</div>}
        </div>
        <div
          className={`header-content ${headerDirection} ${
            isAI ? "justify-between text-left" : ""
          }`}
        >
          {!isAI && <span className="icon-header">{post.svg}</span>}
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
        <div className="card-tags">
          {allBadges.map((badgeName, index) => {
            const badgeStyle = categoryMap[badgeName] || { color: "#ccc", textColor: "#333" };
            return (
              <span
                key={index}
                className="card-tag"
                style={{ backgroundColor: badgeStyle.color, color: badgeStyle.textColor }}
              >
                {badgeName}
              </span>
            );
          })}
        </div>
        <div className="card-footer">
          <div className="author">{post.author}</div>
          <div className="date">{post.date}</div>
        </div>
      </div>
    </div>
  );
};

const BlogPage = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="blog-main-container">
      <h1 className="main-heading">From the Blog</h1>
      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={() => scroll("left")}>
          &#8249;
        </button>
        <div className="blog-grid carousel" ref={carouselRef}>
          {blogData.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              cardType={post.cardType}
              forceTextLeft={index === 1}
            />
          ))}
        </div>
        <button className="carousel-btn right" onClick={() => scroll("right")}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
