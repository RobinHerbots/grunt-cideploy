# grunt-cideploy

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cideploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cideploy');
```

## The "ci_deploy" task

### Overview
In your project's Gruntfile, add a section named `cideploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ci_deploy: {
        options: {
             before: function (grunt, options) { },
             msbuild: {},
             buildtasks: ["nugetrestore", "msbuild"],
             testtasks: ["eslint"],
             after: function (grunt, options) { },
             origin: "",
             notifyInSharePoint: false,
             removeTagAfterDeploy: false,
             username: grunt.option("username"),
             password: grunt.option("password"),
             Project_x0020_NameId: 1,
             Application_x0020_NameId: 12,
             Title: 'Title'
        }
  });
```

### Options
#### before
Default: function (grunt, options) { }

This is a callback which is called before the deployment task is run.  
In here you can stop the apppool on IIS for example.

```
   before: function (grunt, options) {
                        generateConfig();
                        grunt.task.run("StopWebAppPool");
                        grunt.config('msbuild.target.options.buildParameters.DeployOnBuild', true);

                        console.log(JSON.stringify(grunt.config("msbuild")));
                    },
```

#### msbuild
Default: null

This is the msbuild definition.  For more information see https://www.npmjs.com/package/grunt-msbuild

```
  msbuild: {
                        project: {
                            src: ['src/project/project.csproj'],
                            options: {
                                projectConfiguration: 'Release',
                                targets: ['Clean', 'Rebuild'],
                                buildParameters: {
                                    OutputPath: process.cwd() + sep + "build" + sep + "service",
                                    WarningLevel: 2,
                                    DeployOnBuild: grunt.option('deploy') || false,
                                    PublishProfile: grunt.option('profile') || "Staging",
                                    Password: grunt.option('password') || credentials.msbuild_deploy.password,
                                    PackageVersion: '<%= pkg.version %>',
                                    FileVersion: '<%= pkg.version %>',
                                    Version: '<%= pkg.version %>',
                                    AssemblyVersion: '<%= pkg.version %>'
                                },
                                verbosity: 'minimal'
                            }
                        }
            }
```

#### buildtasks
Default: []

Define the tasks to execute on build/deploy

```
buildtasks: ["clean", "nugetrestore", "msbuild"],
```


#### testtasks
Default: []

Define the tasks to execute on test

```
buildtasks: ["clean", "nugetrestore", "msbuild"],
```

#### after
Default: function (grunt, options) { }

This is a callback which is called before the deployment task is run.  
In here you can start the apppool on IIS for example.

```
  after: function (grunt, options) {
                        grunt.task.run("StartWebAppPool");
                    },
```

#### origin
Default: ""

This is the project remote git url.  
This is needed to allow the gitlabrunner to commit changes to gitlab.

```
 origin: "https://gitlab.com/project.git",
```

#### notifyInSharePoint
Default: false

Notify the publish in SharePoint.

#### removeTagAfterDeploy
Default: false

Delete the tag after deployment..

#### username
Default: grunt.option("username")

See https://www.npmjs.com/package/grunt-sharepoint-list
 
#### password
Default: grunt.option("password")

See https://www.npmjs.com/package/grunt-sharepoint-list

#### Project_x0020_NameId
Default: 1

See https://www.npmjs.com/package/grunt-sharepoint-list

#### Application_x0020_NameId
Default: 12

See https://www.npmjs.com/package/grunt-sharepoint-list

#### Title
Default: "Title"

See https://www.npmjs.com/package/grunt-sharepoint-list
