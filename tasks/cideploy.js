/*
 * grunt-cideploy
 * 
 *
 * Copyright (c) 2019 Robin Herbots
 * Licensed under the MIT license.
 */

"use strict";


var _ = require("lodash");

function spawnTasks(grunt) {
	if (grunt.config.data.ci_deploy && grunt.config.data.ci_deploy.options.buildtasks !== null) {
		grunt.registerTask("ci_build", "Gitlab ci build", function () {
			grunt.task.run(grunt.config.data.ci_deploy.options.buildtasks);
		});
	}

	if (grunt.config.data.ci_deploy && grunt.config.data.ci_deploy.options.testtasks !== null) {
		grunt.registerTask("ci_test", "Gitlab ci test", function () {
			grunt.task.run(grunt.config.data.ci_deploy.options.testtasks);
		});
	}
}

function reconfigureSpawnTasks(grunt) {
	if (grunt.config.data.ci_deploy && grunt.config.data.ci_deploy.options.msbuild !== null) {
		_.merge(grunt.config.data, {
			msbuild: grunt.config.data.ci_deploy.options.msbuild
		});
	}
}

module.exports = function (grunt) {
	reconfigureSpawnTasks(grunt);
	spawnTasks(grunt);

	grunt.registerTask("ci_deploy", "Gitlab ci deploy", function () {
		var options = this.options({
			before: function (grunt, options) {
			},
			msbuild: null,
			buildtasks: [],
			testtasks: [],
			after: function (grunt, options) {
			},
			origin: "",
			notifyInSharePoint: false,
			username: grunt.option("username"),
			password: grunt.option("password"),
			Project_x0020_NameId: 1,
			Application_x0020_NameId: 12,
			Title: "Title"
		});

		_.merge(grunt.config.data, {
			pkg: grunt.file.readJSON("package.json")
		});

		function startDeploy(tag) {
			_.merge(grunt.config.data, {
				gitcheckout: {
					priv: {
						options: {
							branch: "tags/" + tag,
							// create: true,
							overwrite: true,
							force: true
						}
					}
				}
			});
			grunt.task.run("gitcheckout:priv");

			grunt.option("profile", tag.indexOf("Production") !== -1 ? "Production" : "Staging");
			grunt.option("totag", tag);

			options.before(grunt, options);
			reconfigureSpawnTasks(grunt);
			grunt.task.run(options.buildtasks);

			options.after(grunt, options);

			_.merge(grunt.config.data, {
				gitcheckout: {
					privMaster: {
						options: {
							branch: "master",
							force: true
						}
					}
				}
			});
			grunt.task.run("gitcheckout:privMaster");

			if (grunt.option("profile") === "Staging") {
				_.merge(grunt.config.data, {
					gitremote: {
						priv: {
							options: {
								seturl: {
									name: "origin",
									url: options.origin
								}
							}
						}
					}
				});

				grunt.task.run("gitremote:priv");

				_.merge(grunt.config.data, {
					gitpush: {
						priv: {
							options: {
								branch: ":" + tag
							}
						}
					}
				});
				grunt.task.run("gitpush:priv");

				_.merge(grunt.config.data, {
					gittag: {
						priv: {
							options: {
								tag: tag,
								remove: true
							}
						}
					}
				});
				grunt.task.run("gittag:priv");
			}
			if (options.notifyInSharePoint) {
				grunt.registerTask("PSP", "Publish release info on sharepoint", function () {
					function generateReleaseInfo() {
						var prefix = ">> ",
							strBuild = [], logs = grunt.config("gitlog.privReleaseInfo.result");
						for (var lg in logs) {
							if (logs[lg].subject.indexOf(prefix) === 0) {
								strBuild.push(logs[lg].subject.substring(prefix.length));
							}
						}

						return strBuild.join("<br/>");
					}

					if (!grunt.option("totag")) {
						_.merge(grunt.config.data, {
							gitdescribe: {
								privLatest: {
									options: {
										abbrev: 0,
										callback: function (result) {
											// eslint-disable-next-line no-console
											console.log(result);
											grunt.option("totag", result);
										}
									}
								}
							}
						});

						grunt.task.run("gitdescribe:privLatest");
					}

					if (!grunt.option("fromtag")) {
						_.merge(grunt.config.data, {
							gitdescribe: {
								privPrevious: {
									options: {
										abbrev: 0,
										"commit-ish": grunt.option("totag") + "^",
										callback: function (result) {
											// eslint-disable-next-line no-console
											console.log(result);
											grunt.option("fromtag", result);
										}
									}
								}
							}
						});

						grunt.task.run("gitdescribe:privPrevious");
					}

					grunt.registerTask("PSP_spawn", function () {
						_.merge(grunt.config.data, {
							gitcheckout: {
								priv: {
									options: {
										branch: "tags/" + grunt.option("totag"),
										// create: true,
										overwrite: true,
										force: true
									}
								}
							}
						});
						grunt.task.run("gitcheckout:priv");
						_.merge(grunt.config.data, {
							gitlog: {
								privReleaseInfo: {
									options: {
										prop: "gitlog.privReleaseInfo.result",
										from: grunt.option("fromtag"),
										to: grunt.option("totag"),
										// pretty: "%cn - %s",
										number: 25,
										callback: function () {
											_.merge(grunt.config.data, {
												sharepoint_list: {
													priv: {
														options: {
															username: options.username,
															password: options.password,
															ntlm_domain: "reynaers",
															list: "ApplicationReleaseInfo",
															base: "https://together.reynaers.com/depict",
															listitem: {
																__metadata: {
																	type: "SP.Data.ApplicationReleaseInfoListItem"
																},
																Project_x0020_NameId: options.Project_x0020_NameId,
																Application_x0020_NameId: options.Application_x0020_NameId,
																Title: options.Title,
																Release_x0020_Date: grunt.option("date") || grunt.template.today("yyyy/mm/dd"),
																VersionNumber: "<%= pkg.version %>",
																ReleaseNotes: generateReleaseInfo()
															}
														}
													}
												}
											});

											// eslint-disable-next-line no-console
											console.log(JSON.stringify(grunt.config("sharepoint_list")));
											grunt.task.run("sharepoint_list");

											_.merge(grunt.config.data, {
												gitcheckout: {
													privMaster: {
														options: {
															branch: "master",
															force: true
														}
													}
												}
											});
											grunt.task.run("gitcheckout:privMaster");
										}
									}
								}
							}
						});

						grunt.task.run(["gitlog:privReleaseInfo"]);
					});

					grunt.task.run("PSP_spawn");
				});
				grunt.task.run("PSP");
			}
		}

		//determine tag
		var tag = grunt.option("tag");
		if (!tag) {

			_.merge(grunt.config.data, {
				gitreset: {
					priv: {
						options: {
							mode: "hard"
						}
					}
				},
				gitdescribe: {
					priv: {
						options: {
							abbrev: 0,
							callback: function (result) {
								// eslint-disable-next-line no-console
								console.log("Latest tag: " + result);
								grunt.task.run("gitreset:priv");
								startDeploy(result);
							}
						}
					}
				}
			});

			grunt.task.run("gitdescribe:priv");
		} else {
			startDeploy(tag);
		}


	});


};
