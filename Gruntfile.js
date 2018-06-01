
"use strict";

module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		generateSourceMaps: true,
		config: {
			app: 'src',
			www: 'www'
		},
		clean: {
			options: { force: true },
			all: ["<%= config.www %>/*"],
			js: ["<%= config.www %>/js/*"],
			css: ["<%= config.www %>/css/*"]
		},
		requirejs: {
			compile: {
				options: {
					findNestedDependencies: true,
					generateSourceMaps: true,
					preserveLicenseComments: false,
					preserveComments: false,
					removeCombined: true,
					name: "main",
					baseUrl: "<%= config.app %>/js/client/",
					mainConfigFile: "<%= config.app %>/js/client/main.js",
					out: "<%= config.www %>/js/script.min.js",
					include: ['../vendor/requirejs/require.js'],
					// optimize: 'none',
					optimize: 'uglify2',
					wrap: true
				}
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, flatten: true, src: ['<%= config.app %>/index.html'], dest: '<%= config.www %>/', filter: 'isFile'},
					{expand: true, cwd: '<%= config.app %>/', src: ['img/**'], dest: '<%= config.www %>/'},
					{expand: true, cwd: '<%= config.app %>/', src: ['template/**'], dest: '<%= config.www %>/'},
					{expand: true, cwd: '<%= config.app %>/font-awesome/', src: ['fonts/*.woff'], dest: '<%= config.www %>/', filter: 'isFile'}
				]
			},
			js: {
				files: [
					{expand:true, cwd: '<%= config.app %>/', src: ['js/**'], dest: '<%= config.www %>/'},
				]
			},
			css: {
				files: [
					{expand:true, cwd: '<%= config.app %>/', src: ['css/**'], dest: '<%= config.www %>/'},
					{expand:true, cwd: '<%= config.app %>/', src: ['font-awesome/**'], dest: '<%= config.www %>'},
				]
			}
		},
		cssmin: {
			combine: {
				options: {
					keepSpecialComments: true
				},
				files: {
					'<%= config.www %>/css/style.min.css': [
						'<%= config.app %>/css/base.css',
						'<%= config.app %>/js/vendor/bootstrap/dist/css/bootstrap.min.css',
						'<%= config.app %>/css/landing.css',
						'<%= config.app %>/css/main.css',
						'<%= config.app %>/font-awesome/css/font-awesome.min.css'
					]
				}
			},
			minify: {
				options: {
					keepSpecialComments: 0
				},
				expand: true,
				cwd: '<%= config.www %>/css/',
				src: ['*.css'],
				dest: '<%= config.www %>/css/',
				ext: '.min.css'
			}
		},
		rev: {
			files: {
				src: [
					'<%= config.www %>/css/style.min.css',
					'<%= config.www %>/js/script.min.js'
				]
			}
		},
		usemin: {
			html: ['<%= config.www %>/index.html'],
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					removeCDATASectionsFromCDATA: true,
					collapseBooleanAttributes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true
					//removeAttributeQuotes: true,
					//collapseWhitespace: true,
					//removeOptionalTags: true,
					//removeEmptyElements: true
				},
				files: {
					'<%= config.www %>/index.html': '<%= config.www %>/index.html'
				}
			}
		},
		// jshint: {
		// 	files: ['Gruntfile.js', '<%= config.app %>/src/**/*.js'],
		// 	options: {
		// 		jshintrc: '.jshintrc',
		// 		reporter: require('jshint-stylish'),
		// 		// options here to override JSHint defaults
		// 		globals: {
		// 			jQuery: true,
		// 			console: true,
		// 			module: true,
		// 			document: true
		// 		}
		// 	}
		// },
		connect: {
			server: {
				options: {
					port: 3025,
					base: '<%= config.www %>',
					livereload: 3055
				}
			}
		},
		watch: {
			options: {
				livereload: {
					port: 3055
				},
				spawn: true
			},
			js: {
				files: ['<%= config.app %>/js/**/*.js'],
				tasks: ['clean:js', 'copy:js']
			},
			css: {
				files: ['<%= config.app %>/css/**/*.css'],
				tasks: ['clean:css', 'copy:css']
			},
			html: {
				files: ['<%= config.app %>/**/*.html'],
				tasks: ['dev']
			}
		}
	});

	grunt.registerTask('dev', ['clean:all', 'copy']);
	grunt.registerTask('build', ['clean:all', 'requirejs', 'copy:main', 'cssmin:combine', 'cssmin:minify', 'rev', 'usemin', 'htmlmin']);

	//	grunt.registerTask('build', ['requirejs', 'clean:dist', 'concat', 'uglify', 'cssmin:combine', 'uncss', 'cssmin:minify', 'rev', 'copy', 'useminPrepare', 'usemin', 'htmlmin']);
	grunt.registerTask('serve', function() {
		return grunt.task.run(['dev', 'connect', 'watch']);
	});
};