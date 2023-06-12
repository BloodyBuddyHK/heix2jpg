const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const convert = require('heic-convert');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Function to convert HEIC/HEIF to JPEG
async function convertHEICToJPEG(sourceFile) {
  const buffer = await readFile(sourceFile);
  const jpegData = await convert({
    buffer,
    format: 'JPEG'
  });
  const outputFilename = `${sourceFile.replace(/\.[^/.]+$/, "")}.jpg`;
  await writeFile(outputFilename, jpegData);
  console.log(`Converted: ${sourceFile} --> ${outputFilename}`);
}

// Accept files through command-line arguments or drag-and-drop
const inputFiles = process.argv.slice(2);
if (inputFiles.length === 0) {
  console.log('Please drag and drop one or more HEIC/HEIF files onto the executable.');
  console.log('Programme by Rex Lam @ June 2023');
  process.exit(0);
}

// Iterate over input files
(async () => {
  for (const inputFile of inputFiles) {
    const extension = path.extname(inputFile).toLowerCase();

    // Convert HEIC/HEIF files to JPEG
    if (extension === '.heic' || extension === '.heif') {
      try {
	console.log(`Start converting...`);
        await convertHEICToJPEG(inputFile);
      } catch (error) {
        console.error(`Error converting ${inputFile}: ${error}`);
      }
    } else {
      console.log(`Skipped: ${inputFile}`);
    }
  }

  console.log('Conversion complete.');
})();