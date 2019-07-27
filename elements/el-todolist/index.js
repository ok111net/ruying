/**
 * todo-list待办列表
 */
{
  let { define, Element, html } = OK;
  const elName='el-list';
  
  define( class extends Element {
    static is=elName;
    static css=`./elements/el-todolist/style.css`;
    
    render(props) {
      const count=props.list.filter(item=>item.isDone===!!props.isDone).length;
      
      return html`<div class=${props.isDone?'done':''}>
      <h3>${props.isDone?'已完成':'正在进行'}<span>${count}条</span></h3>
      <ul>
      ${props.list.map(({title,isDone},i)=>{
        if (isDone !== !!props.isDone) {
          return;
        }
        return html`<li>${title}${props.isDone?'':html`<span onclick=${props.setDoneFn(i)}>完成</span>`}</li>`;
      })}
      </ul>
      </div>`;
    }
  });
}