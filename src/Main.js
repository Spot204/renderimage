import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css";
import ReactCompareImage from "react-compare-image";
import image1 from "./Screenshot 2026-07-05 215846.png";

function Main() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("Hiện đại (Modern)");
  const [selectedBuildingType, setSelectedBuildingType] =
    useState("Căn hộ (Apartment)");
  const [selectedOutdoorStyle, setSelectedOutdoorStyle] =
    useState("Hiện đại (Modern)");
  const [imageCount, setImageCount] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fileInputRef = useRef();

  //hàm viết gọi api render ảnh
  const handleRenderClick = (aiImageUrl) => {
    handleCheckUploadedImage();
    //setAfterImage(aiImageUrl);
    setAfterImage(image1);
    alert("Render ảnh thành công! Vui lòng kiểm tra kết quả.");
  };

  const handleCheckUploadedImage = () => {
    if (!uploadedImage) {
      alert("Vui lòng upload ảnh trước khi kiểm tra!");
    }
  };

  const handleImageUpload = (event) => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setBeforeImage(imageUrl);
    }
  };
  const handleRemoveImage = () => {
    setUploadedImage(null);
  };
  return (
    <div className="architecture-app-container py-5">
      <div className="container-fluid px-4">
        <div className="row g-4 align-items-start">
          {/* CỘT TRÁI: ĐIỀU KHIỂN & CẤU HÌNH */}
          <div className="col-lg-4 col-xl-3">
            {/* Bước 1: Upload */}
            <div className="arch-card mb-4">
              <div className="arch-card-header">
                <span className="step-number">01</span>
                <h5 className="arch-card-title">Mặt Bằng Bản Vẽ 2D</h5>
              </div>
              <div className="arch-card-body">
                <div className="arch-upload-zone">
                  {uploadedImage ? (
                    <div className="image-wrapper">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="img-fluid"
                      />
                      <button
                        className="remove-btn"
                        onClick={handleRemoveImage}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <div onClick={() => handleImageUpload()}>
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
                          Hỗ trợ định dạng định dạng: PNG, JPG
                        </span>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
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
                {/* Thông báo AI tinh gọn */}
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
                  </select>
                </div>
                <button
                  className="btn-arch-primary w-100"
                  onClick={() => handleRenderClick()}
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

          {/* CỘT PHẢI: KHÔNG GIAN HIỂN THỊ KẾT QUẢ RENDER */}
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

              <div className="arch-card-body ">
                {/* Vùng xem ảnh lớn */}
                <div className="arch-preview-viewport mb-4">
                  {afterImage ? (
                    <ReactCompareImage
                      leftImage={beforeImage}
                      rightImage={afterImage}
                      sliderPositionPercentage={50}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
