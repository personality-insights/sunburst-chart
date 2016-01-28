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
merge       = require('event-stream').merge
gutil       = require('gulp-util')
coffee      = require('gulp-coffee')

# Local
dirs    = require('./config').directories
sources = require('./config').sources

# compile js and coffee to client.js
gulp.task 'scripts', ->
  merge(
    gulp.src(sources.scripts + '/**/*.coffee')
      .pipe(debug(title: '[scripts][coffee]'))
      .pipe(coffee({bare:true}).on('error', gutil.log)),
    gulp.src(sources.scripts + '/**/*.js')
      .pipe(debug(title: '[scripts][js]'))
    )
    .pipe(gulp.dest(dirs.build + '/'))
