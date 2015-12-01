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

/* Execute main finction */
main();

/**
 * Function: main
 * ----------------------------------------------------------------------------
 * The entry point for the string replace function
 * ----------------------------------------------------------------------------
 */
function main(){
    var myObject;
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    
    // Create the new copy from the file
    makeCopy();

    // Execute script only if there is an open document
    if(app.documents.length > 0){
        myFindChangeByList(app.documents.item(0));
    }
    else{
        alert("No documents are open. Please open a document and try again.");
    }
}

/**
 * Function: makeCopy
 * ----------------------------------------------------------------------------
 * Makes a copy from the base file and saves it
 * ----------------------------------------------------------------------------
 */
function makeCopy() {
    //FIXME GET DOCUMENT PATH FROM THE ROOT AND LANG CODE
    var filename = 'YearCompass_booklet_en_US.indd';
    //If you do not provide a file name, InDesign will display the Save dialog box.
    app.activeDocument.save(new File(filename));
}


function myDisplayDialog(){
    var myObject;
    var myDialog = app.dialogs.add({name:"FindChangeByList"});
    with(myDialog.dialogColumns.add()){
        with(dialogRows.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Search Range:"});
            }
            var myRangeButtons = radiobuttonGroups.add();
            with(myRangeButtons){
                radiobuttonControls.add({staticLabel:"Document", checkedState:true});
                radiobuttonControls.add({staticLabel:"Selected Story"});
                if(app.selection[0].contents != ""){
                    radiobuttonControls.add({staticLabel:"Selection", checkedState:true});
                }
            }           
        }
    }
    var myResult = myDialog.show();
    if(myResult == true){
        switch(myRangeButtons.selectedButton){
            case 0:
                myObject = app.documents.item(0);
                break;
            case 1:
                myObject = app.selection[0].parentStory;
                break;
            case 2:
                myObject = app.selection[0];
                break;
        }
        myDialog.destroy();
        myFindChangeByList(myObject);
    }
    else{
        myDialog.destroy();
    }
}
function myFindChangeByList(myObject){
    var myScriptFileName, myFindChangeFile, myFindChangeFileName, myScriptFile, myResult;
    var myFindChangeArray, myFindPreferences, myChangePreferences, myFindLimit, myStory;
    var myStartCharacter, myEndCharacter;
    var myFindChangeFile = myFindFile("YCTranslation_base.txt")
    if(myFindChangeFile != null){
        myFindChangeFile = File(myFindChangeFile);
        var myResult = myFindChangeFile.open("r", undefined, undefined);
        if(myResult == true){
            //Loop through the find/change operations.
            do{
                myLine = myFindChangeFile.readln();
                //Ignore comment lines and blank lines.
                if((myLine.substring(0,4)=="text")||(myLine.substring(0,4)=="grep")||(myLine.substring(0,5)=="glyph")){
                    myFindChangeArray = myLine.split("\t");
                    //The first field in the line is the findType string.
                    myFindType = myFindChangeArray[0];
                    //The second field in the line is the FindPreferences string.
                    myFindPreferences = myFindChangeArray[1];
                    //The second field in the line is the ChangePreferences string.
                    myChangePreferences = myFindChangeArray[2];
                    //The fourth field is the range--used only by text find/change.
                    myFindChangeOptions = myFindChangeArray[3];
                    switch(myFindType){
                        case "text":
                            myFindText(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);
                            break;
                        case "grep":
                            myFindGrep(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);
                            break;
                        case "glyph":
                            myFindGlyph(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);
                            break;
                    }
                }
            } while(myFindChangeFile.eof == false);
            myFindChangeFile.close();
        }
    }
}
function myFindText(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){
    //Reset the find/change preferences before each search.
    app.changeTextPreferences = NothingEnum.nothing;
    app.findTextPreferences = NothingEnum.nothing;
    var myString = "app.findTextPreferences.properties = "+ myFindPreferences + ";";
    myString += "app.changeTextPreferences.properties = " + myChangePreferences + ";";
    myString += "app.findChangeTextOptions.properties = " + myFindChangeOptions + ";";
    app.doScript(myString, ScriptLanguage.javascript);
    myFoundItems = myObject.changeText();
    //Reset the find/change preferences after each search.
    app.changeTextPreferences = NothingEnum.nothing;
    app.findTextPreferences = NothingEnum.nothing;
}
function myFindGrep(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){
    //Reset the find/change grep preferences before each search.
    app.changeGrepPreferences = NothingEnum.nothing;
    app.findGrepPreferences = NothingEnum.nothing;
    var myString = "app.findGrepPreferences.properties = "+ myFindPreferences + ";";
    myString += "app.changeGrepPreferences.properties = " + myChangePreferences + ";";
    myString += "app.findChangeGrepOptions.properties = " + myFindChangeOptions + ";";
    app.doScript(myString, ScriptLanguage.javascript);
    var myFoundItems = myObject.changeGrep();
    //Reset the find/change grep preferences after each search.
    app.changeGrepPreferences = NothingEnum.nothing;
    app.findGrepPreferences = NothingEnum.nothing;
}
function myFindGlyph(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){
    //Reset the find/change glyph preferences before each search.
    app.changeGlyphPreferences = NothingEnum.nothing;
    app.findGlyphPreferences = NothingEnum.nothing;
    var myString = "app.findGlyphPreferences.properties = "+ myFindPreferences + ";";
    myString += "app.changeGlyphPreferences.properties = " + myChangePreferences + ";";
    myString += "app.findChangeGlyphOptions.properties = " + myFindChangeOptions + ";";
    app.doScript(myString, ScriptLanguage.javascript);
    var myFoundItems = myObject.changeGlyph();
    //Reset the find/change glyph preferences after each search.
    app.changeGlyphPreferences = NothingEnum.nothing;
    app.findGlyphPreferences = NothingEnum.nothing;
}
function myFindFile(myFilePath){
    var myScriptFile = myGetScriptPath();
    var myScriptFile = File(myScriptFile);
    var myScriptFolder = myScriptFile.path;
    myFilePath = myScriptFolder + myFilePath;
    if(File(myFilePath).exists == false){
        //Display a dialog.
        myFilePath = File.openDialog("Choose the file containing your find/change list");
    }
    return myFilePath;
}
function myGetScriptPath(){
    try{
        myFile = app.activeScript;
    }
    catch(myError){
        myFile = myError.fileName;
    }
    return myFile;
}