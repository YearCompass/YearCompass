/* YCExportToPDF.jsx
 * ---------------------------------------------------------------------------- 
 * Exports the active document to PDF and PDF Booklet
 * ---------------------------------------------------------------------------- 
 */

/* Execute main function */
main();

/**
 * Function: main
 * ----------------------------------------------------------------------------
 * The entry point for the pdf function
 * @return {} Exports the active document to pdf
 * ----------------------------------------------------------------------------
 */
function main(){
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    
    // Execute script only if there is an open document
    if(app.documents.length > 0){
        // Get current document
        currentDocument = app.activeDocument;
        // Export to PDF
        exportPdf(currentDocument);
        // Export to PDF in Booklet layout
        //exportPdfBooklet(currentDocument);
        // Save current document
        currentDocument.save();
    }
    else{
        alert("No documents are open. Please open a document and try again.");
    }
}

/**
 * Function: exportPdf
 * ----------------------------------------------------------------------------
 * Makes a copy from the base file and saves it
 * @param {app.documents Object} (currentDocument) the current document
 * @return {} Makes a copy from the currently active file
 * ----------------------------------------------------------------------------
 */
function exportPdf(currentDocument) {
    // Set output file name
    var filename = String(currentDocument.fullName).replace("indd", "pdf");

    // Set PDF Preset
    var preset = app.pdfExportPresets.item("YCBasePDFPreset");
    currentDocument.exportFile(ExportFormat.pdfType, File(filename), false, preset);
}
