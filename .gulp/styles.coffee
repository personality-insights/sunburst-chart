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
sass        = require('gulp-sass')
concat      = require('gulp-concat')
debug       = require('gulp-debug')

# Local
sources = require('./config').sources
dirs    = require('./config').directories

gulp.task 'styles', ->
  gulp.src(sources.styles + '/**/*.scss')
    .pipe(debug(title : '[styles][scss]'))
    .pipe(sass(
      errLogToConsole: true
    ))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(dirs.build))
