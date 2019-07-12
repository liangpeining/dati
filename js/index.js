'use strict';
// 定义一个全局变量，用于存储拿到的题目
var questions = [];
// 定义当前获取到的题目
var current_question = null;
// 定义题目的序号
var question_num = 1;
// 定义分数
var scores = 0;
// 定义一个标识符，用于识别这道题是否被答过，答了就不可以就修改选项的样式
var isChoose = false;
// 定义一个计时器
var time = 7;


// 设置一个时间间隔函数
// 用于操作页面没活动，自动跳到下一题

var fn = function() {
    
    time--;
    $('.time').html(time);
    if (time==0) {
        time = 7;
        question_num++;
        randomRender(question_num);
        if(question_num==10){
            again();
        }
    }
}
var setT = setInterval(fn,1000);


// 第二个页面渲染
// 1.得到题目和答案并且填充到页面
$.get("dati.json",function (res) {
    console.log(res);
    questions = res;
})

// 2.渲染
// 把拿到的题目数组随机抽取出来
function randomRender(question_num) {
    //数组的长度乘以随机数random，得到的就是随机的数组下标indexrandom
    var indexrandom =parseInt((Math.random()*questions.length)); 
    // console.log(questions[indexrandom].quiz);
    // questions[indexrandom]里面的quiz数组就是题目
    // 获取的同时，将它从数组中删除，免除下一次还会随机抽取到
    current_question = questions.splice(indexrandom,1)[0];
    console.log(current_question);
    // 将题目放到h1中
    $('.question').html(`${question_num}.${current_question.quiz}`);
    // 清空不然上一题的答案会留到下一题
    $('.answer_options').html("");
    // 将选项填充出来
    current_question.options.forEach(function (item,index) {
        // String.fromCharCode() 数字转字母
        $('.answer_options').append(`<div data-index = "${index}">${String.fromCharCode(index+65)}. ${item}</div>`);
    });
}


// 开始答题的点击事件
$('.start_btn').click(function () { 
    $('.gamediv').addClass("change");
    $('.startdiv').removeClass("change");
    randomRender(question_num);
});

//点击选项的事件
$('.answer_options').click(function (e) {
    // 重置定时器
    time = 7;
    // console.log(e);
    // 判断是否答过了
    if (!isChoose) {
        // 获取索引值
        // console.log(typeof click_index);
        var click_index = e.target.dataset.index;//返回string类型的索引值
        //转为int类型
        click_index = parseInt(e.target.dataset.index); 
        // 判断是否正确
        if(current_question.answer == (click_index+1)){
            // 正确的话，加10分
            scores +=10;
            console.log(scores);
            // 将正确的子项样式修改
            $('[data-index='+ click_index +']').addClass("correct");
        }else{
            $('[data-index='+ (current_question.answer-1) +']').addClass("correct");
            $('[data-index='+ click_index +']').addClass("wrong");
        }
        isChoose = true; 
        // 设置一个延迟函数
        // 用于延迟两秒后，进入下一题
        setTimeout(function() {
            // 当question_num=10，就表示答完10题，进入第三个界面
            if (question_num==10) {   
                // 调用弹框的函数 
                again(scores);
            }
            else{
                isChoose = false;
                question_num++;
                randomRender(question_num);
            }
        },2000);
    }
});


//封装第三个界面填充为方法
var again = function (scores) {
    if (scores<=40) {
        var pic = 2;
    }else if(scores>40 && scores <=70){
        var pic = 1;
    }else{
        var pic = cong;
    }
    $('.gamediv').removeClass('change');
    $('.gameover').addClass('change');
    $('.lastdiv').append(`
        <div class="alertContain">
            <div class ="alert">
                <img src="img/${pic}.gif"/>
                <h1>您的分数为${scores}分</h1>
                <button class="again_btn">重新答题</button> 
            </div>
        </div>
    `);  

    //重新答题事件
    $('.again_btn').click(function() {
        console.log('aaa');
        location.reload();
    });
}





