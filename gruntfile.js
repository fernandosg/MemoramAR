module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['src/class/*.js',"js/*.js","src/*.js"],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {          
          'dist/js/bundle.js': ['js/app.js','src/class/elemento.js','src/class/detector.js','src/class/labels.js','src/memorama.js'],
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};