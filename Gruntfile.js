'use strict';

module.exports = function (grunt){

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        uglify: {
            pack: {
                files: {
                    './dist/animateEasy.min.js':[
                        './src/animateEasy.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', ['uglify']);
};