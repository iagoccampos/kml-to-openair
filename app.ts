import { XMLParser } from 'fast-xml-parser'
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs'

interface KMLFile { kml: { Document: { Placemark: { Polygon: { outerBoundaryIs: { LinearRing: { coordinates: string }}}}}}}

const inputFolderPath = './input'

if(!existsSync(inputFolderPath)) {
	mkdirSync(inputFolderPath)
	console.log('Add all you .kml files into input folder and restar the program.')
	process.exit(0)
}

const kmzFiles = readdirSync('./input').filter((val) => val.endsWith('.kml'))

const parser = new XMLParser();

let openairFileContent = ''

kmzFiles.forEach((fileName) => {
	const file = readFileSync(`./input/${fileName}`).toString()

	const cordinatesString = (parser.parse(file) as KMLFile).kml.Document.Placemark.Polygon.outerBoundaryIs.LinearRing.coordinates;

	// [long, lat, long, lat, ...]
	const cordinatesDD = cordinatesString.replace(/,0\s?/g, ',').split(',').filter((val) => !!val)

	const cordinatesDMS = cordinatesDD.map((el, i) => {
		function convertDDToDMS(D: number, lng: boolean) {
			return {
				dir: D < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
				deg: 0 | (D < 0 ? (D = -D) : D),
				min: 0 | (((D += 1e-9) % 1) * 60),
				sec: (0 | (((D * 60) % 1) * 6000)) / 100,
			};
		}

		const lng = i%2 === 0
		const con = convertDDToDMS(+el, lng)

		const deg = con.deg.toString().padStart(lng ? 3 : 2, '0')
		const min = con.min.toString().padStart(2, '0')
		const sec = Math.round(con.sec).toString().padStart(2, '0')

		return `${deg}:${min}:${sec} ${con.dir}`
	})

	const lng = cordinatesDMS.filter((el, i) => i%2 === 0)
	const lat = cordinatesDMS.filter((el, i) => i%2 === 1)	

	openairFileContent += `AC CTR\nAN ${fileName.slice(0,-4)}\nAL SFC\nAH XXXX MSL\n`

	for(let i = 0; i < lng.length; i++) {
		openairFileContent += `DP ${lat[i]} ${lng[i]}\n`
	}

	openairFileContent += '\n'
})

writeFileSync('./output/output.txt', openairFileContent)
