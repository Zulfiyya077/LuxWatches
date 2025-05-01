import React, { useRef, useState, useEffect } from "react";
import styles from "./WristTryOn.module.css";
import { Upload, Trash2, ZoomIn, ZoomOut, RotateCcw, Save, Maximize, RefreshCcw, Moon, Sun } from "lucide-react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const WristTryOn = ({ watchImage, watchDiameter }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  
  const canvasRef = useRef(null);
  const uploadInputRef = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const [watchImg, setWatchImg] = useState(null);
  const [watchPosition, setWatchPosition] = useState({ x: 50, y: 50 });
  const [watchSize, setWatchSize] = useState(30);
  const [watchRotation, setWatchRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [handposeModel, setHandposeModel] = useState(null);
  const [segmentationModel, setSegmentationModel] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [detectionAccuracy, setDetectionAccuracy] = useState("normal"); // low, normal, high
  const [message, setMessage] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [skinTone, setSkinTone] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [handSegmentation, setHandSegmentation] = useState(null);

  // Load models
  useEffect(() => {
    async function loadModels() {
      try {
        setIsProcessing(true);
        setMessage(t("loading"));
        
        // Use WebGL backend
        await tf.setBackend("webgl");
        console.log("TensorFlow using WebGL");

        // Load handpose model
        const handModel = await handpose.load({
          detectionConfidence: 0.8,
          maxContinuousChecks: 10,
          iouThreshold: 0.3,
          scoreThreshold: 0.75
        });
        setHandposeModel(handModel);
        
        // Load segmentation model
        const segmentModel = await bodySegmentation.createSegmenter(
          bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
          {
            runtime: 'tfjs',
            modelType: 'general',
            enableSmoothing: true,
          }
        );
        setSegmentationModel(segmentModel);
        
        setModelLoaded(true);
        setMessage(t("modelsReady"));
      } catch (err) {
        console.error("Model loading error:", err);
        setError(t("modelLoadError"));
      } finally {
        setIsProcessing(false);
      }
    }
    
    loadModels();
  }, [t]);

  // Load watch image
  useEffect(() => {
    if (watchImage) {
      const img = new Image();
      img.src = watchImage;
      img.crossOrigin = "Anonymous";
      img.onload = () => setWatchImg(img);
    }
  }, [watchImage]);

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!modelLoaded) {
      setError(t("waitForModels"));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
        setMessage(t("imageLoaded"));
        detectWristWithAI(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // AI wrist detection and skin tone analysis
  const detectWristWithAI = async (img) => {
    setIsProcessing(true);
    setError(null);
    setManualMode(false);

    try {
      if (!handposeModel || !segmentationModel) {
        throw new Error(t("modelsNotLoaded"));
      }

      // Prepare image for processing
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Optimal size for analysis
      let scaleWidth;
      
      switch(detectionAccuracy) {
        case "low":
          scaleWidth = 320;
          break;
        case "high":
          scaleWidth = 640;
          break;
        default:
          scaleWidth = 512;
      }
      
      const scaleHeight = (img.height / img.width) * scaleWidth;
      canvas.width = scaleWidth;
      canvas.height = scaleHeight;
      ctx.drawImage(img, 0, 0, scaleWidth, scaleHeight);
      
      setMessage(t("detectingWrist"));
      
      // Hand/wrist detection
      const predictions = await handposeModel.estimateHands(canvas);
      
      // Hand/wrist segmentation
      const segmentResult = await segmentationModel.segmentPeople(canvas, {
        multiSegmentation: false,
        segmentBodyParts: true,
        flipHorizontal: false,
        segmentationThreshold: 0.5,
      });
      
      setHandSegmentation(segmentResult);
      
      if (predictions.length > 0) {
        const keypoints = predictions[0].landmarks;
        const [wristX, wristY] = keypoints[0]; // Wrist
        const [thumbX, thumbY] = keypoints[4]; // Thumb
        const [indexX, indexY] = keypoints[8]; // Index finger
        
        // Calculate wrist-hand distance
        const wristToThumbDistance = Math.sqrt(Math.pow(thumbX - wristX, 2) + Math.pow(thumbY - wristY, 2));
        
        // Calculate optimal watch size
        let sizeBasedOnDistance = Math.max(20, Math.min(50, wristToThumbDistance * 0.8));
        
        // Adjust size based on watch diameter
        const adjustedWatchSize = (watchDiameter / 40) * sizeBasedOnDistance;
        
        // Determine watch position
        const wristPositionX = (wristX / scaleWidth) * 100;
        const wristPositionY = (wristY / scaleHeight) * 100;
        
        // Calculate confidence score
        const confidence = predictions[0].handInViewConfidence;
        setConfidenceScore(Math.round(confidence * 100));
        
        // Skin tone analysis
        const skinSample = getSkinToneSample(ctx, keypoints);
        setSkinTone(skinSample);
        
        // Set watch placement and parameters
        setWatchPosition({ x: wristPositionX, y: wristPositionY });
        setWatchRotation(calculateWatchRotation(indexX, indexY, wristX, wristY));
        setWatchSize(adjustedWatchSize);
        
        setMessage(`${t("wristDetected")} ${Math.round(confidence * 100)}%`);
      } else {
        setError(t("wristNotFound"));
        setManualMode(true);
      }
    } catch (err) {
      console.error("AI analysis error:", err);
      setError(t("analysisError"));
      setManualMode(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get skin tone sample
  const getSkinToneSample = (ctx, keypoints) => {
    try {
      // Take samples from multiple points around the wrist
      const samples = [];
      
      keypoints.slice(0, 5).forEach(point => {
        const [x, y] = point;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        samples.push({r: pixel[0], g: pixel[1], b: pixel[2]});
      });
      
      // Average value
      const avgColor = samples.reduce((acc, pixel) => {
        return {
          r: acc.r + pixel.r / samples.length,
          g: acc.g + pixel.g / samples.length,
          b: acc.b + pixel.b / samples.length
        };
      }, {r: 0, g: 0, b: 0});
      
      return avgColor;
    } catch (e) {
      console.error("Skin tone analysis error:", e);
      return null;
    }
  };

  // Calculate watch rotation angle
  const calculateWatchRotation = (indexX, indexY, wristX, wristY) => {
    const angleRad = Math.atan2(indexY - wristY, indexX - wristX);
    // Calculate optimal angle for watch and ensure it looks realistic on wrist
    return ((angleRad * 180) / Math.PI) - 90; // Additional -90 degree adjustment for wrist
  };

  // Mouse/touch drag functionality
  const handleMouseDown = (e) => {
    if (!userImage || !manualMode) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Determine mouse position
    const x = (e.clientX - rect.left) / (rect.width / canvas.width);
    const y = (e.clientY - rect.top) / (rect.height / canvas.height);
    
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !userImage || !manualMode) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate new position
    const x = (e.clientX - rect.left) / (rect.width / canvas.width);
    const y = (e.clientY - rect.top) / (rect.height / canvas.height);
    
    // Update watch position
    const newX = (x / canvas.width) * 100;
    const newY = (y / canvas.height) * 100;
    
    setWatchPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Save image function
  const handleSaveImage = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Save the image
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "watch-try-on.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage(t("imageSaved"));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(t("saveError"));
    }
  };

  // Toggle manual mode
  const toggleManualMode = () => {
    setManualMode(prev => !prev);
    if (!manualMode) {
      setMessage(t("manualModeActive"));
    } else {
      setMessage(t("aiModeActive"));
    }
  };

  // Change accuracy parameter
  const changeAccuracy = (level) => {
    setDetectionAccuracy(level);
    if (userImage) {
      setMessage(`${t("accuracySet")} ${t(level)}. ${t("reanalyzing")}`);
      detectWristWithAI(userImage);
    }
  };

  // Render canvas content
  useEffect(() => {
    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas || !userImage) return;

      const ctx = canvas.getContext("2d");
      canvas.width = userImage.width;
      canvas.height = userImage.height;
      
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply zoom and pan
      ctx.save();
      ctx.translate(panPosition.x, panPosition.y);
      ctx.scale(zoomLevel, zoomLevel);
      
      // Draw the main image
      ctx.drawImage(userImage, 0, 0);
      
      // If segmentation result exists, highlight hand area
      if (handSegmentation && !manualMode) {
        try {
          const segmentation = handSegmentation[0];
          if (segmentation && segmentation.data) {
            // Apply overlay to highlight hand - very subtle and transparent
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < segmentation.data.length; i++) {
              if (segmentation.data[i] === 1) { // Hand area detected
                const idx = i * 4;
                // Add very subtle highlight
                data[idx] = Math.min(255, data[idx] + 10);
                data[idx+3] = 255; // Fully visible
              }
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
        } catch (err) {
          console.warn("Error during segmentation visualization:", err);
        }
      }
      
      // Draw the watch (if image exists)
      if (watchImg) {
        const width = (canvas.width * watchSize) / 100;
        const height = (width / watchImg.width) * watchImg.height;
        const x = (canvas.width * watchPosition.x) / 100;
        const y = (canvas.height * watchPosition.y) / 100;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((watchRotation * Math.PI) / 180);
        ctx.drawImage(watchImg, -width / 2, -height / 2, width, height);
        ctx.restore();
      }
      
      ctx.restore();
    };

    renderCanvas();
  }, [userImage, watchImg, watchPosition, watchSize, watchRotation, zoomLevel, panPosition, handSegmentation, manualMode]);

  const containerClass = `${styles.tryOnContainer} ${theme === 'dark' ? styles.darkTheme : ''}`;

  return (
    <div className={containerClass}>
     
      
      <div 
        className={styles.videoContainer}
        style={{ cursor: manualMode ? 'grab' : 'default' }}
      >
        <canvas 
          ref={canvasRef} 
          className={styles.canvasElement}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%"
          }}
        />

        {isProcessing && (
          <div className={styles.processingOverlay}>
            <div className={styles.spinner}></div>
            <p>{message || t("processing")}</p>
          </div>
        )}
        
        {message && !isProcessing && (
          <div className={styles.messageOverlay}>
            <p>{message}</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}
        
        {userImage && (
          <div className={styles.imageControls}>
            <button className={styles.imageControlButton} onClick={handleZoomIn} title={t("zoomIn")}>
              <ZoomIn size={18} />
            </button>
            <button className={styles.imageControlButton} onClick={handleZoomOut} title={t("zoomOut")}>
              <ZoomOut size={18} />
            </button>
            <button className={styles.imageControlButton} onClick={handleResetZoom} title={t("reset")}>
              <Maximize size={18} />
            </button>
            <button className={styles.imageControlButton} onClick={handleSaveImage} title={t("save")}>
              <Save size={18} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <input
          type="file"
          ref={uploadInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <div className={styles.buttonsRow}>
          <button 
            className={styles.uploadButton} 
            onClick={() => uploadInputRef.current.click()}
            disabled={!modelLoaded || isProcessing}
          >
            <Upload size={16} /> {t("uploadImage")}
          </button>

          {userImage && (
            <button
              className={styles.resetButton}
              onClick={() => {
                setUserImage(null);
                setWatchPosition({ x: 50, y: 50 });
                setWatchRotation(0);
                setError(null);
                setMessage(null);
                setManualMode(false);
                setHandSegmentation(null);
                setSkinTone(null);
              }}
              disabled={isProcessing}
            >
              <Trash2 size={16} /> {t("reset")}
            </button>
          )}
          
          {userImage && (
            <button
              className={`${styles.aiButton} ${manualMode ? '' : styles.aiActive}`}
              onClick={toggleManualMode}
              disabled={isProcessing}
            >
              {manualMode ? (
                <>
                  <RefreshCcw size={16} /> {t("returnToAI")}
                </>
              ) : (
                <>
                  <RotateCcw size={16} /> {t("manualMode")}
                </>
              )}
            </button>
          )}
        </div>

        {userImage && (
          <>
            <div className={styles.sliderControl}>
              <label>{t("watchSize")}</label>
              <input
                type="range"
                min="10"
                max="60"
                value={watchSize}
                onChange={(e) => setWatchSize(Number(e.target.value))}
                className={styles.slider}
                disabled={isProcessing}
              />
            </div>
            
            <div className={styles.sliderControl}>
              <label>{t("watchRotation")} ({Math.round(watchRotation)}°)</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={watchRotation}
                onChange={(e) => setWatchRotation(Number(e.target.value))}
                className={styles.slider}
                disabled={isProcessing}
              />
            </div>

            {/* Accuracy options */}
            <div className={styles.accuracySelector}>
              <label>{t("aiAccuracy")}</label>
              <div className={styles.accuracyOptions}>
                <button 
                  className={`${styles.accuracyButton} ${detectionAccuracy === 'low' ? styles.activeAccuracy : ''}`}
                  onClick={() => changeAccuracy('low')}
                  disabled={isProcessing}
                >
                  {t("fast")}
                </button>
                <button 
                  className={`${styles.accuracyButton} ${detectionAccuracy === 'normal' ? styles.activeAccuracy : ''}`}
                  onClick={() => changeAccuracy('normal')}
                  disabled={isProcessing}
                >
                  {t("normal")}
                </button>
                <button 
                  className={`${styles.accuracyButton} ${detectionAccuracy === 'high' ? styles.activeAccuracy : ''}`}
                  onClick={() => changeAccuracy('high')}
                  disabled={isProcessing}
                >
                  {t("high")}
                </button>
              </div>
            </div>

            {/* Confidence and skin tone information */}
            {confidenceScore > 0 && !manualMode && (
              <div className={styles.detectionInfo}>
                <div className={styles.confidenceBar}>
                  <div 
                    className={styles.confidenceFill} 
                    style={{ 
                      width: `${confidenceScore}%`,
                      backgroundColor: confidenceScore > 70 ? '#4CAF50' : confidenceScore > 40 ? '#FFC107' : '#FF5722'
                    }}
                  ></div>
                </div>
                <p>{t("detectionAccuracy")}: {confidenceScore}%</p>
              </div>
            )}
            
            {skinTone && !manualMode && (
              <div className={styles.skinToneInfo}>
                <div 
                  className={styles.skinToneSample} 
                  style={{ 
                    backgroundColor: `rgb(${Math.round(skinTone.r)}, ${Math.round(skinTone.g)}, ${Math.round(skinTone.b)})`
                  }}
                ></div>
                <p>{t("skinToneDetected")}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className={styles.instructionText}>
        {manualMode ? (
          <p>{t("manualInstructions")}</p>
        ) : (
          <p>{t("aiInstructions")}</p>
        )}
      </div>
    </div>
  );
};

export default WristTryOn;