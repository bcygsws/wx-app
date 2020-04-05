// pages/todos/todos.js
// 1.快捷键识记：ctrl+tab组合键，切换窗口中打开的文件
/* 
2.git clone https://github.com/bcygsws/wx-app --depth 1  把代码克隆下来，克隆的是最后一次提交的代码depth 1，克隆深度为1
表示最后一次提交的代码
*/
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
    leftCount: 1,
    // 设置一个标志位state,state=true表示都选中状态，state=false表示切换前 item不是都选中的状态
    // 必须在data中定义state变量，因为前一次的state值影响后一次的state值
    state: false

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
  // 拿到文本输入框中的数据，并存放于data的newContent变量下
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
    console.log(e);
    /* 
    上面打印的e对象中，不难发现，e下面的currentTarget和target里都能拿到dataset中的索引值，区别在于
    currentTarget拿到的目标源始终是当前父元素view,而target则只是父元素或者某个子元素目标。所以，本例中在使用
    e.target.dataset.index拿索引值时，有时会报“completed未定义的未知错误”
    */
    // 此处使用的是e.currentTarget.dataset.index 而非e.target.dataset.index;
    var indexVal = e.currentTarget.dataset.index;
    var item = this.data.todos[indexVal];
    console.log(indexVal);
    /* 
    接下来有两种途径：1.先查看该索引元素的completed值，如果为true，表示之前选中状态，切换后未选中，leftCount应该+1。反之，leftCount应该-1。采用第一种
    2.第二种途径：在第82行后面书写，直接遍历改变后的数组，统计completed键为false的元素个数
    */
    var leftCount = this.data.leftCount + (item.completed ? 1 : -1);
    // 切换勾选和不勾选的状态
    item.completed = !item.completed;
    this.setData({
      todos: this.data.todos,
      leftCount: leftCount
    });
  },
  /* 
  3.删除条目，是有可能影响leftCount的值，具体说来，如果该条目已经被选中，则删除就不影响leftCount的值；反之，如果
  该条目没有被选中，就被删除了，则leftCount值应该-1
  */
  // 点击内内容区的清除图标，删除当前条目
  iconClearHandle: function (e) {
    // 第一种实现方式：
    var indexVal = e.target.dataset.index;
    // if (this.data.todos[indexVal].completed == false) {
    //   this.setData({
    //     leftCount: this.data.leftCount - 1
    //   });
    // }
    // // 特别注意：splice方法删除元素必须放在if操作后面，原因是：删除后this.data.todos[indexVal]指向了被是删除元素后面
    // // 相邻的一个元素
    // this.data.todos.splice(indexVal, 1);
    // this.setData({
    //   todos: this.data.todos
    // });
    // 第二种实现方式：利用splice()方法返回值为删除的元素组成的数组,来处理leftCount的值
    var items = this.data.todos.splice(indexVal, 1);
    this.data.leftCount = this.data.leftCount - items[0].completed ? 0 : 1;
    this.setData({
      todos: this.data.todos,
      leftCount: this.data.leftCount
    });

  },
  /* 4.toggle all 切换为全选，可能会改变leftCount的值 */
  toggleAllHandle: function () {
    // console.log('ok');
    /* 第一种实现方式：分别处理：1.没有全选中--->全选中  2.全选中--->全没有选中 */
    var flag = this.data.state;
    // if (!flag) {
    //   this.data.todos.forEach(function (item) {
    //     item.completed = true;
    //   });
    //   flag = true;
    //   this.setData({
    //     todos: this.data.todos,
    //     leftCount: 0,
    //     state: flag
    //   });
    //   return false;
    // }
    // if (flag) {
    //   3
    //   this.data.todos.forEach(function (item) {
    //     item.completed = false;
    //   });
    //   flag = false;
    //   this.setData({
    //     todos: this.data.todos,
    //     leftCount: this.data.todos.length,
    //     state: flag
    //   });
    // }
    /* 
    第二种方式：对全选和全不选切换的抽象，切换过程中：列表的状态值(state)表示和每个item要强制设定的值相反 
    特别注意：在小程序中，this永远指得是page页面对象，而不是事件源对象，除非在类似forEach(function(){函数体中出现this,this指向就发生改变了，不再是page页面对象})
    */
    flag = !flag;
    var arr = this.data.todos;
    arr.forEach(function (item) {
      item.completed = flag;
    });
    // 必须有下面一句：列表每个item值改变后的布尔值，和state值是相同。列表每个item改变前的布尔值和state值相反
    this.data.state = flag;
    this.setData({
      todos: arr,
      leftCount: flag ? 0 : arr.length
    });
  },
  // 清除全选，不影响leftCount值，清除全选的意思是，将列表中所有选中的条目删除
  clearCompletedHandle: function () {
    // var arr = [];
    // this.data.todos.forEach(function (item) {
    /* 
      使用splice遍历时逐个删除，显然是不正确的。原因是：数组元素在减少，原来的索引序号，已经无法对应
      删减后的数组的索引。可以使用反向思维，我们把要保留的元素(item.complete==false的元素)存放于一个新数组中，赋给todos
    */
    // if (item.completed == true) {
    //   this.data.todos.splice(index, 1);
    // }
    // 第一种LforEach普遍使用的方式
    //   if (item.completed == false) {
    //     arr.push(item);
    //   }
    // });
    // this.setData({
    //   todos: arr
    // });

    // 第二种方式：过滤器方法filter,直接得到过滤后的数组
    var arr = this.data.todos.filter(function (item) {
      /* 
      return (过滤条件：布尔类型); 过滤条件值为true，相关元素就过滤过来，存放于arr中，反之，return 后面
      过滤条件为false,这些元素无法通过过滤器，不会存放在新数组arr中
      
      要将item.completed==false的元素存放于arr，但是直接写return item.completed(false);这些元素无法通过过滤器，不会存放于
      arr中，所以取反实现
      */
      return !item.completed;
    });
    this.setData({
      todos: arr
    });
  }

});