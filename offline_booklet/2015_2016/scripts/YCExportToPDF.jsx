/* YCExportToPDF.jsx
 * ---------------------------------------------------------------------------- 
 * Exports the active document to PDF and PDF Booklet
 * ---------------------------------------------------------------------------- 
 */

 /* Extend File prototype to return a file name from the path */
 File.prototype.fileName = function(){
   return this.name.replace(/.[^.]+$/,'');
 }

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
        
        // -------------- A4 -------------- //
        // Export to PDF
        exportA4Pdf(currentDocument);
        // Make currentDocument the active again
        app.activeDocument = currentDocument;

        // ---------- A5 BOOKLET ---------- //
        // Export to PDF
        //exportBookletPdf(currentDocument);
        // Make currentDocument the active again
        //app.activeDocument = currentDocument;
        
        // Save current document
        currentDocument.save();
    }
    else {
        alert("No documents are open. Please open a document and try again.");
    }
}

/**
 * Function: exportA4Pdf
 * ----------------------------------------------------------------------------
 * Makes a copy from the base file and saves it
 * @param {app.documents Object} (currentDocument) the current document
 * @return {} Makes a copy from the currently active file
 * ----------------------------------------------------------------------------
 */
function exportA4Pdf(currentDocument) {
    // Set output file name
    var PDFFileName = File(currentDocument.fullName).path + '/' + File(currentDocument.fullName).fileName() + "_A4.pdf";
    // Set PDF Preset
    var preset = app.pdfExportPresets.item("YCA4PDFPreset");
    // Export PDF
    currentDocument.exportFile(ExportFormat.pdfType, File(PDFFileName), false, preset);
}


/**
 * Function: exportBookletPdf
 * ----------------------------------------------------------------------------
 * Makes a copy from the base file and saves it
 * @param {app.documents Object} (currentDocument) the current document
 * @return {} Makes a copy from the currently active file
 * ----------------------------------------------------------------------------
 */
function exportBookletPdf(currentDocument) {
    // Set the filename for the copy of the current document
    var CopyFileName = File(currentDocument.fullName).path + '/' + File(currentDocument.fullName).fileName() + "_A5_booklet.indd";
    // Set output file name
    var PDFFileName = File(currentDocument.fullName).path + '/' + File(currentDocument.fullName).fileName() + "_A5_booklet.pdf";

    // Make a copy from the current document
    copyDocument = app.activeDocument.save(new File(CopyFileName));

    // Reorder Pages according to the booklet layout
    status = reorderPages(copyDocument);

    if (status) {
        // Set PDF Preset
        var preset = app.pdfExportPresets.item("YCA4PDFPreset");
        // Export PDF
        copyDocument.exportFile(ExportFormat.pdfType, File(PDFFileName), false, preset);    
    }

}


/**
 * Function: reorderPages
 * ----------------------------------------------------------------------------
 * Reorders the pages to match the booklet layout
 * @param {app.documents Object} (currentDocument) the current document
 * @return {} Reorders the pages
 * ----------------------------------------------------------------------------
 */
function reorderPages(currentDocument) {
    // Get document pages     
    var pages = currentDocument.pages;
    
    // Check if the number of pages is divisible by 4
    if (pages.length % 4 != 0) {
        alert("Cannot make booklet pdf from a(n) " + pages.length + " pages long document (the page number have to be divisible by 4).");
        return false;
    }

    // Get page order
    var pageOrder = getPageOrder(pages.length);
    
    // Get page IDs to save the references
    var pageIDs = [];
    for (var i=0 ; i < pageOrder.length ; i++ ) {
        pageIDs.push(pages.item(''+pageOrder[i]).id);
    };

    // Reorder pages
    app.scriptPreferences.enableRedraw = false;
    for (var i=0 ; i < pageIDs.length ; i++ ) {
        pages.itemByID(pageIDs[i]).move(LocationOptions.AT_END);
    }
    app.scriptPreferences.enableRedraw = true;
    
    // Return
    return true;
}
 
/**
 * Function: getPageOrder
 * ----------------------------------------------------------------------------
 * Returns the page order in an array based on the number of pages
 * @param {integer} (numOfPages) the number of pages
 * @return {array or False} (pageOrder) The page orders
 * ----------------------------------------------------------------------------
 */
function getPageOrder(numOfPages) {
    // Initialize variables
    pageOrder = [];
    numberList = [];
    for (var i = 1; i <= numOfPages; i++) {
        numberList.push(i);
    }

    // Push numbers to pageOrder array
    // The result supposed to be like this (assuming a 24 pages long document)
    // [24,1,2,23,22,3,4,21,20,5,6,19,18,7,8,17,16,9,10,15,14,11,12,13]
    var autoPairs = numOfPages / 2 - 1;

    // Add first element (numOfPages)
    pageOrder.push(numberList.splice(numberList.length-1, 1));

    for (var i = 0; i < autoPairs; i++) {
        // Get two from the top of the array
        if (i % 2 == 0) {
            pageOrder.push(numberList.splice(0, 1));
            pageOrder.push(numberList.splice(0, 1));
        // Get two from the bottom of the array
        } else {
            pageOrder.push(numberList.splice(numberList.length-1, 1));
            pageOrder.push(numberList.splice(numberList.length-1, 1));
        };
    };

    // Add last element (numOfPages/2 + 1)
    pageOrder.push(numberList.splice(0, 1));

    // Return
    return pageOrder;
}