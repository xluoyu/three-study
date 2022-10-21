import React, { useState } from 'react'
import { Button, Input } from 'antd';
import './App.css'

type ITodoItem = {
  id: number,
  name: string
}

function TodoItem(props: {item: ITodoItem, changeItem: (item: ITodoItem, type: 'change' | 'delete') => void}) {
  const {item, changeItem} = props

  function chagneInfo(e: React.ChangeEvent<HTMLInputElement>) {
    item.name = e.target.value
    changeItem(item, 'change')
  }

  function handleDelete() {
    changeItem(item, 'delete')
  }


  return (
    <div className="flex mb-2">
      <div>
        <Input placeholder="Basic usage" value={item.name} onChange={(e) => chagneInfo(e)}/>
      </div>
      <div>
        <Button danger onClick={handleDelete}>删除</Button>
      </div>
    </div>
  )
}

function Todo() {
  const [todoList, setTodoList] = useState([
    {id: 1, name: 'to do something'}
  ])

  function addTodo() {
    setTodoList([{id: todoList.length + 1, name: '新的'}, ...todoList])
  }

  function changeItem(item:ITodoItem, type: 'change' | 'delete') {
    const _list = [...todoList]
    const index = _list.findIndex(e => item.id === e.id)

    switch (type) {
      case 'change':
        _list[index] = item
        break;
      case 'delete':
        _list.splice(index, 1)
        break;
    }
    
    setTodoList(_list)
  }

  return (
    <div className="App">
      <Button type="primary" onClick={addTodo} className="mb-6">新建</Button>
      {
        todoList.map(e => <TodoItem key={e.id} item={e} changeItem={changeItem}/>)
      }
    </div>
  )
}

export default Todo
