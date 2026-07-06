import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css";
import ReactCompareImage from "react-compare-image";
import aiResultImage from "./image1.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Main() {

  // ---------- STATE ----------
  const [uploadedImages, setUploadedImages] = useState([]);
  const [renderResults, setRenderResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("Hiện đại (Modern)");
  const [selectedBuildingType, setSelectedBuildingType] =
    useState("Căn hộ (Apartment)");
  const [selectedOutdoorStyle, setSelectedOutdoorStyle] =
    useState("Hiện đại (Modern)");

  // Zoom state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState(null);
  const [zoomTab, setZoomTab] = useState("after");

  const fileInputRef = useRef();

  // ---------- UPLOAD ----------
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...newUrls]);
    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // ---------- RENDER (giả lập) ----------
  const handleRender = () => {
    if (uploadedImages.length === 0) {
      alert("Vui lòng upload ít nhất một ảnh để render!");
      return;
    }

    const newResults = uploadedImages.map((imageUrl, index) => ({
      id: Date.now() + index,
      before: imageUrl,
      after: aiResultImage,
      title: `Render ${renderResults.length + index + 1}`,
      style: selectedStyle,
      time: new Date().toLocaleString(),
    }));

    const updatedResults = [...renderResults, ...newResults];
    setRenderResults(updatedResults);
    const firstNewIndex = renderResults.length;
    setActiveResultIndex(firstNewIndex);
  };

  // ---------- ZOOM ----------
  const openZoom = (result, tab = "after") => {
    setZoomImageUrl(tab === "before" ? result.before : result.after);
    setZoomTab(tab);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomImageUrl(null);
  };

  const handleSelectResult = (index) => {
    setActiveResultIndex(index);
  };

  const activeResult =
    activeResultIndex !== null && renderResults.length > 0
      ? renderResults[activeResultIndex]
      : null;

  // ---------- RENDER ----------

  // -----------API--------------
  // const handleApiCall = async (imageUrls) => {
  //   try {
  //     const response = await fetch("https://api.example.com/endpoint", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         // Add your request body here
  //         imageUrls: imageUrls
  //       }),
  //     });
  //     const data = await response.json();
  //     // Handle the API response
  //   } catch (error) {
  //     console.error("Error calling API:", error);
  //   }
  // };

  // -----------Download All Images--------------
  const handleDownloadAll = () => {
    if (renderResults.length === 0) {
      alert("Không có kết quả để tải xuống!");
      return;
    }
    alert("Tính năng tải xuống tất cả ảnh chưa được triển khai.");

  }
  return (
    <div className="architecture-app-container">
      <div className="container-fluid px-4">
        <div className="row g-4 align-items-start">
          {/* ===== CỘT TRÁI: ĐIỀU KHIỂN ===== */}
          <div className="col-lg-4 col-xl-3">
            {/* Bước 1: Upload */}
            <div className="arch-card mb-4">
              <div className="arch-card-header">
                <span className="step-number">01</span>
                <h5 className="arch-card-title">Mặt Bằng Bản Vẽ 2D</h5>
              </div>
              <div className="arch-card-body">
                <div className="arch-upload-zone">
                  {uploadedImages.length === 0 ? (
                    <>
                      <div onClick={handleUploadClick}>
                        <div className="upload-icon-wrapper mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <p className="upload-text mb-1">
                          Tải lên sơ đồ mặt bằng
                        </p>
                        <span className="upload-hint">
                          Hỗ trợ định dạng: PNG, JPG
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="uploaded-images-grid">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="uploaded-thumb-wrapper">
                          <img src={url} alt={`Ảnh ${index + 1}`} />
                          <button
                            className="remove-thumb-btn"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div
                        className="uploaded-thumb-wrapper add-more"
                        onClick={handleUploadClick}
                      >
                        <span>+</span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    multiple
                  />
                </div>
              </div>
            </div>

            {/* Bước 2: Tùy chỉnh thông số */}
            <div className="arch-card">
              <div className="arch-card-header">
                <span className="step-number">02</span>
                <h5 className="arch-card-title">Tham Số Phối Cảnh</h5>
              </div>
              <div className="arch-card-body">
                <div className="ai-info-alert mb-4">
                  <div className="ai-badge">AI PROCESSOR</div>
                  <p className="m-0">
                    Hệ thống tự động lọc bỏ các văn bản, thông số kích thước kỹ
                    thuật và ký hiệu nhiễu để tái cấu trúc không gian hình khối.
                  </p>
                </div>

                <div className="form-group-arch mb-3">
                  <label className="arch-label">Loại Hình Công Trình</label>
                  <select
                    className="arch-select"
                    value={selectedBuildingType}
                    onChange={(e) => setSelectedBuildingType(e.target.value)}
                  >
                    <option>Căn hộ (Apartment)</option>
                    <option>Biệt thự sân vườn (Villa)</option>
                    <option>Nhà phố thương mại (Shophouse)</option>
                  </select>
                </div>

                <div className="form-group-arch mb-3">
                  <label className="arch-label">Phong Cách Nội Thất</label>
                  <select
                    className="arch-select"
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  >
                    <option>Hiện đại (Modern)</option>
                    <option>Tối giản (Minimalism)</option>
                    <option>Bắc Âu (Scandinavian)</option>
                    <option>Đông Dương (Indochine)</option>
                    <option>Tân cổ điển (Neo-Classical)</option>
                    <option>Công nghiệp (Industrial)</option>
                    <option>Mộc mạc (Rustic)</option>
                    <option>Nhiệt đới (Tropical)</option>
                    <option>Địa Trung Hải (Mediterranean)</option>
                    <option>Japandi</option>
                    <option>Zen</option>
                  </select>
                </div>

                <div className="form-group-arch mb-3">
                  <label className="arch-label">Phong Cách Ngoại Thất</label>
                  <select
                    className="arch-select"
                    value={selectedOutdoorStyle}
                    onChange={(e) => setSelectedOutdoorStyle(e.target.value)}
                  >
                    <option>Hiện đại (Modern)</option>
                    <option>Tối giản (Minimalism)</option>
                    <option>Tân cổ điển (Neo-Classical)</option>
                    <option>Địa Trung Hải (Mediterranean)</option>
                    <option>Nhà vườn / Nhiệt đới</option>
                  </select>
                </div>

                <button
                  className="btn-arch-primary w-100"
                  onClick={handleRender}
                >
                  <span>KHỞI TẠO KHÔNG GIAN 3D</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ===== CỘT PHẢI: HIỂN THỊ KẾT QUẢ ===== */}
          <div className="col-lg-8 col-xl-9">
            <div className="arch-card viewport-card">
              <div className="arch-card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="live-indicator"></div>
                  <h5 className="arch-card-title m-0">
                    Studio Mô Phỏng Ánh Sáng & Vật Liệu 3D
                  </h5>
                </div>
                <div className="viewport-actions">
                  <button className="btn-arch-secondary btn-sm" onClick={handleDownloadAll}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Tải Toàn Bộ Ảnh
                  </button>
                </div>
              </div>

              <div className="arch-card-body">
                {/* Vùng so sánh lớn */}
                <div className="arch-preview-viewport mb-4">
                  {activeResult ? (
                    <>
                      <ReactCompareImage
                        leftImage={activeResult.before}
                        rightImage={activeResult.after}
                        sliderPositionPercentage={0.5}
                        leftImageLabel="Before"
                        rightImageLabel="After"
                      />
                      <button
                        className="zoom-btn-overlay"
                        onClick={() => openZoom(activeResult, "after")}
                        title="Phóng to ảnh"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="empty-viewport-state">
                      <div className="blueprint-grid-bg"></div>
                      <p className="text-muted text-uppercase tracking-wider">
                        Không gian kiến trúc trực quan sẽ xuất hiện tại đây sau
                        khi render
                      </p>
                    </div>
                  )}
                </div>

                {/* Gallery kết quả */}
                {renderResults.length > 0 && (
                  <div className="results-gallery-section mt-4">
                    <h6 className="arch-gallery-title mb-3">
                      Lịch sử Render ({renderResults.length} kết quả)
                    </h6>
                    <div className="results-grid-scroll">
                      {renderResults.map((result, index) => (
                        <div
                          key={result.id}
                          className={`result-pair-card ${index === activeResultIndex ? "active" : ""}`}
                          onClick={() => handleSelectResult(index)}
                        >
                          <div className="pair-thumbnails-preview">
                            <div className="mini-thumb">
                              <img src={result.before} alt="Gốc" />
                              <span className="thumb-tag tag-before">Gốc</span>
                            </div>
                            <div className="mini-thumb">
                              <img src={result.after} alt="AI" />
                              <span className="thumb-tag tag-after">3D</span>
                            </div>
                          </div>
                          <div className="pair-title">{result.title}</div>
                          <div className="pair-meta">
                            <span className="meta-style">{result.style}</span>
                            <span className="meta-time">{result.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Zoom */}
      {isZoomOpen && zoomImageUrl && (
        <div className="zoom-modal-overlay" onClick={closeZoom}>
          <div
            className="zoom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="zoom-close-btn" onClick={closeZoom}>
              ×
            </button>

            {/* Tabs chọn Before / After */}
            <div className="zoom-tabs">
              <button
                className={zoomTab === "before" ? "active" : ""}
                onClick={() => {
                  setZoomTab("before");
                  if (activeResult) setZoomImageUrl(activeResult.before);
                }}
              >
                Ảnh gốc
              </button>
              <button
                className={zoomTab === "after" ? "active" : ""}
                onClick={() => {
                  setZoomTab("after");
                  if (activeResult) setZoomImageUrl(activeResult.after);
                }}
              >
                Ảnh AI
              </button>
            </div>

            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="zoom-controls">
                    <button onClick={() => zoomIn()}>+</button>
                    <button onClick={() => zoomOut()}>−</button>
                    <button onClick={() => resetTransform()}>⟲</button>
                  </div>
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={zoomImageUrl}
                      alt="Zoom"
                      style={{
                        width: "80%",
                        height: "80%",
                        objectFit: "contain",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
