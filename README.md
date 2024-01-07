# Convert multiple KML files into a single Openair format

This project was developed to convert polygons that is inside multiple .kml files into a single .txt (Openair) file. It only converts decima degrees (DD) cordinates into degrees, minutes, and seconds (DMS) and adds some basic commands to make it readable as an Openair file. I strongly recommend to read some [Openair documentations](http://www.winpilot.com/usersguide/userairspace.asp) before using it.

Since it involves security in the airspace **use at your own risk**.

How to use it:

1. Install [Node.js](https://nodejs.org/en)

1. Open a terminal (cmd) inside the project folder

1. Run `npm install` and wait the task finish

1. Place all your .kml files into input folder

1. Run `npm start` and wait the task finish

1. All your kml files will be inside the file output.txt

All commands can be added/edited manually in the output.txt after it.

Make a copy of the output.txt so the program can't override it.
