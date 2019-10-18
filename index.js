const config = require('config')
const express = require('express')
const cors = require('cors')
const MBTiles = require('@mapbox/mbtiles')

const htdocsDir = config.get('htdocsDir')
const fontsDir = config.get('fontsDir')
const mbtilesPath = config.get('mbtilesPath')
const port = config.get('port')

const app = express()
app.use(cors())
app.use('/', express.static(htdocsDir))
app.use('/fonts', express.static(fontsDir))

const openMbtiles = () => {
  return new Promise((resolve, reject) => {
    new MBTiles(`${mbtilesPath}?mode=ro`, (err, mbtiles) => {
      if (err) { reject(err) }
      resolve(mbtiles)
    })
  })
}
let mbtiles
openMbtiles().then(m => {
  mbtiles = m
})

const getTile = (z, x, y) => {
  return new Promise((resolve, reject) => {
    mbtiles.getTile(z, x, y, (err, tile, headers) => {
      if (err) reject(err)
      resolve(tile)
    })
  })
}

app.get('/zxy/:z/:x/:y.pbf', async (req, res) => {
  const z = parseInt(req.params.z)
  const x = parseInt(req.params.x)
  const y = parseInt(req.params.y)
  getTile(z, x, y).then(tile => {
    res.set('content-type', 'application/vnd.mapbox-vector-tile')
    res.set('content-encoding', 'gzip')
    res.send(tile)
  }).catch(e => {
    res.status(404).send(`tilenot found /zxy/${z}/${x}/${y}.pbf: ${e}`)
  })
})

app.listen(port)

