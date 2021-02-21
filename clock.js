


const clockContainer = document.querySelector(".js-clock");
const clockTitle = clockContainer.querySelector("h1");
const SENTENCES = ["Keep going","Good luck","Don't panic","Move Move!"]
const sentence = document.querySelector(".sentence")

function getTime(){
    const date= new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    clockTitle.innerText=`${hours<10 ? `0${hours}`:hours}:${minutes<10 ? `0${minutes}`:minutes}:${seconds<10 ? `0${seconds}`:seconds}`

    printSentence();
}

function printSentence(){
    const date= new Date();
    const minutes = date.getMinutes();
    if (minutes<=15){
        number=0
    }else if(minutes<=30&&minutes>15){
        number=1
    }else if (minutes<=45&&minutes>30){
        number=2
    } else{
        number=3
    }
    sentence.innerText = SENTENCES[number]

}
function init(){
    getTime();
    setInterval(getTime,1000)


}

init();