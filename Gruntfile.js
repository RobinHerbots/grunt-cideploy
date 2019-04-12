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
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        ci_deploy: {
            default_options: {
                options: {
                    msbuild: {
                        RIMService: {
                            src: ['src/RIM.Service/RIM.Service.csproj'],
                            options: {
                                projectConfiguration: 'Release',
                                targets: ['Clean', 'Rebuild'],
                                buildParameters: {
                                    OutputPath: process.cwd() + sep + "build" + sep + "service",
                                    WarningLevel: 2,
                                    DeployOnBuild: grunt.option('deploy') || false,
                                    PublishProfile: grunt.option('profile') || "Staging",
                                    Password: grunt.option('password'),
                                    PackageVersion: '<%= pkg.version %>',
                                    FileVersion: '<%= pkg.version %>',
                                    Version: '<%= pkg.version %>',
                                    AssemblyVersion: '<%= pkg.version %>'
                                },
                                verbosity: 'minimal'
                            }
                        }
                    }
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    require('load-grunt-tasks')(grunt);

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'cideploy', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
