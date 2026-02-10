const { PDFParse } = require("pdf-parse");

async function test() {
    try {
        console.log("PDFParse class found:", !!PDFParse);
    } catch (e) {
        console.error(e);
    }
}

test();
