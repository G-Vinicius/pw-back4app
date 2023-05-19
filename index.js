const lista = document.getElementById("lista");
const newTask = document.getElementById("newTask");
const addButton = document.getElementById("btn-add")

const taksUrl = 'https://parseapi.back4app.com/classes/Task';
const headers = {
    "X-Parse-Application-Id": "PJ2dzwSlqserJFaWDeiEToaQw955QzMrceKiwugZ",
    "X-Parse-REST-API-Key": "NaBTCeLTnrmEeAAdvhX6C4bzksjuAHS1MHLrGvIa"
};


const renderizaLista = (lista, tarefas) => {
  lista.innerHTML = "";
  tarefas.forEach((tarefa) => {
    const itemText = document.createTextNode(
      `${tarefa.description} (${tarefa.done})`
    );
    const listItem = document.createElement("li");
    listItem.classList.add("list-itens")

    //delete item button
    const button = document.createElement("button");
    button.innerHTML = "Excluir";
    button.onclick = () => {
        if (confirm("Você realmente deseja excluir essa tarefa?") === true){
            deleteTask(tarefa.objectId)
        }
    };
   
    //update item status checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.onchange = () => editTask(tarefa);

    const jumpLine = document.createElement("br")

    if (tarefa.done === true) {
      checkBox.checked = true;
      listItem.style.textDecoration = "line-through";
    }

    listItem.appendChild(checkBox);
    listItem.appendChild(itemText);
    listItem.appendChild(jumpLine);
    listItem.appendChild(button);
    
    lista.appendChild(listItem);
  });
};

const getTasks = () => {
  fetch(taksUrl, {headers})
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      renderizaLista(lista, data.results);
    });
};

const handleBtnAdd = () => {
    //creates a new task
    const description = newTask.value;
    if (!description) {
        alert("É necessário inserir uma nova tarefa")
        return;
    }

    fetch(taksUrl, {
        method: "POST",
        headers: {
            //headers variable value + new one
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({description: description})
    })
    .then((res) => res.json())
    .then((data) => {
        getTasks();
        console.log("data", data);
        newTask.value = "";
    })
    .catch((err) => {
        console.log(err)
        addButton.disabled = false;
    });
}

const deleteTask = (id) => {
    fetch(`${taksUrl}/${id}`, {
        method: "DELETE",
        headers
    })
    .then((res) => res.json())
    .then((data) => {
        getTasks();
        console.log("data", data);
    })
    .catch((err) => {
        console.log(err)
    });
}

//receber tarefa inteira
const editTask = (tarefa) => {

    fetch(`${taksUrl}/${tarefa.objectId}`, {
        method: "PUT",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({done: !tarefa.done})
    })
    .then((res) => res.json())
    .then((data) => {
        getTasks();
        console.log("data", data);
    })
    .catch((err) => {
        console.log(err)
        addButton.disabled = false;
    });
}


getTasks();
addButton.onclick = handleBtnAdd;