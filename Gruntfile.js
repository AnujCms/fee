var pathToDevlopyment = "../svm-deplyed";
var minplace = "../pubview";
module.exports = function (grunt) {
    //grunt.file.copy('HTML/*.html', 'HTML/src');
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 6,
                },
                files: [
                    {
                        src: ['Static_Content/JavaScript/*.js', 'Static_Content/JavaScript/*/*.js', 'Static_Content/JavaScript/*/*.*.js'],
                        ext: '.js.gz',
                        extDot: 'last',
                        filter: 'isFile',
                        expand: true
                    },
                    {
                        src: ['HTML/*/*.html'],
                        ext: '.html.gz',
                        extDot: 'last',
                        filter: 'isFile',
                        expand: true
                    },
                    {
                        src: ['Static_Content/CSS/*.css', 'Static_Content/CSS/*.*.css'],
                        ext: '.css.gz',
                        extDot: 'last',
                        filter: 'isFile',
                        expand: true
                    }

                ]
            }
        },
        watch: {
            files: ['Static_Content/JavaScript/*.js', 'Static_Content/JavaScript/*/*.js', 'HTML/*/*.htm*', 'Static_Content/CSS/*.css'],
            tasks: ['compress']

        },
        uglify: {
            build: {
                files: [{
                    expand: true,
                    src: 'public/js/*.js'
                },
                {
                    expand: true,
                    src: 'production_website/assets/js/*.js'
                }
                ]
            },
            onlystatic: {
                files: [{
                    expand: true,
                    src: 'public/js/*.js'
                }
                ]
                
            }

        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                processImport: false,
                force: true

            },
            build: {
                files: [{
                    expand: true,
                    src: ['public/css/*.css']
                },
                {
                    expand: true,
                    src: ['production_website/assets/css/*.css', 'production_website/assets/js/*/*.css']
                }
                ]
            },
            onlystatic: {
                files: [{
                    expand: true,
                    src: ['public/css/*.css']
                }
                ]
            }
        },
		copy: {
            main: {
                src: ['**/**'],
                expand: true,
                cwd: '.',
                dest: pathToDevlopyment,
            },
			onlypubview: {
				src: ['public/**', 'view/**'],
				expand: true,
				cwd: '.',
				dest: minplace,
			}
        },
        'string-replace': {
            build: {
                files: [{
                    expand: true,
                    src: 'view/*/*.html'
                },
                {
                    expand: true,
                    src: 'routeconfigurer.js'

                },
                {
                    expand: true,
                    src: 'production_website/*.html'

                }
                ],
                options: {
                    replacements: [{
                        pattern: /(StaticContent)/g,
                        replacement: "StaticContent" + "<%= grunt.template.today('mmddHHMM') %>"
                    }, {
                        pattern: /(HomepageAssest)/g,
                        replacement: "HomepageAssest" + "<%= grunt.template.today('mmddHHMM') %>"
                    }]
                }
            }
        },
        clean: {
            build: {
                src: [pathToDevlopyment],
                options: {
                    force: true
                }
            }
        },

        shell: {

            svnUpdate: {
                command: 'git pull && git submodule update --recursive --remote',

            },
            npmInstall: {
                command: 'sudo npm install'
            },
            npmInstallOnlyDev: {
                command: 'sudo npm install --only=dev'
            },
            shellCompress: {
                command: 'sudo grunt compress',
                options: {
                    execOptions: {
                        cwd: pathToDevlopyment
                    }
                }
            },
            shellUglify: {
                command: 'sudo grunt uglify:build',
                options: {
                    execOptions: {
                        cwd: pathToDevlopyment
                    }
                }

            },
			shellUglification: {
                command: 'sudo grunt uglify:onlystatic',
                options: {
                    execOptions: {
                        cwd: '.',
                    }
                }

            },
            shellCssmin: {
                command: 'sudo grunt cssmin:build',
                options: {
                    execOptions: {
                        cwd: pathToDevlopyment
                    }
                }
            },
			shellCssminification: {
                command: 'sudo grunt cssmin:onlystatic',
                options: {
                    execOptions: {
                        cwd: '.',
                    }
                }
            },
            shellStringReplace: {
                command: 'sudo grunt string-replace',
                options: {
                    execOptions: {
                        cwd: pathToDevlopyment
                    }
                }
            },
        },
        cacheBust: {
            options: {
                assets: ['public/**/*'],
                jsonOutput: true
            },
            taskName: {
                cwd: pathToDevlopyment,
                files: [{
                    expand: true,
                    cwd: pathToDevlopyment,
                    src: ['view/**/*.html']
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cache-bust');

    grunt.registerTask('deploy', ['shell:svnUpdate', 'shell:npmInstall', 'clean', 'copy:main', 'shell:shellUglify', 'shell:shellCssmin']);
    grunt.registerTask('windeploy', ['clean','copy','cacheBust']);
	grunt.registerTask('minplace', ['clean', 'shell:shellUglification', 'shell:shellCssminification']);
};