# e. e. books
[Firepad](https://firepad.io/) based document-editor with ability to upload a Word file and export to a PDF file. Running on a Node/Express server.

###Dependencies:
- [Node.js](https://nodejs.org/en/download/) 
- [Antiword](http://www.winfield.demon.nl/) for reading uploaded Word files (not required)

###Build steps:
- Clone repo to local directory
- `cd` to directory of cloned project
- `npm install`
	- All node dependencies will be installed
- `npm start`
	- Starts server at http://localhost:3000/ 

###Important contents:
- views/ : the front-end content 
- public/ : front-end javascript and css
- routes/ : the back-end JS

Note: When you press the Generate PDF button on the site, the generated PDF does not appear on the screen. It can instead be found in the root project directory as PDFoutput.pdf