task :build do 
  sh "parse-hocon hocon/style.conf --output htdocs/style.json"
  sh "gl-style-validate htdocs/style.json"
  sh "browserify -o htdocs/bundle.js -t " +
    "[ babelify --presets [ @babel/preset-env ] ] app.js"
end

task :start do
  sh "pm2 start process.yml"
end

task :stop do
  sh "pm2 stop koji; pm2 delete koji"
end

task :_mapbox do
  sh "cp ../mapbox-gl-js/dist/mapbox-gl.js htdocs"
  sh "cp ../mapbox-gl-js/dist/mapbox-gl.js.map htdocs"
  sh "cp ../mapbox-gl-js/dist/mapbox-gl.css htdocs"
end
