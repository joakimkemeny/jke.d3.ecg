/* global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({

		// Configure the compass task to compile the sass files.
		compass: {
			// TODO: Configure source maps.
			compile: {
				options: {
					cssDir: 'dist',
					outputStyle: 'compressed',
					sassDir: 'src/scss'
				}
			}
		},

		// Configure the connect task to start a web server for the demo.
		connect: {
			demo: {
				options: {
					base: 'demo',
					livereload: true,
					port: 3000
				}
			}
		},

		// Configure the copy task to copy all libs from bower_components.
		copy: {
			'demo-jquery': {
				src: 'bower_components/jquery/jquery.min.js',
				dest: 'demo/js/lib/jquery.min.js'
			},
			'demo-jquery-ui': {
				src: 'bower_components/jquery-ui/ui/minified/jquery.ui.widget.min.js',
				dest: 'demo/js/lib/jquery-ui-widget.min.js'
			},
			'demo-d3': {
				src: 'bower_components/d3/d3.min.js',
				dest: 'demo/js/lib/d3.min.js'
			},
			'demo-js': {
				src: 'dist/jke-d3-ecg.min.js',
				dest: 'demo/js/jke-d3-ecg.min.js'
			},
			'demo-css': {
				src: 'dist/jke-d3-ecg.css',
				dest: 'demo/css/jke-d3-ecg.css'
			}
		},

		// Configure the gh-pages to publish the demo directory to GitHub pages.
		'gh-pages': {
			options: {
				base: 'demo'
			},
			src: ['**']
		},

		// Configure the jshint task to check the syntax of all JavaScript files.
		jshint: {
			all: {
				options: {
					jshintrc: '.jshintrc',
					force: true
				},
				src: ['Gruntfile.js', 'src/js/**/*.js']
			}
		},

		// Configure the uglify task to concatenate and optimize all JavaScript files.
		uglify: {
			// TODO: Configure source maps.
			dist: {
				src: 'src/js/**/*.js',
				dest: 'dist/jke-d3-ecg.min.js'
			}
		},

		// Configure the watch task to listen to changes to relevant files and run the correct tasks.
		watch: {
			options: {
				livereload: true
			},
			compass: {
				files: ['Gruntfile.js', 'src/scss/**/*.scss'],
				tasks: ['compass']
			},
			copy: {
				files: ['Gruntfile.js', 'src/**'],
				tasks: ['copy']
			},
			jshint: {
				files: ['Gruntfile.js', 'src/js/**/*.js'],
				tasks: ['jshint']
			},
			uglify: {
				files: ['Gruntfile.js', 'src/js/**/*.js'],
				tasks: ['uglify']
			}
		}
	});

	// Dependencies
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-gh-pages');

	// Aliases
	grunt.registerTask('build', ['jshint', 'compass', 'uglify', 'copy']);
	grunt.registerTask('default', ['build', 'connect', 'watch']);
};
