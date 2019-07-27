let { Element,html,page}=OK;

page(class extends Element {
  static css=`./css/todo-list.css`;
  
  constructor(props){
    super(props);
    this.data={
      inputValue:'',//添加待办输入框的值
      list:[],//待办列表,{title,isDone},title:待办项;isDone:是否已完成
    };
    
    //绑定事件this
    this.onAdd=this.onAdd.bind(this);
    this.setDoneFn=this.setDoneFn.bind(this);
    this.onInput=this.onInput.bind(this);
  }
  
  //添加待办
  onAdd(){
    if (!this.data.inputValue) {
      return alert('请输入todo项！');
    }
    this.data.list=[...this.data.list,{title:this.data.inputValue,isDone:false}];
    this.update();
  }
  
  //添加待办输入框
  onInput(e){
    this.data.inputValue=e.target.value;
    this.update();
  }
  
  //完成待办操作
  setDoneFn(index){
    return ()=>{
      this.data.list[index].isDone=true;
      this.data.list=[...this.data.list];
      this.update();
    }
  }
  
  render() {
    return html`<h1>todo-list</h1>
<!--未完成待办-->
<el-list list=${this.data.list} setDoneFn=${this.setDoneFn}/>
<!--已完成待办-->
<el-list isDone list=${this.data.list}/>
<div>
<input placeholder="添加待办" value=${this.data.inputValue} oninput=${this.onInput}/>
<button onclick=${this.onAdd}>添加</button>
</div>`;
  }
});