var navSwiper = new Swiper('#swiper-nav',{
    loop:true,
    loopAdditionalSlides : 2,
    watchSlidesProgress : true,
    watchSlidesVisibility : true,
    slidesPerView : 1,
    spaceBetween : 16,//间距
    onlyExternal:true,//禁止导航条整体拖动
    onTap: function() {
        if(navSwiper&&navSwiper.clickedIndex<3){
            navSwiper.clickedIndex+=5;
        }
        conSwiper.slideTo(navSwiper.clickedIndex)
    }
})
var conSwiper = new Swiper('#swiper-con',{
    loop:true,
    loopAdditionalSlides : 2,
    effect : 'cube',
    cube: {

        shadow: false,

    },

    onTransitionStart:function () {
        if(conSwiper&&conSwiper.activeIndex>=8){
            conSwiper.activeIndex=conSwiper.activeIndex-5;
        }
    },
    onSlideChangeStart: function(){

        updateNavPosition(navSwiper.activeIndex)
    }

})
function updateNavPosition(){
    if(!conSwiper){
        return
    }
    var num = conSwiper.activeIndex;
    if(num===undefined) {
        return
    }
    if(num==8){
        num=num-5;
        conSwiper.slideTo(num)
    }

    $('#swiper-nav .active-nav').removeClass('active-nav')
    var activeNav = $('#swiper-nav .swiper-slide').eq(num).addClass('active-nav');
    if (!activeNav.hasClass('swiper-slide-visible')) {

        if (activeNav.index()>navSwiper.activeIndex) {
            var thumbsPerNav = Math.floor(navSwiper.width/activeNav.width())-1
            navSwiper.slideTo(activeNav.index()-thumbsPerNav)
        } else {
            navSwiper.slideTo(activeNav.index())
        }
    }
}
