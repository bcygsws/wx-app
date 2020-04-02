// pages/todos/todos.js
Page({
  data: {
    // 文本框数据模型
    newContent: '',
    // 任务清单数据模型
    todos: [{
      name: 'Learning Html',
      completed: true
    },
    {
      name: 'Learning CSS3',
      completed: false
    },
    {
      name: 'Learning Java',
      completed: true
    }
    ],
    leftCount: 1

  },
  onLoad: function (options) {
    var count = 0;
    this.data.todos.forEach(function (item) {
      if (item.completed == false) {
        count++;
      }
    });
    console.log(count);
    this.setData({
      leftCount: count
    });
  },
  // 拿到文本输入框中的数据
  inputHandle: function (e) {
    console.log(e.detail.value);
    this.data.newContent = e.detail.value;
  },
  /* 
  1.添加条目，一定会影响leftCount的值
   由于我们约定了新添加的条目，默认是没有被选中的，所以每加一条，剩下没被选中的条目数量leftCount值应该+1就可以
  */
  addHandle: function (e) {
    // console.log('ok');
    // console.log(e);
    /* 点击添加图标或者enter键盘抬起事件的事件处理函数 */
    // 如果文本输入框中内容为空，则终止流程，后面的代码将不会执行
    var obj = {
      name: this.data.newContent,
      completed: false
    };
    if (obj.name == "") {
      return false;
    }
    this.data.todos.push(obj);
    // 必须显示的设置，否则数据更新了，但是模板没有编译，更改后数据没有渲染到页面上
    this.setData({
      todos: this.data.todos,
      newContent: '',
      leftCount: this.data.leftCount + 1
    });
    // 测试代码
    // console.log(this.data.newContent);
  },
  /* 
  2.切换【选中】和【未选中】状态，一定会影响leftCount的值
  原本 选中，切换后是未选中状态，leftCount+1
  原本 未选中，切换后是选中状态  leftCount-1
  */
  // 点击内容区条目前的图标切换显示状态：【选中】或者【不选中】
  iconSwitchHandle: function (e) {
    // data-index传递的当前索引值e.target.dataset.index
    var indexVal = e.target.dataset.index;
    // console.log(indexVal);
    /* 
    接下来有两种途径：1.先查看该索引元素的completed值，如果为true，表示之前选中状态，切换后未选中，leftCount应该+1。反之，leftCount应该-1。采用第一种
    2.第二种途径：在第82行后面书写，直接遍历改变后的数组，统计completed键为false的元素个数
    */
    this.setData({
      leftCount: this.data.todos[indexVal].completed ? this.data.leftCount + 1 : this.data.leftCount - 1
    })
    this.data.todos[indexVal].completed = !this.data.todos[indexVal].completed;
    this.setData({
      todos: this.data.todos
    });
  },
  /* 
  3.删除条目，是有可能影响leftCount的值，具体说来，如果该条目已经被选中，则删除就不影响leftCount的值；反之，如果
  该条目没有被选中，就被删除了，则leftCount值应该-1
  */
  // 点击内内容区的清除图标，删除当前条目
  iconClearHandle: function (e) {
    var indexVal = e.target.dataset.index;
    if (this.data.todos[indexVal].completed == false) {
      this.setData({
        leftCount: this.data.leftCount - 1
      });
    }
    // 特别注意：splice方法删除元素必须放在if操作后面，原因是：删除后this.data.todos[indexVal]指向了被是删除元素后面
    // 相邻的一个元素
    this.data.todos.splice(indexVal, 1);
    this.setData({
      todos: this.data.todos
    });
  }

});