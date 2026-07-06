import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css";
import ReactCompareImage from "react-compare-image";
// Ảnh mẫu cho kết quả AI (bạn có thể thay bằng ảnh khác)
import aiResultImage from "./image1.png";

function Main() {
  // ---------- STATE ----------
  // Danh sách ảnh chờ render (URL objects)
  const [uploadedImages, setUploadedImages] = useState([]);
  // Kết quả render: mỗi item { id, before, after, title, style, time }
  const [renderResults, setRenderResults] = useState([]);
  // Chỉ số kết quả đang xem (null nếu chưa có)
  const [activeResultIndex, setActiveResultIndex] = useState(null);

  // Các state tùy chọn (giữ nguyên từ code cũ)
  const [selectedStyle, setSelectedStyle] = useState("Hiện đại (Modern)");
  const [selectedBuildingType, setSelectedBuildingType] = useState(
    "Căn hộ (Apartment)"
  );
  const [selectedOutdoorStyle, setSelectedOutdoorStyle] = useState(
    "Hiện đại (Modern)"
  );

  const fileInputRef = useRef();

  // ---------- XỬ LÝ UPLOAD ----------
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    // Tạo URL cho từng file và thêm vào danh sách
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...newUrls]);
    // Reset input để có thể upload lại cùng file
    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // ---------- XỬ LÝ RENDER (giả lập) ----------
  const handleRender = () => {
    if (uploadedImages.length === 0) {
      alert("Vui lòng upload ít nhất một ảnh để render!");
      return;
    }

    // Tạo kết quả cho từng ảnh đang chờ
    const newResults = uploadedImages.map((imageUrl, index) => ({
      id: Date.now() + index,
      before: imageUrl,
      after: aiResultImage, // Ảnh mẫu kết quả AI
      title: `Render ${renderResults.length + index + 1}`,
      style: selectedStyle,
      time: new Date().toLocaleString(),
    }));

    // Gộp vào danh sách kết quả cũ
    const updatedResults = [...renderResults, ...newResults];
    setRenderResults(updatedResults);

    // Đặt active là kết quả đầu tiên trong số mới render (hoặc cuối cùng)
    const firstNewIndex = renderResults.length;
    setActiveResultIndex(firstNewIndex);

    // Xóa danh sách ảnh chờ sau khi render (tuỳ chọn, nhưng theo luồng vẫn giữ lại)
    // setUploadedImages([]);
  };

  // ---------- XỬ LÝ CLICK VÀO GALLERY ----------
  const handleSelectResult = (index) => {
    setActiveResultIndex(index);
  };

  // ---------- LẤY KẾT QUẢ ĐANG XEM ----------
  const activeResult =
    activeResultIndex !== null && renderResults.length > 0
      ? renderResults[activeResultIndex]
      : null;

  // ---------- RENDER ----------
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
                    // Hiển thị danh sách ảnh chờ
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
                      {/* Nút thêm ảnh bổ sung */}
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
                    <option>Tân cổ điển (Neo-Classical)</option>
                    <option>Công nghệp (Industrial)</option>
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
                    <option>Địa Trung Hải (Mediterranean)</option>
                    <option>Tân cổ điển (Neo-Classical)</option>
                    <option>Nhà vườn/ Nhiệt đới</option>
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
                  <button className="btn-arch-secondary btn-sm">
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
                    <ReactCompareImage
                      leftImage={activeResult.before}
                      rightImage={activeResult.after}
                      sliderPositionPercentage={50}
                      leftImageLabel="Before"
                      rightImageLabel="After"
                    />
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
    </div>
  );
}

export default Main;