const pendingList = document.getElementById("js-pending"),
finishedList = document.getElementById("js-finished"),
toDoForm = document.getElementById("js-toDoForm"),
toDoInput = document.getElementById("js-toDoInput");

const PENDING = "PENDING";
const FINISHED = "FINISHED";

let pendingTasks, finishedTasks;

function getTaskObject(text){
    return{
        id:String(Date.now()),//현재 시각으로 계속 변하는 id를 생성.
        text
    }
}

function savePendingTask(task){
    pendingTasks.push(task);//pendingTask는 array이므로 push 메서드를 붙인다. 이는 task를 끝에 붙이는것.
}
//이 함수의 용도는, task를 pendingTasks 의 array안에 넣는 것이다.
function findInFinished(taskId){
    return finishedTasks.find(function(task){//find 메서드. return은 그 자리에서 함수값을 호출하고 싶을 때 쓰는 것임.

        return task.id===taskId;
    });
}//이 함수의 용도는 , task의 id값을 호출하고,  그 id값을 finishedTasks 의 array안에서 찾는 것.(true of false?)

function findInPending(taskId){
    return pendingTasks.find(function (task){
        return task.id===taskId;
    });
}//task의 id값이 pendingTask안에 있는지 확인.

function removeFromPending(taskId){
    pendingTasks=pendingTasks.filter(function(task){//let으로 변수취급하였으므로 가능.
        return task.id!== taskId;//엄격한 비교

    });
}
//pendingTasks에서  id값이 없는 task를 삭제

function removeFromFinished(taskId){
    finishedTasks=finishedTasks.filter(function(task){//let으로 변수취급하였으므로 가능.
        return task.id!== taskId;

    });
}
//finishedTasks에서 id값이 없는 task를 삭제.

function addToFinished(task){
    finishedTasks.push(task);
}

function addToPending(task){
    pendingTasks.push(task);
}

function deleteTask(event){
    const li = event.target.parentNode;
    li.parentNode.removeChild(li);//pending ul에서 li삭제
    removeFromPending(li.id); //pending 에서 task 삭제 (array안에서 )
    removeFromFinished(li.id);//finished 에서 task 삭제 
//삭제는 ul목록에서 삭제하는 동일한 작업이므로 하나의 함수로 표현.
    saveState();

}

function handleFinishClick(event){
    const li = event.target.parentNode;
    li.parentNode.removeChild(li); //pending ul에서 li삭제
    const task=findInPending(li.id); //task를 pending list에서 찾음.
    removeFromPending(li.id);//pending array안에서 task 삭제
    addToFinished(task);//finished에 task 추가
    paintFinishedTask(task); //finish 목룍에 나타냄.
    saveState();
    }

function handleBackClick(event){ //리스트의 위치와 task array의 편집, 목록에서의 나타냄 설정.
    const li = event.target.parentNode;
    li.parentNode.removeChild(li);
    const task=findInFinished(li.id);
    removeFromFinished(li.id);
    addToPending(task);
    paintPendingTask(task);
    saveState();
}

function buildGenericLi(task){
    const li = document.createElement("li");
    const span = document.createElement("span");
    const deletBtn = document.createElement("button");
    span.innerText = task.text;
    deletBtn.innerText = "❌";
    deletBtn.addEventListener("click",deleteTask)
    li.append(span,deletBtn);
    li.id=task.id; //text합성과 동시에 id도 합성. 다른 id에 같은 value 중복 방지?
    return li; //왜?
}

function paintPendingTask(task){ //genericLi에 체크버튼만들고, pendingList에 전체적인 li의 모습 넣기.
    const genericLi = buildGenericLi(task);
    const completeBtn =document.createElement("button");
    completeBtn.innerText = "✅";
    completeBtn.addEventListener("click", handleFinishClick);
    genericLi.append(completeBtn);//체크버튼 붙이고
    pendingList.append(genericLi);//pendingList에 전체적인 li 모습 넣음
    

}

function paintFinishedTask(task){

    const genericLi = buildGenericLi(task);
    const backBtn = document.createElement("button");
    backBtn.innerText = "⏪";
    backBtn.addEventListener("click",handleBackClick);
    genericLi.append(backBtn);
    finishedList.append(genericLi);

}

function saveState(){
    localStorage.setItem(PENDING, JSON.stringify(pendingTasks));
    localStorage.setItem(FINISHED, JSON.stringify(finishedTasks));
}
//setItem은 string형식[{id:354,text:sdfsaf},{},{}], getItem은 parse형식으로. 0:object
                                                                            //1:object
function loadState(){
    pendingTasks = JSON.parse(localStorage.getItem(PENDING)) || [] ; //앞의 값이 false면 뒤의 값으로 나타낸다.해보니까 ||삭제해도 됨.
    finishedTasks = JSON.parse(localStorage.getItem(FINISHED)) || [];
}

function restoreState(){
    pendingTasks.forEach(function (task){paintPendingTask(task)});//pendingTasks array의 각각의 object를 함수 paintPendingTask에 넣어준다. 이때 task는 buildGenericLs에 input했던 value가 될 것이다.
    finishedTasks.forEach(function(task){paintFinishedTask(task)});

}



function handleFormSubmit (event) {
    event.preventDefault();
    const taskObj = getTaskObject(toDoInput.value);//
    toDoInput.value = "";//왜 ""일까=>submit하고나서 빈칸으로 남기기.
    paintPendingTask(taskObj); //pending만들고나서,
    savePendingTask(taskObj);  //pending task목록에 보낼것.
    saveState(); //현재상태 저장.(입력된 pending 말고, 버튼으로 편집된 것들도 저장하는함수.)//해보니까 삭제해도 가능.
}

function init(){
    toDoForm.addEventListener("submit",handleFormSubmit);
    loadState();
    restoreState();

};

init();