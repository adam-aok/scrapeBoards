﻿//ExportAllStories.jsx
//An InDesign JavaScript
/*  
@@@BUILDINFO@@@ "ExportAllStories.jsx" 3.0.0 15 December 2009
*/
//Exports all stories in an InDesign document in a specified text format.
//
//For more on InDesign/InCopy scripting see the documentation included in the Scripting SDK 
//available at http://www.adobe.com/devnet/indesign/sdk.html
//or visit the InDesign Scripting User to User forum at http://www.adobeforums.com
//

main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
     //app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
	if(app.documents.length != 0){
		if (app.activeDocument.stories.length != 0){
			//myDisplayDialog();
              myFolder = ("C:\Users\a.keefe\Desktop")
              expFormat = ".txt"          
              myExportDesc(expFormat, myFolder)
              $.gc()
		}
    
		else{
			alert("The document does not contain any text. Please open a document containing text and try again.");
		}
	}
	else{
		alert("No documents are open. Please open a document and try again.");
	}
}

//~ function myDisplayDialog(){
//~ 	with(myDialog = app.dialogs.add({name:"ExportAllStories"})){
//~ 		//Add a dialog column.
//~ 		myDialogColumn = dialogColumns.add()	
//~ 		with(myDialogColumn){
//~ 			with(borderPanels.add()){
//~ 				staticTexts.add({staticLabel:"Export as:"});
//~ 				with(myExportFormatButtons = radiobuttonGroups.add()){
//~ 					radiobuttonControls.add({staticLabel:"Text Only", checkedState:true});
//~ 					radiobuttonControls.add({staticLabel:"RTF"});
//~ 					radiobuttonControls.add({staticLabel:"InDesign Tagged Text"});
//~                       radiobuttonControls.add({staticLabel:"CSV"});
//~ 				}
//~ 			}
//~ 		}
//~ 		myReturn = myDialog.show();
//~ 		if (myReturn == true){
//~ 			//Get the values from the dialog box.
//~ 			myExportFormat = myExportFormatButtons.selectedButton;
//~ 			myDialog.destroy;
//~ 			myFolder= Folder.selectDialog ("Choose a Folder");
//~ 			if((myFolder != null)&&(app.activeDocument.stories.length !=0)){
//~ 				myExportAllStories(myExportFormat, myFolder);
//~ 			}
//~ 		}
//~ 		else{
//~ 			myDialog.destroy();
//~ 		}
//~ 	}
//~ }

//myExportStories function takes care of exporting the stories.
//myExportFormat is a number from 0-2, where 0 = text only, 1 = rtf, and 3 = tagged text.
//myFolder is a reference to the folder in which you want to save your files.

function myExportDesc(myExportFormat, myFolder){
    
    var curDate = new Date();
    myFileName = "ak.DataMine_" + curDate.toDateString()+ myExportFormat;
    myFilePath = myFolder + "/" + myFileName;
    var myFile = new File(myFilePath);
    
//resolves the lack of indexOf function   
if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }  
}  
   

    
    //fill row with null values at first
    for(pR = 0; pR < 7 ; pR++){
        pageRow[pR] = ("\"" + "\"");
        }
    
    //get name, project number, and practice area number
    var fnArr = app.activeDocument.name.split("_");
    pageRow[0] = ("\"" + app.activeDocument.filePath + "\"")
    pageRow[1] = ("\"" + fnArr[0] + "\"");
    pageRow[2] = ("\"" + fnArr[1] + "\"");
    
    for(myCounter = 0; myCounter < app.activeDocument.Spreads.length; myCounter++){
         var pageRow = [];
         
         mySpread = app.activeDocument.Spread.item(myCounter);
         
         for(myCount = 0; myCount < mySpread.textFrames.length; myCount++){
                 largest = ""; 
                 
                 //get each Story
                 myStory = mySpread.textFrames.item(myCount).parentStory;
                              
                 //replaces incompatible characters with csvFriendly ones--check function csvFriendly() for details
                 myStoryText = "\"" + csvFriendly(myStory.contents) + "\"";
                 
                 //get paragraph style for that text box
                 if (myStory.paragraphs.firstItem().isValid == true){
                 myStoryStyle = myStory.paragraphs.firstItem().appliedParagraphStyle.name;
                 }
                 //myBounds = app.activeDocument.textFrames.item(myCounter).geometricBounds.toString();
                      
                 //parse page title, commit to row         
                 if (myStoryStyle == "Project Name"){
                     var nameArr = new String();
                     nameBox = myStoryText;
                     nameArr = nameBox.split("</P><P>");
                     
                     //pageRow[4] = "\"" + nameArr.pop() + "\"";
                     pageRow[4] = "\"" + nameArr[nameArr.length-1] + "\"";
                     nameArr.pop();
                     pageRow[3] = "\"" + nameArr.toString().replace("\,"," ") + "\"";
                     }
                 
                 //parses Sidebar for size
               if (myStoryStyle == "Project Details"){
                     pageRow[5] = parseSidebar(myStory,"Size","Services");
                     pageRow[6] = parseSidebar(myStory,"Services","Client");
                    }
                 
                 //parses for Description text & compares the length of the story to see if it is the longest string represented so far    
                 if (myStoryStyle == "Body Text" && myStoryText.length > largest.length){
                     largest = myStoryText;
                     pageRow[7] = myStoryText;
                     }
                 
                                     
                //var sideBar = myStory.split("</P><P></P><P>");
                 //if(sideBar.length != 0){
                     //myStory = sideBar(0) + "\"\,";
                     //for (sbCounter = 0; sbCounter < sideBar.length - 1; cbCounter++){
                     //myStory = myStory + "\"" + sideBar(sbCounter) + "\"\,";
                     //;
                 //myStory = myStory.replace(("Size</P><P>"),"").replace("Services</P><P>","\,\"").replace("Client</P><P>","\","").replace("Awards</P><P>","\",)
                 
                //adds row to CSV
                //myID = app.activeDocument.stories.firstItem().id;
        }
    
    //myPageText = pageRow.toString() + "\," +   linkArr.toString() + "\n";
    //myStoryText = myStoryText +"\"" + app.activeDocument.name + "\"\," + "\"" + myBounds + "\"\," + "\"" + largest + "\"\, \n";    
    myPageText = pageRow.toString() + "\n";    
    writeFile(myFile, myPageText);
}
//link adding functions seems to have created an issue
//var linkArr = [];

//parses for link list
//for(myCounter = 0; myCounter < app.activeDocument.links.length; myCounter++){
   // eachLink = app.activeDocument.links.item(myCounter).filePath;
    //if (linkArr.indexOf("\"" + eachLink + "\"") == -1){
    //    linkArr.push("\"" + eachLink + "\"")
    //}
    //}
    
    
    
}

//test 

function writeFile(fileObj, fileContent, encoding) {  
    encoding = encoding || "UTF-8";  
    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);  
  
  
    var parentFolder = fileObj.parent;  
    if (!parentFolder.exists && !parentFolder.create())  
        throw new Error("Cannot create file in path " + fileObj.fsName);  
  
  
    fileObj.encoding = encoding;  
    fileObj.open("a");  
    fileObj.write(fileContent);  
    fileObj.close();  
  
  
    return fileObj;  
}  

function parseSidebar(myStory,Start,Finish){
    var sizeArr = [""];
    refString = csvFriendly(myStory.contents);
    var refArr = refString.split("</P><P>");
    sizeReturn = "";
    
    //loads paragraphs into string reference array
//~     for(myCounter = 0; myCounter < myStory.paragraphs.length ; myCounter++){
//~         sbLine = myStory.paragraphs.item(myCounter).contents.replace(/(\r\n|\n|\r)/gm,"").replace("\,","#%");
//~         refArr.push(sbLine);
//~         }
//~     
    //loads sizeArr with relevant data after size line
    sizeArr = refArr.slice(refArr.indexOf(Start)+1, refArr.indexOf(Finish));

    sizeReturn = "\"" + sizeArr.toString().replace(/,/g,";")     + "\"";
//.replace("\,",";")    
    return sizeReturn;
    }


//convert text into compatible csv format--REPLACE </P><P> WITH PARAGRAPH BREAK AND #% WITH COMMA
function csvFriendly(myText){
    myText = myText.replace(/(\r\n|\n|\r)/gm,"</P><P>").replace("\,","#%")
    //myText = myText.replace(/(\r\n|\n|\r)/gm,"</P><P>").replace(/,/g,"#%");
    return myText;
 }

function logMe(input){
     var now = new Date();
     var output = now.toTimeString() + ": " + input;
     $.writeln(output);
     var logFile = File("/path/to/logfile.txt");
     logFile.open("e");
     logFile.writeln(output);
     logFile.close();

}

