/*
 * grunt-cideploy
 * 
 *
 * Copyright (c) 2019 Robin Herbots
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		bump: {
			options: {
				files: ["package.json"],
				commitFiles: ["-a"],
				updateConfigs: ["pkg"],
				commit: false,
				createTag: false,
				push: false,
				pushTo: "origin"
			}
		},
		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ["tmp"]
		},
		eslint: {
			target: ["tasks/**/*.js"]
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks("tasks");
	require("load-grunt-tasks")(grunt);

	// By default, lint and run all tests.
	grunt.registerTask("default", ["eslint"]);

};
