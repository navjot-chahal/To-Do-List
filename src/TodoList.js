/*
<----------------------->
TO-DO LIST - WITH REACT
<----------------------->
Version: 1.0.0
*/

// React gerneral imports
import React  , {Component} from "react"
import "./TodoList.css"

// List items and database import
import TodoItems from "./TodoItems.js";
import { collection , onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import db from "../../Firebase/firebase"

class TodoList extends Component{
    constructor (props){
        super(props);

        this.state = {
            items: []
        }
        
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.ObSort = this.ObSort.bind(this);
        this.quickSort = this.quickSort.bind(this)
        this.partition = this.partition.bind(this)
        this.swap = this.swap.bind(this)
    }

    // Swap funtion to swap two elements
    swap(items, leftIndex, rightIndex){
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }
    
    partition(items, left, right) {
        var pivot   = items[Math.floor((right + left) / 2)].key, //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i].key < pivot) {
                i++;
            }
            while (items[j].key > pivot) {
                j--;
            }
            if (i <= j) {
                this.swap(items, i, j); //swap two elements
                i++;
                j--;
            }
        }
        return i;
    }

    quickSort(items, left, right){

        var index;


        if (items.length > 1) {

            index = this.partition(items, left, right)

            if (left < index - 1) {
                this.quickSort(items, left, index - 1)
            }

            if (index < right) {
                this.quickSort(items, index, right)
            }
        }

    }

    ObSort(objArr){
        this.quickSort(objArr, 0 ,objArr.length - 1)
        objArr.reverse()
        return objArr
    }

    componentDidMount(){

        onSnapshot(collection(db,"todos"),((s) => {
            let list = []
            
            s.docs.forEach((doc) => {list.unshift({ text: doc.data().text, key: doc.data().key, id: doc.id})})

            this.setState({
                items: this.ObSort(list)
            })
        }))
    }

    addItem(e){
        if (this._inputElement.value !== ""){
            addDoc(collection(db,"todos"), { text: this._inputElement.value, key: Date.now()})
            this._inputElement.value = ""
        }

        e.preventDefault();
    }

    deleteItem(id){
        deleteDoc(doc(collection(db,"todos"),id))
    }

    render(){

        return (
            <div style={{backgroundColor: "black"}} className = "todoListMain">
                <div className = "header">
                    <form onSubmit={this.addItem}>
                        <input ref={(a) => this._inputElement = a} 
                        placeholder = "Enter task">
                        </input>
                        <button type = "submit">add</button>
                    </form>
                </div>
                <TodoItems entries={this.state.items}
                            delete={this.deleteItem}/>
            </div>
        )
    }
}

export default TodoList;