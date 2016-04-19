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
<<<<<<< HEAD
          'dist/js/bundle.js': ['js/app.js','src/class/elemento.js','src/class/detector.js','src/class/labels.js','src/memorama.js'],
=======
          'dist/js/bundle.js': ['js/app.js','src/class/elemento.js','src/class/detector.js','src/class/labels.js'],
>>>>>>> 62826756d397e97035323cc9b1707eec56209178
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};