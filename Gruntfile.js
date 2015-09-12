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
      },
      website: {
        src: ['server.js']
      }
    },
    availabletasks: {
      tasks: {
        options: {
          filter: 'exclude',
          tasks: ['availabletasks']
        }
      }
    },
    parallel: {
      server: {
        options: {
          grunt: true,
          stream: true
        },
        tasks: ['website', 'collectionProcessor']
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-available-tasks'); //For some reason, load-grunt-tasks doesn't like this NpmTask.


  grunt.registerTask('default', ['jshint:all', 'jsbeautifier', 'server']);
  grunt.registerTask('kickoffCollection', ['execute:kickoffCollection']);
  grunt.registerTask('collectionProcessor', ['execute:collectionProcessor']);
  grunt.registerTask('website', ['execute:website']);
  grunt.registerTask('server', ['parallel:server']);
};
