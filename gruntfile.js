module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
      concat: {
        options: {
          separator: ';',
        },
        dist: {
          src : ['src/app.js', 'src/services/*.js', 'src/controllers/*.js', 'src/directives/*.js'],
          dest : 'dist/ng-maps.js'
        },
      },
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files: [{
            src : ['src/app.js', 'src/services/*.js', 'src/controllers/*.js', 'src/directives/*.js'],
            dest : 'dist/ng-maps.min.js'
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'concat']);

};