/**
 * Created by Administrator on 2016/8/2 0002.
 */


    $(function() {
        //轮播自动播放
        $("#myCarouse").carousel({
            interval: 4000,
        });
    });

    //文字 居中
    $(window).load(function(){
        $(".text").eq(0).css("margin-top", ( $(".auto").eq(0).height() - $(".text").eq(0).height() )/2 + 'px');
         $(".text").eq(1).css("margin-top", ( $(".auto").eq(1).height() - $(".text").eq(1).height() )/2 + 'px');
    });

    $(window).resize(function(){
        $(".text").eq(0).css("margin-top", ( $(".auto").eq(0).height() - $(".text").eq(0).height() )/2 + 'px');
    });

    $(window).resize(function(){
        $(".text").eq(1).css("margin-top", ( $(".auto").eq(1).height() - $(".text").eq(1).height() )/2 + 'px');
    });

