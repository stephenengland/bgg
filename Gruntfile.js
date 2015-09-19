var path = require('path');

var files = {
  js: {
    lib: 'lib/**/*.js',
    dev: 'dev/**/*.js',
    www: 'www/app/**/*.js'
  },
  html: {
    index: 'www/index.html',
    partials: 'www/partials/**/*.html'
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
      all: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev, files.js.www]
    },
    jsbeautifier: {
      files: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev, files.js.www],
      options: {
        config: ".jsbeautifyrc"
      }
    },
    watch: {
      express: {
        files: [files.js.www, files.html.index, files.html.partials],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    express: {
      local: {
        options: {
          script: 'server.js'
        }
      }
    },
    shell: {
      collectionProcessor: {
        command: 'node collectionProcessor.js'
      },
      kickoffCollection: {
        command: 'node dev/kickoff-collection.js'
      },
      pack: {
        command: 'tar -czf ' + path.join(__dirname, 'deploy.tar.gz') + ' lib node_modules controllers www config.json package.json server.js collectionProcessor.js'
      },
      provision: {
        command: 'vagrant provision'
      },
      localVm: {
        command: 'vagrant up'
      },
      destroyLocalVm: {
        command: 'vagrant destroy -f'
      },
      dockerRabbit: {
        command: 'docker run -d -p 5672:5672 -p 15672:15672 rabbitmq'
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
  grunt.registerTask('kickoffCollection', ['shell:kickoffCollection']);
  grunt.registerTask('collectionProcessor', ['shell:collectionProcessor']);
  grunt.registerTask('website', ['express:local', 'watch:express']);
  grunt.registerTask('server', ['parallel:server']);

  grunt.registerTask('create-vm', ['shell:pack', 'shell:localVm']);
  grunt.registerTask('recreate-vm', ['shell:destroyLocalVm', 'create-vm']);
  grunt.registerTask('deploy-vm', ['shell:pack', 'shell:provision']);

};
