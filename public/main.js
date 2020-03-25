window.addEventListener('load', function(){
  // Lấy dữ liệu từ LocalStorage.
  let todoList = JSON.parse(this.localStorage.getItem('todoList')) || [];
  let removeList = JSON.parse(this.sessionStorage.getItem('removeList')) || [];
  
  const list = document.getElementById('todo-list');
  const btnAdd = document.getElementById('btn-add');
  const input = document.getElementById('input-todo');
  const progress = document.getElementById('progress-percent');
  const clearBtn = document.getElementById('clear-todo');
  const restoreBtn = document.getElementById('restore-todo');

  list.addEventListener('click', onClickItem);
  btnAdd.addEventListener('click', addTodo);
  input.addEventListener('keyup', enterTodo);
  input.addEventListener("input", OnInput);
  input.addEventListener("blur", blurInput);
  input.addEventListener("focus", focusInput);
  clearBtn.addEventListener('click', clearAllTodo);
  restoreBtn.addEventListener('click', restoreTodo);

  // Sự kiện input.
  function OnInput() {
    // set lai chiều cao cho text-area.
    focusInput.call(this);
    this.style.height = (this.scrollHeight) + 'px';
  }
  function blurInput(){
    if(!input.value){ // nếu input rỗng.
      // set lại các thuộc tính ban đầu.
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

  // Xóa toàn bộ Task.
  function clearAllTodo(){
    todoList.length = 0;
    render(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  // Khôi phục task vừa xóa. 
  function restoreTodo(){
    if(!removeList[0]){
      alert('Không còn task để khôi phục.')
      return true;
    }
    todoList.push(removeList.pop());
    render(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    sessionStorage.setItem('removeList', JSON.stringify(removeList));
  }

  // Sự kiện kích vào Task item (li).
  function onClickItem(event){
    var target = event.target.className;  
    if(target.indexOf('wrapper__item-checkbox') !== -1){
      // Nếu là checkbox thì gọi hàm onDoneTodo.
      onDoneTodo(event.target.parentElement);
    } else if (target.indexOf('wrapper__item-close') !== -1){
      // Nếu là close-icon là gọi hàm removeTodo.
      removeTodo(event.target.parentElement);
    } else {
      return;
    }

  }

  // Ondone - Checked.
  function onDoneTodo(todo){
    todo.classList.toggle('active');
    // Cập nhật trạng thái của task.
    todoList[todo.dataset.id].state = !(todoList[todo.dataset.id].state);
    // Cập nhật lại localStorage.
    localStorage.setItem('todoList', JSON.stringify(todoList));
    // Cập nhật chiều dài thanh progress.
    setLengthProgress();
    render(todoList);
  }

  // Xóa task.
  function removeTodo(todo){
    let [task] = todoList.splice(todo.dataset.id, 1);
    removeList.push(task);
    render(todoList);
    // Cập nhật lại localStorage.
    localStorage.setItem('todoList', JSON.stringify(todoList));
    sessionStorage.setItem('removeList', JSON.stringify(removeList));
  }

  // sự kiện nhấn phím Enter.
  function enterTodo(event){
    if(event.keyCode == 13){
      addTodo(event);
    }
  }

  // Thêm task
  function addTodo(event){
    event.preventDefault();
    // Chỉ thêm task mới khi nó không rỗng.
    if(input.value.charAt(0) != '\n' && input.value) {
      // Sét thuộc tính state = false cho task mới.
      const newTodo = {state: false, content: input.value};
      // Thêm vào mảng ==> render ==> lưu vào localStogare.
      todoList.push(newTodo);
      render(todoList);
      localStorage.setItem('todoList', JSON.stringify(todoList));
    } else {
      // Hiện cảnh báo.
      let alert = document.getElementsByClassName('alert')[0];
      alert.style.display = 'block';
      // Tắt cảnh báo sau 3s.
      setTimeout(() => {
        alert.style.display = 'none';
      }, 3000);
    }

    input.value = '';
    blurInput();
  }

  // Set chiều dài thanh progress (tiến độ).
  function setLengthProgress(){
    // Lọc những task đã xong và lấy chiều dài.
    var todoListDone = todoList.filter(item => item.state).length;
    // Tính chiều dài = đã check / tổng * 100.
    var width = Math.round(todoListDone / todoList.length * 100) || 0;
    // gán giá trị cho data-width.( số phần trăm hiển thị trên thanh progress)
    progress.dataset.width = width ? (width + '%') : '';
    // Cập nhật chiều dài.
    progress.style.width = width + '%';
  }

  function render(arr){
    arr.sort((a, b) => a.state - b.state); // sắp xếp theo trạng thái task.

    let data =  arr.map((item, i) => {
      if(item.state){ // đả check thì thêm class `active`
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
    setLengthProgress();  // Set chiều rộng của thanh progress (tiến độ).
  }

  render(todoList);

});




