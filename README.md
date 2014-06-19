gulp-use-asset
==============

Define a build asset to use in an HTML comment block.

## Version 0.1.0

## Installation

    npm install gulp-use-asset

## What

Use Asset is a gulp plugin that uses buffers to parse a file for these specfic html comments:

    <!-- use:(js|css) path/to/file.(js|css) -->

    <!-- ANY line that is put in here will be replaced with a link or script tag pointing to the specified file.

    <!-- enduse -->

## Why

For single level build setups, gulp-use-ref is more than awesome for throwing all of your assets into /dist with the correct file
references.

However, if you have several nested apps, that maybe share some resources, this get's tricky,

Consider:

    |- App/
    |-- bower_components/
    |-- subAppOne/
    |---- scripts/
    |---- styles/
    |---- views
    |---- index.html
    |-- subAppTwo/
    |---- subAppThree/
    |------ scripts/
    |------ styles/
    |------ views
    |------ index.html
    |---- scripts/
    |---- styles/
    |---- views
    |---- index.html
    |-- scripts/
    |-- styles/
    |-- views/
    |-- index.html



    // App/index.html
    <!-- build:js scripts/vendor.js -->
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>
    <script src="bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <!-- endbuild -->

    // App/subAppOne/index.html
    <!-- use:js ../scripts/vendor.js -->
    <script src="../bower_components/angular/angular.js"></script>
    <script src="../bower_components/angular-route/angular-route.js"></script>
    <script src="../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js"></script>
    <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <!-- enduse -->

    // App/subAppTwo/index.html
    <!-- use:js ../scripts/vendor.js -->
    <script src="../bower_components/angular/angular.js"></script>
    <script src="../bower_components/angular-route/angular-route.js"></script>
    <script src="../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js"></script>
    <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <!-- enduse -->

    // App/subAppThree/index.html
    <!-- use:js ../../scripts/vendor.js -->
    <script src="../../bower_components/angular/angular.js"></script>
    <script src="../../bower_components/angular-route/angular-route.js"></script>
    <script src="../../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js"></script>
    <script src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <!-- enduse -->

This way the vendor.js file is built only once and the others will simply reference it.

## How

1. Require the module after installing

    var useAsset = require('gulp-use-asset');

2. Add to your personal build step:

    return gulp.src('path/to/html/file.html')
      .pipe(useAsset())
      .pipe(gulp.dest('path/to/dist/dir/'));

3. It's that easy because gulp is awesome. It slides in nicely with the gulp-useref workflow.


## Issues

Please submit via the issues tab for this repository!
