#target photoshop

// JPEG Options;
jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = 12;

main();

function main() {
    if (app.documents.length > 0) {
        // Select Files;
        if ($.os.search(/windows/i) != -1) {
            var theFiles = File.openDialog("Chọn file thiết kế", "*.psd; *.tif; *.jpg; *.png", true);
            var theOutputPath = Folder.selectDialog("Chọn thư mục lưu file")
        } else {
            var theFiles = File.openDialog("Chọn file thiết kế", getFiles, true);
        };
        var documents = app.documents;
        for (var i = 0; i < documents.length; i++) {
            // $.writeln(documents[i])
            app.activeDocument = documents[i];
            var myDocument = app.activeDocument;
            var layers = myDocument.layers;
            var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
            var thePath = myDocument.path;
            var theFirstLayer = layers[0];

            // Check if layer is SmartObject;
            if (theFirstLayer.kind != "LayerKind.SMARTOBJECT") {
                alert("selected layer is not a smart object")
            } else {
                if (theFiles) {
                    for (var m = 0; m < theFiles.length; m++) {
                        theFirstLayer = replaceContents(theFiles[m], theFirstLayer);

                        var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                        // Save JPG
                        myDocument.saveAs((new File(theOutputPath + "/" + theNewName + "_" + theName + ".jpg")), jpgSaveOptions, true);
                    }
                }
            }
        }
    };
}

// Get PSDs, TIFs and JPGs from files
function getFiles(theFile) {
    if (theFile.name.match(/\.(psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
        return true
    };
};
// Replace SmartObject Contents
function replaceContents(newFile, theSO) {
    app.activeDocument.activeLayer = theSO;
    // =======================================================
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc3.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID("PgNm");
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
    return app.activeDocument.activeLayer
};