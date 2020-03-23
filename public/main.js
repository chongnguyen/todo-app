window.addEventListener('load', function(){
  var todoList = JSON.parse(this.localStorage.getItem('todoList')) || [];

  const list = document.getElementById('todo-list');
  const input = document.getElementById('input-todo');
  const btnAdd = document.getElementById('btn-add');
  const progress = document.getElementById('progress-percent');
  const clearBtn = document.getElementById('clear-todo');

  btnAdd.addEventListener('click', addTodo);
  input.addEventListener('keyup', enterTodo);
  list.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearAllTodo);
  input.addEventListener("input", OnInput, false);
  input.addEventListener("blur", blurInput, false);
  input.addEventListener("focus", focusInput, false);

  function OnInput() {
    this.style.height = '40px';
    this.style.height = (this.scrollHeight) + 'px';
  }
  function blurInput(){
    if(!input.value){
      input.style.height = '40px';
      input.style.transition = 'height 0.3s';
      input.style.backgroundImage = 'url("./img/plus.png")';
      input.style.paddingLeft = '34px';
    } else {
      input.style.backgroundImage = 'unset';
      input.style.paddingLeft = '16px';
    }
  }

  function focusInput(){
    this.style.backgroundImage = 'unset';
    this.style.paddingLeft = '16px';
    this.style.transition = 'padding 0.3s';
  }

  function clearAllTodo(event){
    todoList.length = 0;
    render(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  function onClickItem(event){
    var target = event.target.className;
    if(target.indexOf('wrapper__item-checkbox') !== -1){
      onDoneTodo(event, event.target.parentElement);
    } else if (target.indexOf('wrapper__item-close') !== -1){
      removeTodo(event, event.target.parentElement);
    } else {
      return;
    }

  }

  function onDoneTodo(event, todo){
    todo.classList.toggle('active');
    todoList[todo.dataset.id].state = !(todoList[todo.dataset.id].state);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    setLengthProgress();
    render(todoList);
  }

  function removeTodo(event, todo){
    todoList.splice(todo.dataset.id, 1);
    render(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  function enterTodo(event){
    if(event.keyCode == 13){
      addTodo(event);
    }
  }

  function addTodo(event){
    event.preventDefault();
    if(input.value.charAt(0) != '\n' && input.value) {
      const newTodo = {state: false, content: input.value};
      todoList.push(newTodo);
      render(todoList);
      localStorage.setItem('todoList', JSON.stringify(todoList));
    } else {
      let alert = document.getElementsByClassName('alert')[0]
      alert.style.display = 'block';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 3000);
    }

    input.value = '';
    blurInput();
  }

  function setLengthProgress(){
    var todoListDone = todoList.filter(item => item.state).length;
    var width = Math.round(todoListDone / todoList.length * 100) || 0;
    progress.dataset.width = width ? width + '%' : '';
    progress.style.width = width + '%';
  }

  function render(arr){
    arr.sort((a, b) => a.state - b.state);
    let data =  arr.map((item, i) => {
      if(item.state){
        return '<li class="wrapper__item active" data-id=' + i +'>' +
        '<div class="wrapper__item-checkbox"></div>' +
        '<div class="wrapper__item-content">' + item.content + 
        '</div><i class="fas fa-times wrapper__item-close"></i></li>'; 
        
      }
      return '<li class="wrapper__item" data-id=' + i +'>' +
      '<div class="wrapper__item-checkbox"></div>' +
      '<div class="wrapper__item-content">' + item.content + 
      '</div><i class="fas fa-times wrapper__item-close"></i></li>'; 
      
    });
    list.innerHTML = data.join('');
    setLengthProgress();
  }

  render(todoList);

});