module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files: [{
            src : ['src/app.js', 'src/services/*.js', 'src/controllers/*.js', 'src/directives/*.js'],
            dest : 'dist/ng-data-map.js'
          },
          {
            src: ['example/js/app.js', 'example/js/services/*.js', 'example/js/controllers/*.js', 'example/js/directives/*.js'],
            dest: 'example/build.js'
          }]
        }
      }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};