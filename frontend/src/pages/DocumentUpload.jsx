import React, { useState, useMemo, useEffect } from "react";
import "./DocumentUpload.css";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { Document, Page, pdfjs } from "react-pdf";
import documentService from "../services/documentServices"; // For file uploads
import authService from "../services/authServices"; // For fetching user data
import { useNavigate } from "react-router-dom"; // For navigation

// Set the workerSrc for rendering PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentUpload = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [files, setFiles] = useState([]); // File state
  const [numPages, setNumPages] = useState(null); // State for number of pages
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [uploadProgress, setUploadProgress] = useState({}); // State for upload progress
  const [tags, setTags] = useState({}); // State for tags associated with each file
  const [uploading, setUploading] = useState(false); // State to track if uploading is in progress
  const [notification, setNotification] = useState(""); // State for notification
  const navigate = useNavigate(); // For navigation
  const MAX_FILE_SIZE_MB = 5; // Max file size limit in MB

  useEffect(() => {
    // Fetch user profile when component mounts
    const fetchUserProfile = async () => {
      try {
        const userData = await authService.getUserProfile(); // Fetch user data
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    validateFiles(selectedFiles);
  };

  // Handle drag-and-drop files
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    validateFiles(droppedFiles);
  };

  // Validate the files: check if they are PDFs and within the size limit
  const validateFiles = (selectedFiles) => {
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size / 1024 / 1024 > MAX_FILE_SIZE_MB
    );
    const nonPdfFiles = selectedFiles.filter(
      (file) => file.type !== "application/pdf"
    );

    if (oversizedFiles.length > 0) {
      setErrorMessage(`Files must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
    } else if (nonPdfFiles.length > 0) {
      setErrorMessage("Only PDF files are allowed.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      setErrorMessage(""); // Clear error if valid files are selected
    }
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await uploadFile(file, i);
    }
    setUploading(false);
  };

  // Upload file function with progress tracking
  const uploadFile = async (file, index) => {
    console.log("Uploading file");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("size", file.size);
    formData.append("tags", tags[index] || "");

    try {
      const response = await documentService.uploadFile(user._id, formData);

      // Update upload progress to 100% when upload completes
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [index]: 100, // Set progress to 100% once the file is uploaded
      }));

      // Show notification
      setNotification("File uploaded successfully!");

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification("");
        handleCancel(); // Clear files
        navigate("/search"); // Navigate to the search page
      }, 5000);

      return response.data; // Return the updated list of files or a response
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading file", error.message);
    }
  };

  // Handle Cancel all files
  const handleCancel = () => {
    setFiles([]);
    setErrorMessage(""); // Clear error message when cancelling
  };

  // Memoized PDF Preview
  const memoizedPreview = useMemo(() => {
    const mostRecentFile = files[files.length - 1];
    if (!mostRecentFile || mostRecentFile.type !== "application/pdf")
      return null;

    return (
      <div className="upload-right">
        <h3>Preview: {mostRecentFile.name}</h3>
        <Document
          file={URL.createObjectURL(mostRecentFile)}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
    );
  }, [files, numPages]);

  // Handle tag input change for each file
  const handleTagChange = (event, index) => {
    const newTags = { ...tags, [index]: event.target.value };
    setTags(newTags);
  };

  return (
    <div className="screen">
      <div className="left">
        {/* Conditional rendering for SideNav, only render when user is loaded */}
        {user ? <SideNav user={user} /> : <div>Loading...</div>}
      </div>
      <div className="right">
        <div className="top">
          {/* Conditional rendering for TopNav */}
          {user ? <TopNav user={user} /> : <div>Loading...</div>}
        </div>

        {/* Notification */}
        {notification && (
          <div
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              textAlign: "center",
              position: "fixed",
              top: 0,
              width: "100%",
              zIndex: 1000,
            }}
          >
            {notification}
          </div>
        )}

        <div className="upload-container">
          <div className="upload-left">
            <div
              className={`drop-area ${errorMessage ? "error" : ""}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <FaUpload size={50} />
              <p>Drag & Drop files here or click to upload</p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <input
                      className="description-input"
                      type="text"
                      placeholder="Add a tag or description"
                      value={tags[index] || ""}
                      onChange={(e) => handleTagChange(e, index)}
                    />
                    <button onClick={() => removeFile(index)}>
                      <FaTrashAlt />
                    </button>
                    {uploadProgress[index] !== undefined && (
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${uploadProgress[index]}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="button-container">
                <button
                  onClick={handleCancel}
                  className="cancel-btn"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            )}
          </div>

          {/* Memoized Preview Section */}
          {memoizedPreview}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
