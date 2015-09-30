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
        jshintrc: '.jshintrc'
      },
      //Target - "all"
      all: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev, files.js.www]
    },
    jsbeautifier: {
      files: ['Gruntfile.js', 'collectionProcessor.js', files.js.lib, files.js.dev, files.js.www],
      options: {
        config: '.jsbeautifyrc'
      }
    },
    watch: {
      express: {
        files: [files.js.www, files.html.index, files.html.partials],
        tasks: ['jshint'],
        options: {
          livereload: 35730
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
      },
      /* This task is only used by the owner of https://github.com/thealah/bgg to deploy to the dev environment */
      provisionToAwsDev: {
        command: 'ansible-playbook --become-user root --user ubuntu -i aws_inventory --private-key /amazonkeys/IISWeb.pem playbook.yml',
        options: {
          execOptions: {
            cwd: './provision/'
          }
        }
      },
      mongodb: {
        command: 'mkdir -m a=rwx -p /data/bgg && mongod --dbpath /data/bgg',
        options: {
            async: true,
            stdout: true,
            stderr: true,
            failOnError: true,
            execOptions: {
                cwd: '.'
              }
          }
      },
      rabbitmq: {
        command: 'rabbitmq-server -detached',
        options: {
          async: false,
          stdout: true,
          stderr: true,
          failOnError: true,
          execOptions: {
            cwd: '.'            
          }
        }
      },
      stopRabbitMQ: {
        command: 'rabbitmqctl -q stop',
        options: {
          stderr: false,
          stdout: false,
          failOnError: false
        }      
      },
      stopMongoDB: {
        command: 'mongo --eval "db.getSiblingDB(\'admin\').shutdownServer()"',
        options: {
          stderr: false,
          stdout: false,
          failOnError: false
        }
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
  grunt.loadNpmTasks('grunt-shell-spawn'); // Enables grunt tasks to be run in the background.


  grunt.registerTask('default', ['jshint:all', 'jsbeautifier', 'server']);
  grunt.registerTask('kickoffCollection', 'Run a test message for the processor to pick up on', ['shell:kickoffCollection']);
  grunt.registerTask('collectionProcessor', 'Run the processor responsible for handling BGG integration', ['shell:collectionProcessor']);
  grunt.registerTask('website', 'Run the website', ['express:local', 'watch:express']);
  grunt.registerTask('server', 'Run the website and processor side-by-side', ['parallel:server']);
  grunt.registerTask('mongodb', 'Start the mongodb server', ['shell:mongodb']);
  grunt.registerTask('rabbitmq', 'Start the rabbitmq-server', ['shell:rabbitmq']);
  grunt.registerTask('create-vm', 'Create a local vm using Vagrant and Ansible', ['shell:pack', 'shell:localVm']);
  grunt.registerTask('recreate-vm', 'Remake your local vm using Vagrant and Ansible', ['shell:destroyLocalVm', 'create-vm']);
  grunt.registerTask('deploy-vm', 'Delete your local vm you created using create-vm', ['shell:pack', 'shell:provision']);
  grunt.registerTask('cleanup', 'Stop the running processes', ['shell:stopMongoDB', 'shell:stopRabbitMQ']);

  grunt.registerTask('test', 'This command is what gets run by the Travis CI build to test the app.', ['jshint:all']);
};
