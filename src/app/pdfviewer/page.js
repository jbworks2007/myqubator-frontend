"use client";
import React, { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import FwdIcon from "../../assets/icons/forward-icon.svg";
import BwdIcon from "../../assets/icons/backward-icon.svg";
import Image from "next/image";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Pdfviewer(prop) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);

  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "standard_fonts/",
  };

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }

  return (
    <div className="d-center">
      <div
        className={`mx-2 d-sm-none ${pageNumber > 1 ? "d-lg-block" : "ms-2"}`}
      >
        <button
          className="btn btn-link btn-round"
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          <Image src={BwdIcon} alt="fwdicon" width={50} className="btn-round" />
        </button>
      </div>
      <div className="text-center position-relative" hidden={loading}>
        {/* <h3>
        Page {pageNumber} of {numPages}
      </h3> */}
        <Document
          className={`d-flex justify-items-center justify-content-center`}
          renderMode="canvas"
          file={prop.file}
          // options={options}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) =>
            alert("Error while loading document! " + error.message)
          }
        >
          <Page
            className=""
            key={pageNumber}
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={onPageLoadSuccess}
            onRenderError={() => setLoading(false)}
            height={200}
            width={Math.max(pageWidth * 0.6, 390)}
          />
          {/* <div className="">
          <div className="page-mover">
            <div className="d-center">
              <div className="left-chevron">left</div>
              <div className="page-counter">
                <span>
                  {pageNumber}/{numPages}
                </span>
              </div>
              <div className="right-chevron">right</div>
            </div>
          </div>
        </div> */}
        </Document>
        {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
        <div
          className={`mt-2 d-flex justify-items-center justify-content-center gap-4 mb-5`}
        >
          <button
            style={{ display: pageNumber > 1 ? "block" : "none" }}
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="bth btn-pill"
          >
            Previous Page
          </button>
          <button
            style={{ display: pageNumber != numPages ? "block" : "none" }}
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="btn btn-pill"
          >
            Next Page
          </button>
        </div>
      </div>
      <div
        className={`mx-2 d-sm-none ${
          pageNumber != numPages ? "d-lg-block" : "me-2"
        }`}
      >
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="btn btn-link btn-round"
        >
          <Image src={FwdIcon} alt="fwdicon" width={50} className="btn-round" />
        </button>
      </div>
    </div>
  );
}
