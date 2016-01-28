###
# Copyright 2015 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.
###

# Modules
gulp        = require('gulp')
debug       = require('gulp-debug')
clean       = require('gulp-clean')
rename      = require('gulp-rename')
gutil       = require('gulp-util')
uglify      = require('gulp-uglify')
gulpif      = require('gulp-if')
minifyCss   = require('gulp-minify-css')
browserify  = require('gulp-browserify')
sequence    = require 'run-sequence'

# Tasks
require('./styles')
require('./scripts')

# Local
config    = require('./config')
compilation = config.compilation
component = config.component
dirs      = config.directories

versionRelease = -> gulpif(component.versioned, gulp.dest(dirs.release))

# Compile task
gulp.task 'release', ->
  versionName = component.name + '.' + component.version

  # Deploy JavaScript
  gulp.src(dirs.build + '/main.js')
    .pipe(debug(title: '[release][scripts]'))

  if compilation.browserify.enabled?
    gulp.src(dirs.build + '/main.js')
      .pipe(browserify(
        debug : config.debug
        transform : compilation.browserify.transform
        standalone : component.exportName if compilation.standalone
      ))
      .pipe(gulpif(component.versioned, rename(versionName + '.standalone.js')))  .pipe(versionRelease())
      .pipe(rename(component.name + '.standalone.js'))                   .pipe(gulp.dest(dirs.release))
      .pipe(uglify())
      .pipe(gulpif(component.versioned, rename(versionName + '.standalone.min.js'))) .pipe(versionRelease())
      .pipe(rename(component.name + '.standalone.min.js'))               .pipe(gulp.dest(dirs.release))

  gulp.src(dirs.build + '/main.js')
    .pipe(gulpif(component.versioned, rename(versionName + '.js')))      .pipe(versionRelease())
    .pipe(rename(component.name + '.js'))                                .pipe(gulp.dest(dirs.release))
    .pipe(uglify())
    .pipe(gulpif(component.versioned, rename(versionName + '.min.js')))  .pipe(versionRelease())
    .pipe(rename(component.name + '.min.js'))                            .pipe(gulp.dest(dirs.release))

  # Deploy CSS
  gulp.src(dirs.build + '/main.css')
    .pipe(debug(title: '[release][styles]'))
    .pipe(rename(component.name + '.css'))                               .pipe(gulp.dest(dirs.release))
    .pipe(gulpif(component.versioned, rename(versionName + '.css')))     .pipe(versionRelease())
    .pipe(minifyCss())
    .pipe(gulpif(component.versioned, rename(versionName + '.min.css'))) .pipe(versionRelease())
    .pipe(rename(component.name + '.min.css'))                           .pipe(gulp.dest(dirs.release))


gulp.task 'compile', ->
  sequence ['styles', 'scripts'], 'release'


gulp.task 'clean', ->
  gulp.src(dirs.build, read: false)
    .pipe(debug(title: '[clean]'))
    .pipe(clean())
