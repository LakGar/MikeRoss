import React, { useState, useEffect } from "react";
import "./DocumentRepository.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { FaSort, FaDownload, FaTrashAlt, FaEye } from "react-icons/fa";
import moment from "moment";
import authService from "../services/authServices";
import documentServices from "../services/documentServices";
import axios from "axios";
import "./DocumentAnalysis.css";

const DocumentAnalyze = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(""); // State to hold analysis result
  const [riskAnalysis, setRiskAnalysis] = useState(""); // State to hold risk analysis
  const [conversation, setConversation] = useState([]); // State to store conversation history
  const [isAnalyzing, setIsAnalyzing] = useState(false); // To show loading state while analyzing
  const [isRAnalyzing, setIsRAnalyzing] = useState(false); // To show loading state while analyzing

  const [typedAnalysis, setTypedAnalysis] = useState(""); // State for showing analysis typing effect
  const [typedRAnalysis, setTypedRAnalysis] = useState(""); // State for showing analysis typing effect

  const [isTyping, setIsTyping] = useState(false); // State to handle typing effect
  const [businessInfo, setBusinessInfo] = useState(""); // State to hold business information
  const [yes, setYes] = useState(false);
  const [risk, setRisk] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserProfile();
        setUser(userData);
        setDocuments(userData.files);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to simulate typing effect
  const simulateTyping = (text, value) => {
    setIsTyping(true);
    value("");
    let index = 0;

    const interval = setInterval(() => {
      value((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10); // Adjust typing speed here (in milliseconds)
  };

  // Handle document analysis
  const handleAnalyze = async () => {
    setYes(true);
    if (selectedFile) {
      setIsAnalyzing(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/analyze/",
          {
            fileId: selectedFile._id,
            userId: user._id,
          }
        );
        setAnalysis(response.data.analysis);
        simulateTyping(response.data.analysis, setTypedAnalysis); // Simulate typing for analysis response
      } catch (error) {
        console.error("Error analyzing file:", error);
        setAnalysis("An error occurred while analyzing the document.");
        setTypedAnalysis("An error occurred while analyzing the document.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Handle risk analysis
  const handleRiskAnalysis = async () => {
    setRisk(true);
    if (selectedFile && businessInfo) {
      // Display user's business info as a chat bubble
      setConversation((prevConvo) => [
        ...prevConvo,
        { sender: "user", message: businessInfo },
      ]);

      setIsRAnalyzing(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/risk-analysis/",
          {
            fileId: selectedFile._id,
            userId: user._id,
            businessInfo, // Send the business information as part of the request
          }
        );
        setRiskAnalysis(response.data.riskAnalysis);
        simulateTyping(response.data.riskAnalysis, setTypedRAnalysis); // Simulate typing for risk analysis response
      } catch (error) {
        console.error("Error performing risk analysis:", error);
        setRiskAnalysis(
          "An error occurred while performing the risk analysis."
        );
      } finally {
        setIsRAnalyzing(false);
      }
    } else {
      alert("Please provide business information before risk analysis.");
    }
  };

  // Handle close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setAnalysis("");
    setRiskAnalysis("");
    setTypedAnalysis("");
    setBusinessInfo("");
    setConversation([]); // Reset conversation
  };

  // Handle document deletion with confirmation
  const handleDelete = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (confirmed) {
      try {
        await documentServices.deleteFileFromUser(user._id, fileId);
        setDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc._id !== fileId)
        );
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <div className="screen">
      <div className="left">{user && <SideNav user={user} />}</div>
      <div className="right" style={{ flexDirection: "column" }}>
        <div className="top">{user && <TopNav user={user} />}</div>

        <div className="repository-container">
          {/* Document List */}
          {documents.length === 0 ? (
            <div className="empty-state">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                alt="No Documents"
                className="empty-state-image"
              />
              <p className="empty-state-text">
                No documents found. Add a document to get started!
              </p>
            </div>
          ) : (
            <div className="document-list">
              {documents.map((doc) => (
                <div key={doc._id} className="document-item">
                  <div className="item-top">
                    <div className="document-thumbnail">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                        alt="PDF icon"
                        className="pdf-icon"
                      />
                    </div>
                    <div className="document-info">
                      <p className="document-name">{doc.name}</p>
                      <p style={{ fontSize: 12 }}>
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p style={{ fontSize: 15 }}>
                        {moment(doc.createdAt).format("MMM DD")}
                      </p>
                      <p style={{ fontSize: 15, color: "dodgerblue" }}>
                        {doc.tags.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedFile(doc);
                        setModalOpen(true); // Open the modal first
                      }}
                    >
                      <FaEye /> Open
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(doc._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Analysis */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Document Analysis</h2>
              <button onClick={closeModal} className="close-btn">
                Close
              </button>
            </div>
            <div className="modal-body">
              <div className="chatline">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                  alt="Mike"
                  className="userImg"
                />
                <p className="bubble">
                  Would you like to analyze this document?
                </p>
              </div>
              {yes && (
                <div className="chatline rights">
                  <img
                    src={user.profilePicture}
                    alt="client"
                    className="userImg"
                  />
                  <p className="bubble">Yes</p>
                </div>
              )}
              {isAnalyzing ? (
                <div className="chatline">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                    alt="Mike"
                    className="userImg"
                  />
                  <p className="analyzing">Analyzing document...</p>
                </div>
              ) : yes ? (
                <>
                  <div className="chatline">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                      alt="Mike"
                      className="userImg"
                    />
                    <p className="bubble">K{typedAnalysis}</p>
                  </div>
                </>
              ) : (
                <></>
              )}
              {analysis && !isTyping && (
                <div className="chatline">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                    alt="Mike"
                    className="userImg"
                  />
                  <p className="bubble">
                    Tell me more about your business to get a risk analysis
                  </p>
                </div>
              )}
              {analysis && businessInfo ? (
                <>
                  <div className="chatline rights">
                    <img
                      src={user.profilePicture}
                      alt="Mike"
                      className="userImg"
                    />
                    <p className="bubble">{businessInfo}</p>
                  </div>
                  {isRAnalyzing ? (
                    <div className="chatline">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                        alt="Mike"
                        className="userImg"
                      />
                      <p className="analyzing">Analyzing risks...</p>
                    </div>
                  ) : (
                    <div className="chatline">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYpf160RSE6phEfWzkI5zLza_VY-WptX8-Q&s"
                        alt="Mike"
                        className="userImg"
                      />
                      <p className="bubble">{typedRAnalysis}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Display user input as a chat bubble */}
                  {businessInfo && (
                    <div className="chatline rights">
                      <img
                        src={user.profilePicture}
                        alt="client"
                        className="userImg"
                      />
                      <p className="bubble">{businessInfo}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="chatbox-container">
              {!analysis && (
                <>
                  <input className="chatbox" />
                  <button
                    className="enter-button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    Analyze
                  </button>
                </>
              )}
              {analysis && (
                <>
                  <input
                    type="text"
                    placeholder="Enter text"
                    value={businessInfo}
                    onChange={(e) => setBusinessInfo(e.target.value)}
                    className="chatbox"
                  />
                  <button
                    className="enter-button"
                    onClick={handleRiskAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Risk Analysis"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalyze;
