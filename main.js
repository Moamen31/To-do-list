let taskInput = document.querySelector(".task-input input")
let submitTask = document.querySelector(".task-input button")
let taskBox = document.querySelector(".task-box")




//[8] get tasks from local storage or return an empty array
let arrayOfObjects = JSON.parse(window.localStorage.getItem("task")) || [];
addTaskToPage("all")




//add task to page
function addTaskToPage(filter) {
    if (arrayOfObjects.length === 0) {
        taskBox.innerHTML = `<p>You have no tasks yet.</p>`
    }
    else {
        taskBox.innerHTML = ""
        //remove the repeated task
        document.querySelectorAll(".task").forEach((el) => el.remove())

        //[7]
        arrayOfObjects.forEach((task, index) => {
            //if the task is completed we add class checked on the taskName
            //and checked on the checkbox
            let iscompleted = task.status === "completed" ? "checked" : ""

            //if btn id == task.status or btn id == all and on load too
            if (filter === task.status || filter === "all") {
                //create task li
                let taskLi = document.createElement("li")
                taskLi.className = "task"
                taskLi.innerHTML =
                    `<label for="${index}">
                <input onclick="updateStatus(this)" type="checkbox" id="${index}" ${iscompleted}>
                <p class="${iscompleted}">${task.title}</p>
                </label>
                <div class="settings">
                <i onclick="showSettingMenu(this)" class="fa-solid fa-ellipsis"></i>
                <ul class="task-menu">
                    <li onclick="editTask('${task.title}',${index})" class="edit"><i class="fa-solid fa-pen"></i>Edit</li>
                    <li onclick="deleteTask(${index})" class="delete"><i class="fa-solid fa-trash"></i>Delete</li>
                </ul>
                </div>`
                taskBox.appendChild(taskLi)
            }
        })
    }

}
//it's important to add this parameter whenever calling the function
addTaskToPage("all")



//[9] update task status 
function updateStatus(checkbox) {
    let taskName = checkbox.parentElement.lastElementChild
    if (checkbox.checked) {
        taskName.classList.add("checked")
        //get the task of specific index in array and it's status
        arrayOfObjects[checkbox.id].status = "completed"
    }
    else {
        taskName.classList.remove("checked")
        arrayOfObjects[checkbox.id].status = "pending"
    }
    //update the local storage
    window.localStorage.setItem("task", JSON.stringify(arrayOfObjects));
}


// [10] show task menu
function showSettingMenu(ellipsisIcon) {
    ellipsisIcon.parentElement.classList.add("show")
    //close the menu on click anywhere
    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "I") {
            ellipsisIcon.parentElement.classList.remove("show")
        }
    })
}

//[11] delete task
function deleteTask(deleteIndex) {
    //delete the task from array depending of the index
    arrayOfObjects.splice(deleteIndex, 1)
    //update the local storage
    window.localStorage.setItem("task", JSON.stringify(arrayOfObjects));
    addTaskToPage("all")
}


//[12] edit task
let isUpdated = false,
    updateIndex;

function editTask(title, index) {
    taskInput.value = title;
    updateIndex = index
    isUpdated = true;
}


//[13] filtering tasks
let filters = document.querySelector(".filters")
let filtersBtns = document.querySelectorAll(".filters li")

filtersBtns.forEach((btn) => {
    //active class
    btn.addEventListener("click", (e) => {
        filtersBtns.forEach((el) => {
            el.classList.remove("active")
        })
        btn.classList.add("active")
        addTaskToPage(btn.id)
    })
})


//[14] clear all tasks on click
let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    arrayOfObjects.splice(0, arrayOfObjects.length)
    //update local storage
    window.localStorage.setItem("task", JSON.stringify(arrayOfObjects));
    addTaskToPage("all")
})


//[1]
submitTask.addEventListener("click", () => {
    if (taskInput.value !== "") {

        // [2] make an object from the task
        let task = {
            title: taskInput.value,
            status: "pending",
        }

        if (!isUpdated) { //if ipdated is false
            // [3] push every task to the array
            arrayOfObjects.push(task)
        }
        else {
            arrayOfObjects[updateIndex] = task
            isUpdated = false;
        }

        // [4] save array in local storage
        window.localStorage.setItem("task", JSON.stringify(arrayOfObjects))

        //[5] empty input value
        taskInput.value = ""

        //[6]
        addTaskToPage("all")
    }

    else {
        alert("Please Add A Task")
    }
})