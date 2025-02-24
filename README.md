TO DO APP IN RUST(BACKEND) AND NEXT.JS(FRONTEND)

set up your starter files as required

packages to install in our rust

```bash
actix_web : "4"
actix_cors : "0.6"
serde = {version = "1.0" features=["derive"]}
uuid = {version ="1.0", features=["serde", "v4"]}
chrono = {version ="0.4", features=["serde"]}



```



install a rust analyzer


how you going to import the packages you'll use as below,

```bash
use actix_web::{web,App, HttpServer, Responder, HttpResponse};
use actix_cors::Cors;
use serde::{Deserialize, Serialize, Debug };
use uuid::uuid;
use std::sync::Mutex;
use chromo::{utc, DateTime};

#[derive(Serialize,Deserialize, Clone)]
struct TodoItem {
id: Uuid,
title : String,
completed: bool,
created_at : DateTime<Utc>
};

#[derive(Deserialize)]
struct createTodoItem{
title: String,
complete : bool,
}
#[derive(Deserialize)]
 struct UpdateTodoItem{
 title : Option<String>
 completed : Option<bool>
 }


 define AppState (the current state of our app);

 struct AppState {
 todo_list: Mutex<Vec<TodoItem>>
 }

working on our fuctionalities
 async fn get_todos(data:  web::Data::<AppState>)-> 

 imp Responder{
#build a logic to return the entire data
 let todos=  data.todo_list.lock().unwrap();
 HttpResponse::ok().json(&*todos)
 }
#  returning data in the form of json is very convenient especiallly when working around sending data between backend and frontend 


 async fn add_todo(
    item: web::Json<ceateTodoItem>,
    data: web::Data<Appstate>
 )->impl Responder {
 let mut todos  = data.todo_list.lock().unwrap();
 let new_todo = TodoItem{
 id:Uuid::new_v4(),
 title : item.title.clone(),
 completed : item.completed,
 created_at: Utc::now(),
 };
 todos.push(new_todo);
 HttpResponse::ok().json(&*todos)

 }

 async update_todo(
    path: web::path<Uuid>,
    item : web::Json<UpdateTodoItem>
    data: web::Data<AppState>

 )-> impl Responder{
 let mut todos : data.todo.list.lock().unwrap();
 if let Some(todo) = todos.iter_mut().find(|todo :todo.id ==*path){
 if let  Some(title) = &item.title{
 todo.title == title.clone();
 }
 if let Some(Completed) = item.completed{
 todo.completed =completed
 }
 HttpResponse::ok().json(&*todos)
 }
 HttpResponse::NotFound().body(
    "Todo not found"
 )

}
 }
 async fn delete_todo(
    path: web::path<Uuid>,
    data : web::Data<AppState>

 )-> impl responder{
  let mut todos : data.todo.list.lock().unwrap();
  if todos.iter().any(|todo| todo.id == *path){
    todos.retain(|todo| todo.id != *path);
    HttpResonse::ok().json(&*todos)
  } else {
    HttpResponse::NotFound().body("To do not found")
  }
 }

#[actix_web::main]
 async fn main()-> std::io::Result<()>{
 let app_state = web::Data::new(AppState
 {
 todo-list : Mutex::new(Vec::new()),
 });
 HttpServer::new(move || {
    let cors = Cors::default()
    .allow_any_origin()
    .allow_any_method()
    .allow_any_header().max_age(3600);
App::new()
    .app_data(app_state.clone())
    .wrap(cors).route("/todos",web::get().to(get_todos))
     .route("/todos", web::post().to(add_todo))
     .route("/todos/{id"
     }, web::put().to(update_todo))
     .route("/todos/{id"
     }, web::delete().to(delete_todo))
 })
 .bind("127.0.0.1::8080")? .run().await
 }


```

working on the frondend

import the following packages
```bash
import React, {useState, useEffect} from "react";
import {MdDelete, MdEdit, MdConfirmationNumber} from "react-icons/md";
import axios from "axios";
import {format} from "date-fns"

const index = () =>{
    useState [editText, setEditText] = useState();
    const [todos, setTodos] = useState([]);
    const [todocopy, setTodoCopy] = useState(todos);
    const [todoInput, setTodoInput]= useState("");
    const [editINdex, setINdex] = useState(-1);
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    # state management
    const [count, setCount] = useState(0);
    const [search, setSearch]=useState("");
    const [searchItem, setSearchItem]=useState(search);
    useEffect(()=>{
        # fetchTodos

    }, [count]);

    # a function that will help us check which component we have to use wether to update, delete, add todo or get todo
    const editTodo = (index)=>{
        setTodoInput(todos[index].title);
        setEditIndex(index);
    }
    const fetchTodos =async ()=>{
        try{
        const response = await axios.get("http://127.0.0.1:8080/todos");
        setTodos(response.data);
        setTodosCopy(response.data);

        }catch(error){
            console.log(error)

        }
    }
        const addTodo = async ()=>{
        try{

        # the function does two things
        # --either updates the todo list
        # --or adds a new todo 
        if (editIndex===-1){
            # add new todo 
                   const response = await axios.get("http://127.0.0.1:8080/todos", {
                   title : todoInput,
                   completed : false,
                   });
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
        }else{
            # update existing todo
            const todoUpdate = {...todos[editIndex], title: todoInput };
                        const response = await axios.put(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`, {
              todoUpdate,
                   });
                #    checking our responses in the terminal
                const updatedTodos = [..todos];
                updatedTodos[editIndex] = response.data;
                setTodos(updatedTodos);
                setTodoInput("");
                setEditIndex(-1);
                setCount(count +1 )
        }
 
        
        }catch(error){
            console.log(error)

        }
    };
    const deleteTodo = async (id)=>{
        try{
        const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
        setTodos(todos.filter((todo)=>todo.id !==id));

        }catch{
            console.log(error)
        }
    };
        const toggleCompleted = async (inde)=>{
        try{
        const todoUpdate ={
        # dynamic implementation of our todo so that one can toggle weather completed or not
        ...todos[index],completed : !todos[index].completed,
        }
        const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
    const UpdatedTodos =[...todos];
    updatedTodos[index] = response.data;
    setTodos(updatedTodos);
    setCount(count + 1);
;
        }catch{
            console.log(error)
        }
    };

    const searchTodo = ()=>{
        const results =todos.filter((todo)=>
        todo.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchesults(results);
    };
#  we need to have away to fomart our date and time
const fomartDate = {dateString} =>{
try {
const data = new Date(dateString);
return isNaN(date.getTime()) 
? "Invalid date " : format(date, "yyy-MM-dd HH:mm:ss" );
}catch (error) {
    console.log()

}
}

    



    return (
        <div className ="main-body">
        <div className="todo-app">
        <div className="input-section">
        <input type="text" id="todoInput" placeholder="add item.." value={todoInput}
        onChange ={(e)=> setTodoInput(e.target.value)}/>
        <button onClick={()=>addTodo()} className="add">
        {editIndex === -1 ? "Add" : "Update"}
        </button>

        <input type="text" id="search-input" placeholder="Search item.." value={searchItem}
        onChange ={(e)=> setSearchItem(e.target.value)}/>
        <button onClick={()=> {}}> 
        
        Search
      
        </button>
    <div className="todos"> 
    <ul className="todo-list"></ul>
    {todos.length === 0 &&(
        <div></div>
    )
    }
    </div>
        
        </div>
        </div>
    </div>
    
    );
};
export default index;

```

 
















