/*
 * grunt-cideploy
 * 
 *
 * Copyright (c) 2019 Robin Herbots
 * Licensed under the MIT license.
 */

'use strict';
var sep = require('path').sep;

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    require('load-grunt-tasks')(grunt);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint']);

};
