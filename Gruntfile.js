'use strict';


module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'www'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        bjinspur: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= bjinspur.app %>/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
            },
            styles: {
                files: ['<%= bjinspur.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= bjinspur.app %>/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= bjinspur.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        bowerRequirejs: {
            target: {
                rjsConfig: '<%= bjinspur.app %>/app.js',
                options: {
                    exclude: ['modernizr', 'requirejs', 'Framework7']
                }
            }
        },
         requirejs: {
             compile: {
                 options: {
                     name: 'app',
                     baseUrl: '<%= bjinspur.app %>/',
                     mainConfigFile: 'app/app.js',
                     out: '<%= bjinspur.dist %>/app.js',
                     optimizer: 'none'
                 }
             }
         },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8080,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./<%= bjinspur.app %>/bower_components')
                            ),
                            connect().use(
                                '/app/css',
                                connect.static('./<%= bjinspur.app %>/css')
                            ),
                            connect().use(
                                '/bower_components',
                                connect.static('./<%= bjinspur.app %>/bower_components')
                            ),
                            connect().use(
                                '/app/css',
                                connect.static('./<%= bjinspur.app %>/css')
                            ),
                            /*                           connect().use(
                                '/irms/services/netOpenService',
                                function (req, res, next) {
                                    console.log("/services/netOpenService req.body: %j", req.body);
                                    console.log("/services/netOpenService: %j", req.method);
                                    res.writeHead(200);
                                    res.write('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap:Body><ns1:personCount xmlns:ns1="http://iface.service.ws.mobile.bjapp.app.inspur.com"><ns1:out>{"result":"true","data":{"jd":24,"cg":12,"cs":3,"cgl":"50%","tscl":101}}</ns1:out></ns1:personCount></soap:Body></soap:Envelope>');
                                    res.end();
                                }
                            ),*/
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    // base: '<%= bjinspur.dist %>',
                    middleware: function (connect) {
                        return [
                            connect().use(
                                '/bower_components',
                                connect.static('./<%= bjinspur.app %>/bower_components')
                            ),
                            connect.static(appConfig.dist)
                        ];
                    }
                }
            }
        },

        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= bjinspur.app %>/{,*/}*.js'
                ]
            },
            test: {
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= bjinspur.app %>/{,*/}*.js'
                ]
            },
            test: {
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= bjinspur.dist %>/{,*/}*',
                        '!<%= bjinspur.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({browsers: ['last 1 version']})
                ]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= bjinspur.app %>/index.html'],
                ignorePath:  /\.\.\//
            }
        },

        // Renames files for browser caching purposes
/*        filerev: {
            dist: {
                src: [
                    '<%= bjinspur.dist %>/js/{,*!/}*.js',
                    '<%= bjinspur.dist %>/css/{,*!/}*.css',
                    '<%= bjinspur.dist %>/img/{,*!/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= bjinspur.dist %>/{,*!/}/fonts/!*'
                ]
            }
        },*/

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= bjinspur.app %>/index.html'],
            options: {
                dest: '<%= bjinspur.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= bjinspur.dist %>',
                    src: ['module/**/*.js'],
                    dest: '<%= bjinspur.dist %>'
                },{
                    expand: true,
                    cwd: '<%= bjinspur.dist %>',
                    src: ['lib/{,*/}*.js'],
                    dest: '<%= bjinspur.dist %>'
                }]
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= bjinspur.dist %>/{,*/}*.html'],
            css: ['<%= bjinspur.dist %>/css/{,*/}*.css'],
            js: ['<%= bjinspur.dist %>/js/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= bjinspur.dist %>',
                    '<%= bjinspur.dist %>/img',
                    '<%= bjinspur.dist %>/css'
                ],
                patterns: {
                    js: [[/(img\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= bjinspur.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= bjinspur.dist %>/img'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= bjinspur.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= bjinspur.dist %>/img'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= bjinspur.dist %>',
                    src: ['*.html'],
                    dest: '<%= bjinspur.dist %>'
                },{
                    expand: true,
                    cwd: '<%= bjinspur.dist %>',
                    src: ['page/**/*.html'],
                    dest: '<%= bjinspur.dist %>'
                },{
                    expand: true,
                    cwd: '<%= bjinspur.dist %>',
                    src: ['module/**/*.hbs'],
                    dest: '<%= bjinspur.dist %>'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= bjinspur.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= bjinspur.app %>',
                    dest: '<%= bjinspur.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'img/{,**/}*.{webp,png,jpg,jpeg,gif}',
                        'css/fonts/{,**/}*.*',
                        'page/**/*.html',
                        'module/**',
                        'lib/*.js'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= bjinspur.dist %>/img',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '<%= bjinspur.app %>/bower_components/font-awesome',
                    src: 'fonts/*',
                    dest: '<%= bjinspur.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= bjinspur.app %>/bower_components/Framework7/dist',
                    src: 'img/*',
                    dest: '<%= bjinspur.dist %>'
                },{
                    src: '<%= bjinspur.app %>/bower_components/requirejs/require.js',
                    dest: '<%= bjinspur.dist %>/lib/require.js'
                },{
                    src: '<%= bjinspur.app %>/css/defaultTheme.css',
                    dest: '<%= bjinspur.dist %>/css/defaultTheme.css'
                },{
                    src: '<%= bjinspur.app %>/css/myTheme.css',
                    dest: '<%= bjinspur.dist %>/css/myTheme.css'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= bjinspur.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles'
            ]
        },
        replace: {
            dist: {
                src: ['<%= bjinspur.dist %>/index.html'],
                overwrite: true,
                replacements: [{
                    from: "bower_components/requirejs",
                    to: "lib"
                },{
                    from: 'div data-page="index.css"',
                    to: 'div data-page="index"'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowerRequirejs',
            'wiredep',
            'concurrent:server',
            'postcss:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'bowerRequirejs',
        'requirejs',
        'postcss',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin',
        'replace:dist'
    ]);
}
