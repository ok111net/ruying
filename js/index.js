let { Element,html,page}=OK;

page(class extends Element {
  static css=`./css/index.css`;
  
  constructor(props){
    super(props);
    this.data={
      title:'这是一个demo',
    };
    this.onClick=this.onClick.bind(this);
    this.onReset=this.onReset.bind(this);
  }
  
  onClick(){
    this.data.title='您修改了标题！';
    this.update();
  }
  onReset(){
    this.data.title='这是一个demo';
    this.update();
  }
  
  render() {
    return html`<h1>${this.data.title}</h1>
<el-test name="el-test"/>
<div>
<button onclick=${this.onClick}>修改标题</button>
<button onclick=${this.onReset}>还原</button>
</div>`;
  }
});