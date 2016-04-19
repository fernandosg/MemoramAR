
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['js/*.js'],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          'dist/js/bundle.js': ['js/app.js','js/colisionobjeto.js','js/detector.js','js/escenario.js'],
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};