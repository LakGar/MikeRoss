import React, { useState, useEffect } from "react";
import "./DocumentRepository.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import {
  FaSort,
  FaDownload,
  FaTrashAlt,
  FaEye,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import moment from "moment";
import { Document, Page, pdfjs } from "react-pdf"; // Import react-pdf for PDF preview
import authService from "../services/authServices"; // Import the auth service to fetch user data
import documentService from "../services/documentServices"; // Import the service to update starred and delete

// Set the workerSrc for rendering PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentSearch = () => {
  const [documents, setDocuments] = useState([]); // Files list
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [user, setUser] = useState(null); // User state to hold user data
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the file to be previewed
  const [numPages, setNumPages] = useState(null); // PDF page count

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserProfile(); // Fetch user data
        setUser(userData);
        setDocuments(userData.files); // Set the user's files directly
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle sorting
  const handleSort = (criteria) => {
    setSortBy(criteria);
  };

  // Handle search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Toggle starred status and update backend
  const toggleStar = async (fileId, isStarred) => {
    try {
      await documentService.starFileForUser(user._id, fileId, !isStarred);
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc._id === fileId ? { ...doc, starred: !doc.starred } : doc
        )
      );
    } catch (error) {
      console.error("Error updating starred status:", error);
    }
  };

  // Handle document deletion with confirmation
  const handleDelete = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (confirmed) {
      try {
        await documentService.deleteFileFromUser(user._id, fileId);
        setDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc._id !== fileId)
        );
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  // Handle preview button click
  const handlePreview = (file) => {
    setSelectedFile(file); // Set the file to be previewed
    setModalOpen(true); // Open the modal
  };

  // Handle close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const today = moment().startOf("day");
    const date = moment(dateString);

    if (date.isSame(today, "day")) {
      return "Today";
    }
    return date.format("MMM DD");
  };

  // Function to sort documents
  const sortDocuments = (docs) => {
    if (sortBy === "name") {
      return docs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "size") {
      return docs.sort((a, b) => b.size - a.size);
    } else if (sortBy === "starred") {
      return docs.filter((doc) => doc.starred);
    }
    return docs;
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery) ||
      (doc.tags && doc.tags.join(", ").toLowerCase().includes(searchQuery))
  );

  const sortedDocuments = sortDocuments(filteredDocuments);

  return (
    <div className="screen">
      <div className="left">{user && <SideNav user={user} />}</div>
      <div className="right">
        <div className="top">{user && <TopNav user={user} />}</div>
        <div className="repository-container">
          {/* Toolbar */}
          <div className="repository-toolbar">
            <input
              type="text"
              placeholder="Search documents..."
              onChange={handleSearch}
              className="search-input"
              style={{ marginRight: 20 }}
            />
            <div className="sort-options">
              <FaSort />
              <select onChange={(e) => handleSort(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
                <option value="starred">Show Starred</option>
              </select>
            </div>
          </div>

          {/* Document List */}
          {sortedDocuments.length === 0 ? (
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
              {sortedDocuments.map((doc) => (
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
                        {formatDate(doc.createdAt)}
                      </p>
                      <p style={{ fontSize: 15, color: "dodgerblue" }}>
                        {doc.tags.join(", ")}
                      </p>
                    </div>
                    <div
                      className="star-button"
                      onClick={() => toggleStar(doc._id, doc.starred)}
                    >
                      {doc.starred ? <FaStar color="gold" /> : <FaRegStar />}
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      className="action-btn"
                      onClick={() => handlePreview(doc)}
                    >
                      <FaEye /> Preview
                    </button>
                    <button className="action-btn">
                      <FaDownload /> Download
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

      {/* Modal for PDF Preview */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>PDF Preview</h2>
              <button onClick={closeModal} className="close-btn">
                Close
              </button>
            </div>

            <div className="modal-body">
              {selectedFile && (
                <div className="pdf-preview-container">
                  <Document
                    file={`http://localhost:8000/uploads/${selectedFile.name}`} // Assuming files are served from this URL
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={index} pageNumber={index + 1} />
                    ))}
                  </Document>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="analyze-btn">Analyze</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSearch;
