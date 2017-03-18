var gulpConfig = {
    /**
     * File paths
     */
    path : {
        scss : {
            src : './src/scss/main.scss',
            dest: './dist/css'
        },
        googleFonts : {
            src : './src/fonts/fonts.list',
            dest: './dist',
            rm  : './dist/fonts'
        },
        webpack : {
            polyfills : './src/ts/polyfills.ts',
            vendor : './src/ts/vendor.ts',
            boot : './src/ts/app/app.ts',
            dest: './dist/scripts'
        },
        image : {
            src : './src/images/*.{gif,jpg,png,svg}',
            dest: './dist/images',
            rm  : './dist/images/*.{gif,jpg,png,svg}'
        },
        webserver : {
            root: 'dist'
        },
        watch : {
            view   : 'src/view/*',
            webpack: 'src/ts/**/*.{ts,html}',
            scss   : 'src/scss/**/*.scss',
            images : 'src/images/**/*.{gif,jpg,png,svg}'
        }
    },
    /**
     * Output filenames
     */
    fileName : {
        scss : {
            prefix: '',
            basename : 'app',
            suffix: '.min'
        },
        vendor : {
            prefix: '',
            basename : 'vendor',
            suffix: '.min'
        },
        webpack : {
            prefix: '',
            basename : 'app',
            suffix: '.min'
        }
    },
    googleFontsConfig : {
        fontsDir: './fonts',
        cssDir: '../src/scss/base',
        cssFilename: '_fonts.scss'
    }
};

module.exports = gulpConfig;
