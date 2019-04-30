# grunt-cideploy

> Reynaers Deployment Task

## Getting Started
This plugin requires Grunt `~0.4.5`

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
             after: function (grunt, options) { },
             origin: "",
             username: grunt.option("username"),
             password: grunt.option("password"),
             Project_x0020_NameId: 1,
             Application_x0020_NameId: 12,
             Title: 'Title'
        }
  });
```
