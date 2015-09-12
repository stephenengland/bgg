var files = {
  js: {
    lib: 'lib/**/*.js',
    dev: 'dev/**/*.js'
  }
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //Step 1
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      //Target - "all"
      all: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev]
    },
    jsbeautifier: {
      files: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev],
      options: {
        config: ".jsbeautifyrc"
      }
    },
    execute: {
      collectionProcessor: {
        src: ['collectionProcessor.js']
      },
      kickoffCollection: {
        src: ['dev/kickoff-collection.js']
      }
    },
    availabletasks: {
      tasks: {
        options: {
          filter: 'exclude',
          tasks: ['availabletasks']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-available-tasks'); //For some reason, load-grunt-tasks doesn't like this NpmTask.


  //Set the default task - this will be what happens when you run the command  "grunt" in your directory.
  grunt.registerTask('default', ['jshint:all', 'jsbeautifier']);
  grunt.registerTask('kickoffCollection', ['execute:kickoffCollection']);
  grunt.registerTask('collectionProcessor', ['execute:collectionProcessor']);
};
