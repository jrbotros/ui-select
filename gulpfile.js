var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var streamqueue = require('streamqueue');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var titleCase = require('title-case');

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};

gulp.task('default', ['test']);
gulp.task('test', ['karma']);

gulp.task('watch', ['karma-watch']);

gulp.task('clean', function(cb) {
  del(['dist', 'temp'], cb);
});

gulp.task('karma', function() {
  karma.start({configFile : __dirname +'/karma.conf.js', singleRun: true});
});

gulp.task('karma-watch', function() {
  karma.start({configFile :  __dirname +'/karma.conf.js', singleRun: false});
});

gulp.task('pull', function(done) {
  $.git.pull();
  done();
});

gulp.task('add', function(done) {
  $.git.add();
  done();
});

gulp.task('recommendedBump', function(done) {
  /**
   * Bumping version number and tagging the repository with it.
   * Please read http://semver.org/
   *
   * To bump the version numbers accordingly after you did a patch,
   * introduced a feature or made a backwards-incompatible release.
   */

  conventionalRecommendedBump({preset: 'angular'}, function(err, importance) {
    // Get all the files to bump version in
    gulp.src(['./package.json'])
      .pipe($.bump({type: importance}))
      .pipe(gulp.dest('./'));

    done();
  });
});

gulp.task('changelog', function() {

  return gulp.src('CHANGELOG.md', {buffer: false})
    .pipe($.conventionalChangelog({preset: 'angular'}))
    .pipe(gulp.dest('./'));
});

gulp.task('push', function(done) {
  $.git.push('origin', 'master', {args: '--follow-tags'});
  done();
});

gulp.task('commit', function() {
  return gulp.src('./')
    .pipe($.git.commit('chore(release): bump package version and update changelog', {emitData: true}))
    .on('data', function(data) {
      console.log(data);
    });
});

gulp.task('tag', function() {
  return gulp.src('package.json')
    .pipe($.tagVersion());
});

gulp.task('bump', function(done) {
  runSequence('recommendedBump', 'changelog', 'add', 'commit', 'tag', 'push', done);
});

gulp.task('docs', function (cb) {
  runSequence('docs:clean', 'docs:examples', 'docs:assets', 'docs:index', cb);
});

gulp.task('docs:clean', function (cb) {
  del(['docs-built'], cb)
});

gulp.task('docs:assets', function () {
  gulp.src('./dist/*').pipe(gulp.dest('./docs-built/dist'));
  return gulp.src('docs/assets/*').pipe(gulp.dest('./docs-built/assets'));
});

gulp.task('docs:examples', function () {
  // Need a way to reset filename list: $.filenames('exampleFiles',{overrideMode:true});
  return gulp.src(['docs/examples/*.html'])
    .pipe($.header(fs.readFileSync('docs/partials/_header.html')))
    .pipe($.footer(fs.readFileSync('docs/partials/_footer.html')))
    .pipe($.filenames('exampleFiles'))
    .pipe(gulp.dest('./docs-built/'));
});

gulp.task('docs:index', function () {

  var exampleFiles = $.filenames.get('exampleFiles');
  exampleFiles = exampleFiles.map(function (filename) {
    var cleaned = titleCase(filename.replace('demo-', '').replace('.html', ''));
    return '<h4><a href="./' + filename + '">' + cleaned + '</a> <plnkr-opener example-path="' + filename + '"></plnkr-opener></h4>';
  });

  return gulp.src('docs/index.html')
    .pipe($.replace('<!-- INSERT EXAMPLES HERE -->', exampleFiles.join("\n")))
    .pipe(gulp.dest('./docs-built/'));
});

gulp.task('docs:watch', ['docs'], function() {
  gulp.watch(['docs/**/*.{js,html}'], ['docs']);
});

var handleError = function (err) {
  console.log(err.toString());
  this.emit('end');
};
