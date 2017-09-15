/**
 * Created by shuaizhang on 2017/7/19.
 */
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),
    browserSync = require('browser-sync'),// 自动同步浏览器插件
    eslint = require('gulp-eslint'),
    minify = require('gulp-minify-css'),//css压缩
    concat = require('gulp-concat'),//文件合并
    uglify = require('gulp-uglify'),//js压缩
    rename = require('gulp-rename'),//文件重命名
    imagemin = require('gulp-imagemin'),//压缩图片
    clean = require('gulp-clean'),//清空文件夹
    rev = require('gulp-rev'),//更改版本号
    autoprefixer = require('gulp-autoprefixer'),// 给css3属性添加浏览器前缀插件
    revCollector = require('gulp-rev-collector'),//gulp-rev插件，用于html模板更改引用路径;
    cache = require('gulp-cache'),// 缓存插件，可以加快编译速度
    prefix = require('gulp-prefix'),//替换cdn路径
    replace = require('gulp-replace'),//替换
    htmlmin = require('gulp-htmlmin'),//压缩html
    runSequence = require('gulp-sequence'),
    ftp = require('gulp-ftp');


var item='userauth';

gulp.task('default',['minifyCss','minifyJs','productionCss','minifyImg']);
gulp.task('detail',function (cb) {
    runSequence('cleante',['detailCss','detailJs','detailImg'],'moveDetail')(cb)
});

//3.压缩css
gulp.task('detailCss', function(){
    gulp.src('src/css/*.css')
        .pipe(rev())
        .pipe(minify())
        .pipe(replace('../img/','http://img.daodaoclub.com/app/'+item+'/img/'))
        .pipe(gulp.dest(item+'/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});
gulp.task('detailJs', function(){
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(item+'/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
gulp.task('detailImg', function(){
    gulp.src('src/img/*')
        .pipe(gulp.dest(item+'/img'))
});

gulp.task('moveDetail', function () {
    gulp.src(['rev/**/*.json','src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(item+'/'));
});
gulp.task('detailFtp', function () {
    return gulp.src(item+"/*")
        .pipe(ftp({
            host: '59.110.51.230',
            port: '22',
            user: 'zhangshuai',
            pass:'z123456789*',
            remotePath: "/home/zhangshuai/m/app/"+item
        }));
});


//编译less
gulp.task('testLess', function () {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

// 自动更新浏览器任务
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});
//压缩js
gulp.task('minifyJs', function(){
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(item+'/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

//压缩图片
gulp.task('minifyImg', function(){
    gulp.src('src/img/*')
        .pipe(gulp.dest(item+'/img'))
    gulp.src('src/join/img/*')
        .pipe(gulp.dest(item+'/join/img'))
});


//3.压缩css
gulp.task('minifyCss', function(){
    gulp.src('src/css/*.css')
        .pipe(rev())
        .pipe(minify())
        // .pipe(replace('../img/','http://img.daodaoclub.com/app/'+item+'/img/'))
        .pipe(gulp.dest(item+'/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
    gulp.src('src/join/*.css')
        .pipe(rev())
        .pipe(minify())
        .pipe(replace('img/','http://img.daodaoclub.com/app/star/join/img/'))
        .pipe(gulp.dest(item+'/join/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/join'));
});

//移动产品的css
gulp.task('productionCss', function(){
    return gulp.src('src/production/*.css')
    // .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(minify())
        .pipe(gulp.dest(item+'/production/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/production/css'));
});



gulp.task('prefix', function(){
    var prefixUrl = "http://img.daodaoclub.com/app/"+item+"/";
});

//压缩html
gulp.task('testHtmlmin', function () {
    var prefixUrl = "http://img.daodaoclub.com/app/"+item+"/";
    gulp.src(['rev/**/*.json','src/*.html'])
        .pipe(revCollector())
        .pipe(prefix(prefixUrl, null, '{{'))
        .pipe(gulp.dest(item+'/'));
    gulp.src(['rev/**/*.json','src/production/**/*.html'])
        .pipe(revCollector())
        .pipe(replace('../../', ''))
        .pipe(prefix(prefixUrl, null, '{{'))
        .pipe(gulp.dest(item+'/production/'));
    gulp.src(['rev/**/*.json','src/join/*.html'])
        .pipe(revCollector())
        .pipe(replace('../', ''))
        .pipe(prefix(prefixUrl, null, '{{'))
        .pipe(gulp.dest(item+'/join/'));
});

gulp.task('moveHtml', function () {
    gulp.src(['rev/**/*.json','src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(item+'/'));
    gulp.src(['rev/**/*.json','src/production/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(item+'/production/'));
});

// 删除build目录
gulp.task('cleante', function () {
    return gulp.src([item, 'rev'],{read: false})
        .pipe(clean());
});



// 清除缓存
gulp.task('cache:clear', function (cb) {
    return cache.clearAll(cb)
});




//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
// gulp.dest(path[, options]) 处理完后文件生成路径