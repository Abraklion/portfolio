// Компелирует Pug файлы в Html и переносит файлы в папку dist

module.exports = function () {

  $.gulp.task('pug', () => {

    return $.gulp.src($.config.paths.pug, { base: "src/" })
      .pipe($.gp.plumber())
      .pipe($.gp.pug({
        locals: {
            jsonHeader: JSON.parse($.fs.readFileSync('./src/templates/data/dataHeader.json', 'utf8')),
            jsonInfo: JSON.parse($.fs.readFileSync('./src/templates/data/dataInfo.json', 'utf8')),
            jsonBiography: JSON.parse($.fs.readFileSync('./src/templates/data/dataBiography.json', 'utf8')),
            jsonPortfolio: JSON.parse($.fs.readFileSync('./src/templates/data/dataPortfolio.json', 'utf8')),
            jsonSkills: JSON.parse($.fs.readFileSync('./src/templates/data/dataSkills.json', 'utf8')),
            jsonContacts: JSON.parse($.fs.readFileSync('./src/templates/data/dataContacts.json', 'utf8')),
            jsonFooter: JSON.parse($.fs.readFileSync('./src/templates/data/dataFooter.json', 'utf8')),
        }
      }))
      .pipe($.gp.formatHtml())
      .pipe($.gp.if($.config.toggle.minHtml, $.gp.htmlmin({ collapseWhitespace: true })))
      .pipe($.gulp.dest($.config.output.path))
      .pipe($.browserSync.stream());
  });
}

