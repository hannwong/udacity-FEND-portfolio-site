/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    exec: {
      /**
        * Art direction handling of images. This only outputs medium and small
        *  versions of images.
        * The only large versions are the pixel density versions.
        * Udacity's index.html doesn't use '*_large.jpg' versions, though
        *  these files exist in their official solution's 'images' folder.
        *
        * Some images are resized proportionately, whereas others are cropped
        *  with art direction. Some are a combination of both.
        * As such, it is too complicated to handle using grunt task
        *  responsive_images. Moreover, `gm' is easy enough to use.
        * In any case, grunt-responsive-images is buggy, doesn't crop.
        *   See my patch at:
        *   https://github.com/andismith/grunt-responsive-images/pull/124
        */
      art_direct: {
        cmd: function() {
          var command = 'gm convert ';
          var resize_medium = '-resize 1000x750 ';
          var resize_small = '-resize 500x375 ';

          var commands = [];

          // horses.jpg is cropped with art direction.
          commands.push(command +
            '-crop 1500x460+0+180 ' +
            '-resize 1140x350 ' +
            'images_src/horses.jpg images/horses_large.jpg');
          commands.push(command +
            '-crop 1000x307+317+295 ' +
            '-resize 800x246 ' +
            'images_src/horses.jpg images/horses_medium.jpg');
          commands.push(command +
            '-crop 633x194+475+326 ' +
            '-resize 500x154 ' +
            'images_src/horses.jpg images/horses_small.jpg');

          // volt.jpg.
          commands.push(command +
            '-crop 3057x1698+207+250 ' +
            '-resize 360x200 ' +
            'images_src/volt.jpg images/volt.jpg');

          // still_life.jpg.
          commands.push(command +
            '-crop 2000x1110+0+340 ' +
            '-resize 360x200 ' +
            'images_src/still_life.jpg images/still_life.jpg');

          // dog.jpg.
          commands.push(command +
            '-crop 2047x1137+0+90 ' +
            '-resize 360x200 ' +
            'images_src/dog.jpg images/dog.jpg');

          return commands.join(' && ');
        }
      }
    },

    imageoptim: {
      dev: {
        options: {
          jpegMini: false,
          imageAlpha: false,
          quitAfter: true
        },
        src: ['images']
      }
    },

    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images']
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('art-direct', ['exec:art_direct']);
  grunt.registerTask('default',
    ['clean', 'mkdir', 'art-direct']);
  grunt.registerTask('optim-img', ['imageoptim']);
};
