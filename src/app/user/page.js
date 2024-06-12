"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import axios from "axios";
import logo from "../../../public/dark-logo.png";
import file from "../../../public/documents/myq GP/financials.pdf";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaEye, FaShare } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
// import { pdfjs, Document, Page } from "react-pdf";
// import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import Pdfviewer from "../pdfviewer/page";
import EyeIcon from "../../assets/icons/eye-icon.svg";
import FwdIcon from "../../assets/icons/forward-icon.svg";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function page() {
  const { data: session, status } = useSession();
  // console.log("session data :", session?.user);

  const [projects, setProjects] = useState();
  const [currentProject, setCurrentProject] = useState();
  const [currentProjectId, setCurrentProjectId] = useState("myq001");
  const [currentDocId, setCurrentDocId] = useState("document id not found");
  const [currentDoc, setCurrentDoc] = useState("No Document Found");
  const [currentDocPath, setCurrentDocPath] = useState(
    "Document path not Found"
  );
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("dummy@email.com");
  const [sending, setSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState(false);
  const [download, setDownload] = useState(false);
  const [showFullDescription, setFullDescription] = useState(false);
  // const [show, setShow] = useState(false);

  const handleResize = () => {
    // console.log("handle resize call", show);
    // console.log("window innerwidth", window.innerWidth);
    if (window.innerWidth < 850) {
      setFullDescription(false);
    } else {
      setFullDescription(true);
    }
  };

  const SERVER_API_URL = process.env.NEXT_PUBLIC_APP_SERVER_API;

  const handleSignUp = async (name, email) => {
    // e.preventDefault();
    // console.log("SignUp called");
    //Registering the user
    await axios
      .post(SERVER_API_URL + "/api/auth/signup", {
        name: name,
        email: email,
        pass: "",
        role: "user",
      })
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getProjectsData = async () => {
    // console.log("Get Pr0jects called");
    await axios
      .get(SERVER_API_URL + "/api/project/getprojects")
      .then(function (response) {
        // console.log(response);
        setProjects(response?.data.projects);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    // This will register the first time user with google oauth
    if (session?.user?.provider === "google") {
      handleSignUp(session.user.name, session.user.email);
    }
  }, [session]);

  useEffect(() => {
    getProjectsData();
    // handleResize();
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   console.log("Projects : ", projects);
  // }, [projects]);

  const handleDocumentClick = (
    proj_id,
    proj_name,
    document_id,
    document_name,
    downloadStatus
  ) => {
    // console.log("download status ====> ", downloadStatus);
    // console.log("project name ====> ", proj_name);
    // console.log("document id ====> ", document_id);
    // console.log("document name ====> ", document_name);
    setCurrentProjectId(proj_id);
    setCurrentProject(proj_name);
    setCurrentDocId(document_id);
    setCurrentDoc(document_name);
    setDownload(downloadStatus);
    setCurrentDocPath(`/documents/${proj_name}/${document_name}.pdf`);
    setShowModal(!showModal);
    updateViews(proj_id, proj_name, document_id, document_name, downloadStatus);
  };

  const updateViews = (pid, pname, did, dname, status) => {
    axios
      .post(SERVER_API_URL + "/api/project/update-project-views", {
        project_id: pid,
        name: pname,
      })
      .then(function (response) {
        console.log("project views updated : ", response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("value od status --->", status);
    if (!status) {
      axios
        .post(SERVER_API_URL + "/api/project/update-document-views", {
          project_id: pid,
          doc_id: did,
          doc_name: dname,
        })
        .then(function (response) {
          console.log("documents views updated : ", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post(SERVER_API_URL + "/api/project/update-legal-document-views", {
          project_id: pid,
          doc_id: did,
          doc_name: dname,
        })
        .then(function (response) {
          console.log("legal documents views updated : ", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const sendEmailtoShare = () => {
    axios
      .post(SERVER_API_URL + "/api/email/send-share-document-email", {
        customer_name: session?.user?.name,
        customer_email: session?.user?.email,
        sharer_email: shareEmail,
        project_name: currentProject,
        document_name: currentDoc,
      })
      .then(function (response) {
        console.log("Email send to sharer : ", response);
      })
      .catch(function (error) {
        console.log(error);
      });
    // hit send email trigger to admin
    axios
      .post(SERVER_API_URL + "/api/email/send-share-info-email", {
        customer_name: session?.user?.name,
        customer_email: session?.user?.email,
        sharer_email: shareEmail,
        project_name: currentProject,
        document_name: currentDoc,
      })
      .then(function (response) {
        console.log("Email send to Admin : ", response);
      })
      .catch(function (error) {
        console.log(error);
      });
    // hit share update Api
    updateSharesCount();
    setSendingStatus(true);
  };

  const updateSharesCount = () => {
    axios
      .post(SERVER_API_URL + "/api/project/update-project-shares", {
        project_id: currentProjectId,
        name: currentProject,
      })
      .then(function (response) {
        console.log("project share count updated : ", response);
      })
      .catch(function (error) {
        console.log(error);
      });
    if (!download) {
      axios
        .post(SERVER_API_URL + "/api/project/update-document-shares", {
          project_id: currentProjectId,
          doc_id: currentDocId,
          doc_name: currentDoc,
        })
        .then(function (response) {
          console.log("documents share count updated : ", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post(SERVER_API_URL + "/api/project/update-legal-document-shares", {
          project_id: currentProjectId,
          doc_id: currentDocId,
          doc_name: currentDoc,
        })
        .then(function (response) {
          console.log("legal documents share count updated : ", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  if (status === "authenticated")
    return (
      <>
        <Modal show={sending} centered backdrop="static" size="sm">
          <Modal.Body>
            <div className="text-center">
              <p>please wait...</p>
              <span className="loader"></span>
            </div>
          </Modal.Body>
        </Modal>
        <div className="container px-3 overflow-auto pb-5">
          <div className="fs-20">Active Project</div>
          <div className="mt-2 row g-3">
            {projects &&
              projects.map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div
                    className={`project-card ${
                      item.name === currentProject ? "p-active" : ""
                    }`}
                    onClick={() => setCurrentProject(item.name)}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="project-name">{item.name}</div>
                      <div className="project-data">
                        <div className="d-flex justify-content-center gap-5">
                          <div className="proj-views">
                            <div className="view-icon">
                              <Image src={EyeIcon} alt="eyeicon" width={24} />
                            </div>
                            <div className="view-data">{item.views}</div>
                          </div>
                          <div
                            className="proj-shares"
                            role="button"
                            onClick={() => setShowShareModal(true)}
                          >
                            <div className="share-icon">
                              <Image
                                src={FwdIcon}
                                alt="forward-icon"
                                width={20}
                              />
                            </div>
                            <div className="share-data">{item.shares}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* Project Description */}
          {currentProject ? (
            <div className="mt-5">
              <div className="mb-3 fs-20">
                Project Description - {currentProject}
              </div>
              {projects &&
                projects.map((item, index) =>
                  item.name === currentProject ? (
                    <div
                      className="fs-16"
                      key={index}
                      style={{ textAlign: "justify" }}
                    >
                      <p className="desc-format">
                        {showFullDescription
                          ? item.desc
                          : item.desc.slice(0, 370)}
                        <span
                          className="ms-2 text-green"
                          role="button"
                          onClick={() => {
                            setFullDescription(!showFullDescription);
                          }}
                        >
                          Read {showFullDescription ? "Less" : "More"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    ""
                  )
                )}
            </div>
          ) : (
            ""
          )}

          {/* Document Central */}
          {currentProject ? (
            <div className="mt-5 row g-3">
              <div className="mb-2 fs-20">
                Document Central - {currentProject}
              </div>
              {projects &&
                projects.map((item, index) =>
                  item.name === currentProject ? (
                    <>
                      {item.documents.map((doc, i) => (
                        <div className="col-md-6" key={i}>
                          <div
                            className="project-card"
                            onClick={() =>
                              handleDocumentClick(
                                item.project_id,
                                item.name,
                                doc.doc_id,
                                doc.doc_name,
                                false
                              )
                            }
                          >
                            <div className="d-flex justify-content-between">
                              <div className="project-name">{doc.doc_name}</div>
                              <div className="project-data">
                                <div className="d-flex justify-content-center gap-5">
                                  <div className="proj-views">
                                    <div className="view-icon">
                                      <Image
                                        src={EyeIcon}
                                        alt="eyeicon"
                                        width={24}
                                      />
                                    </div>
                                    <div className="view-data">{doc.views}</div>
                                  </div>
                                  <div
                                    className="proj-shares"
                                    role="button"
                                    onClick={() => setShowShareModal(true)}
                                  >
                                    <div className="share-icon">
                                      <Image
                                        src={FwdIcon}
                                        alt="forward-icon"
                                        width={20}
                                      />
                                    </div>
                                    <div className="share-data">
                                      {doc.shares}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )
                )}
            </div>
          ) : (
            ""
          )}

          {/* Legal Document */}
          {currentProject ? (
            <div className="mt-5 row g-3">
              <div className="mb-2 fs-20">
                Legal Document - {currentProject}
              </div>
              {projects &&
                projects.map((item, index) =>
                  item.name === currentProject ? (
                    <>
                      {item.legal_documents.map((doc, i) => (
                        <div className="col-md-6" key={i}>
                          <div
                            className="project-card"
                            onClick={() =>
                              handleDocumentClick(
                                item.project_id,
                                item.name,
                                doc.doc_id,
                                doc.doc_name,
                                true
                              )
                            }
                          >
                            <div className="d-flex justify-content-between">
                              <div className="project-name">{doc.doc_name}</div>
                              <div className="project-data">
                                <div className="d-flex justify-content-center gap-5">
                                  <div className="proj-views">
                                    <div className="view-icon">
                                      <Image
                                        src={EyeIcon}
                                        alt="eyeicon"
                                        width={24}
                                      />
                                    </div>
                                    <div className="view-data">{doc.views}</div>
                                  </div>
                                  <div
                                    className="proj-shares"
                                    role="button"
                                    onClick={() => setShowShareModal(true)}
                                  >
                                    <div className="share-icon">
                                      <Image
                                        src={FwdIcon}
                                        alt="forward-icon"
                                        width={20}
                                      />
                                    </div>
                                    <div className="share-data">
                                      {doc.shares}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )
                )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="">
          <Modal show={showModal} fullscreen onHide={() => setShowModal(false)}>
            <Modal.Header className="px-2">
              <Modal.Title style={{ width: "100%" }}>
                <div className="row align-items-center g-2">
                  <div className="col-md-6 col-lg-4">
                    <div className="mob-adj">
                      <Link href="https://myqubator.com">
                        <Image src={logo} alt="dark-logo" width={200} />
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="text-center">{currentDoc}</div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex justify-content-center gap-2">
                      <div className="mob-adj text-end">
                        <button
                          className="btn btn-pill"
                          onClick={() => setShowShareModal(true)}
                        >
                          Share
                        </button>
                      </div>
                      <div
                        className="mob-adj text-end"
                        style={{ display: download ? "block" : "none" }}
                      >
                        <a
                          href={currentDocPath}
                          download
                          className="btn btn-pill"
                          style={{ lineHeight: "35px" }}
                        >
                          Download
                        </a>
                      </div>
                      <div className="mob-adj text-end">
                        <button
                          className="btn btn-icon"
                          onClick={() => setShowModal(false)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Pdfviewer file={currentDocPath} />
            </Modal.Body>
          </Modal>
          {/* SHARE MODAL */}
          {/* SHARE MODAL */}
          {/* SHARE MODAL */}
          <Modal
            show={showShareModal}
            centered
            onHide={() => {
              setShowShareModal(false);
              setSendingStatus(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="">
                <h3>Document Share</h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {sendingStatus ? (
                <div className="text-center">
                  <h3>Thanking You for Sharing!</h3>
                  <p>We have sent an email to:</p>
                  <p>{shareEmail}</p>
                  <div className="my-3">
                    <button
                      className="btn btn-pill"
                      onClick={() => {
                        setShowShareModal(false);
                        setSendingStatus(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center">
                  <p>Please enter the email to share the document</p>
                  <input
                    className="input-one"
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <div className="my-3">
                    <button className="btn btn-pill" onClick={sendEmailtoShare}>
                      Share
                    </button>
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </>
    );

  if (status === "unauthenticated")
    return (
      <>
        <h1>You are not authorize to view this page</h1>
        <button className="mt-5" onClick={() => signIn()}>
          Back to Login
        </button>
      </>
    );
}
