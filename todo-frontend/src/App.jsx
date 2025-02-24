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
    // # state management
    const [count, setCount] = useState(0);
    const [search, setSearch]=useState("");
    const [searchItem, setSearchItem]=useState(search);
    useEffect(()=>{
        // # fetchTodos

    }, [count]);

    // # a function that will help us check which component we have to use wether to update, delete, add todo or get todo
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

        // # the function does two things
        // # --either updates the todo list
        // # --or adds a new todo 
        if (editIndex===-1){
            // # add new todo 
                   const response = await axios.get("http://127.0.0.1:8080/todos", {
                   title : todoInput,
                   completed : false,
                   });
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
        }else{
            // # update existing todo
            const todoUpdate = {...todos[editIndex], title: todoInput };
                        const response = await axios.put(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`, {
              todoUpdate,
                   });
                // #    checking our responses in the terminal
                const updatedTodos = [...todos];
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
        // # dynamic implementation of our todo so that one can toggle weather completed or not
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
// #  we need to have away to fomart our date and time
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