const inputField = document.getElementById("input-field");
const todoContainer = document.getElementById("container");
let NumOfTasks = 0;
function removeTask(e){
        let trashCan = e.target;
        let currentTask = trashCan.closest(".item");
        let previousTask = currentTask.previousElementSibling;
        NumOfTasks--;
        if(NumOfTasks <= 0){
            todoContainer.classList.remove("to-do-container-fill");
        }
        if(currentTask.classList.contains("last-item") && previousTask && previousTask.tagName !== "INPUT") {
            previousTask.classList.add("last-item");
        }
        //if you removed and element, its eventlistener is removed automatically
        currentTask.remove();
}
function addTask(event) {
    if(event.key !== "Enter") return;
    if(inputField.value === "") return;
    if(NumOfTasks > 0) {
        todoContainer.lastElementChild.classList.remove("last-item");
    }
    let task = document.createElement("div");
    let taskText = document.createElement("span");
    let IconContainer = document.createElement("div");
    taskText.textContent = inputField.value;
    IconContainer.innerHTML = `<i class="fa-solid fa-square-check"></i> <i class="fa-solid fa-trash"></i>`;
    task.classList.add("item");
    task.classList.add("last-item");
    task.append(taskText,IconContainer);
    IconContainer.classList.add("IconContainer")
    todoContainer.append(task);
    NumOfTasks++;
    if(NumOfTasks == 1) {
        todoContainer.classList.add("to-do-container-fill");
    };
    let checkbox = task.querySelector(".fa-square-check");
    checkbox.addEventListener("click",(e) => {
        taskText.classList.toggle("task-completed");
    })
    let trashCan = task.querySelector(".fa-trash");
    trashCan.addEventListener("click",removeTask);
    inputField.value = "";

}
inputField.addEventListener("keydown",addTask)