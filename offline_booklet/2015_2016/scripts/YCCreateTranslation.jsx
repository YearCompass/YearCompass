/* YCTranslationChange.jsx
 * ---------------------------------------------------------------------------- 
 * Based on the Sample script  coming in InDesign CS5.5 FindChangeByList.jsx
 * @@@BUILDINFO@@@ "FindChangeByList.jsx" 3.0.0 15 December 2009
 * ---------------------------------------------------------------------------- 
 * Loads a series of tab-delimited strings from a text file, then performs a series
 * of find/change operations based on the strings read from the file.
 * The data file is tab-delimited, with carriage returns separating records.
 * ---------------------------------------------------------------------------- 
 * The format of each record in the file is:
 *   findType<tab>findProperties<tab>changeProperties<tab>findChangeOptions<tab>description
 * Where:
 *  <tab> is a tab character
 *  findType is "text", "grep", or "glyph" (this sets the type of find/change operation to use).
 *  findProperties is a properties record (as text) of the find preferences.
 *  changeProperties is a properties record (as text) of the change preferences.
 *  findChangeOptions is a properties record (as text) of the find/change options.
 *  description is a description of the find/change operation
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
 * The entry point for the string replace function
 * @return {} Executes the translation script
 * ----------------------------------------------------------------------------
 */
function main(){
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    
    // Execute script only if there is an open document
    if(app.documents.length > 0){
        // Get the translation file and the language code
        fileInfo = getTranslationFile();
        // Create the new copy from the file
        makeCopy(fileInfo.langCode);
        // Get current document
        currentDocument = app.activeDocument;
        // Find and replace tokens
        findAndReplaceTokens(currentDocument, fileInfo.filePath);
        // Save current document
        currentDocument.save();
    }
    else{
        alert("No documents are open. Please open a document and try again.");
    }
}

/**
 * Function: makeCopy
 * ----------------------------------------------------------------------------
 * Makes a copy from the base file and saves it
 * @param {string} (langCode) The language code
 * @return {} Makes a copy from the currently active file
 * ----------------------------------------------------------------------------
 */
function makeCopy(langCode) {
    // Get current timestamp
    var now         = new Date();
    var timeStamp   = now.getFullYear() + "-" +
                      padNumber(now.getMonth() + 1, 2) + "-" +
                      padNumber(now.getDate(), 2) + "-" +
                      padNumber(now.getHours(), 2) + "-" +
                      padNumber(now.getMinutes(), 2);
    // Get current path and set the new file and folder paths
    var thisFile    = new File($.fileName);
    var basePath    = thisFile.path;
    var folderPath  = basePath + "/../draft/" + langCode;
    var filePath    = folderPath + "/YearCompass_booklet_" + langCode + "_" + timeStamp + ".indd";

    // Create new folder if not exists
    var folder = Folder(folderPath);
    if(!folder.exists) {
        folder.create();
    }

    // Save the new document
    app.activeDocument.save(new File(filePath));
}

/**
 * Function: padNumber
 * ----------------------------------------------------------------------------
 * Pads a number with trailing characters (e.g. zeros)
 * @param {integer} (n) The number
 * @param {integer} (width) The trailing width
 * @param {string} (z) The trailing character (if not provided defaults to 0)
 * ----------------------------------------------------------------------------
 */
function padNumber(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


/**
 * Function: getTranslationFile
 * ----------------------------------------------------------------------------
 * Opens a dialog and prompts for the translation file
 * @return {array} (fileInfo) Array containing the file path and the langCode
 * ----------------------------------------------------------------------------
 */
function getTranslationFile(){
    // Open dialog and get translation file path
    filePath = File.openDialog("Choose the file containing your find/change list");
    // Return the path and the filename (== language code)
    return {
        'filePath': filePath,
        'langCode': filePath.fileName(),
    };
}

/**
 * Function: findAndReplaceTokens
 * ----------------------------------------------------------------------------
 * Iterates through the provided translation file and replaces the strings
 * according to the file lines
 * @param {app.documents Object} (currentDocument) the current document
 * @param {string} (transFilePath) the translation file path
 * @return {} Replaces the strings
 * ----------------------------------------------------------------------------
 */
function findAndReplaceTokens(currentDocument, transFilePath){  
    // Check if the translation file path exists
    if(transFilePath != null){
        // Open the translation file
        var transFile = File(transFilePath);
        if (transFile.open("r", undefined, undefined)){
            // Loop through the find/replace operations.
            do {
                line = transFile.readln();
                // Ignore comment lines and blank lines.
                if (line.substring(0,4) == "text") {
                    findReplaceArray = line.split("\t");
                    // The first field in the line is the findType string.
                    findType = findReplaceArray[0];
                    // The second field in the line is the findPreferences string.
                    findPreferences = findReplaceArray[1];
                    // The second field in the line is the replacePreferences string.
                    replacePreferences = findReplaceArray[2];
                    // The fourth field is the range--used only by text find/replace.
                    options = findReplaceArray[3];
                    // Call corresponding function
                    replaceText(currentDocument, findPreferences, replacePreferences, options);
                }
            } while(transFile.eof == false);
            // Close translation file
            transFile.close();
        } else {
            alert("Could not open the provided translation file. Please try again.");
        }
    } else {
        alert("The provided translation file path is empty. Please select a file first.");
    }
}

/**
 * Function: replaceText
 * ----------------------------------------------------------------------------
 * Replaces a text according to the parameters
 * according to the file lines
 * @param {app.documents Object} (currentDocument) the current document
 * @param {string} (findPreferences) the find string
 * @param {string} (replacePreferences) the replace string
 * @param {json sting} (options) the options in string array
 * @return {} Replaces the strings
 * ----------------------------------------------------------------------------
 */
function replaceText(currentDocument, findPreferences, replacePreferences, options){
    //Reset the find/replace preferences before each search.
    app.changeTextPreferences = NothingEnum.nothing;
    app.findTextPreferences = NothingEnum.nothing;
    var string = "app.findTextPreferences.properties = "+ findPreferences + ";";
    string += "app.changeTextPreferences.properties = " + replacePreferences + ";";
    string += "app.findChangeTextOptions.properties = " + options + ";";
    app.doScript(string, ScriptLanguage.javascript);
    items = currentDocument.changeText();
    //Reset the find/replace preferences after each search.
    app.changeTextPreferences = NothingEnum.nothing;
    app.findTextPreferences = NothingEnum.nothing;
}
