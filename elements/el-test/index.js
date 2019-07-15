/**
 * 这是一个组件
 */
{
  let { define, Element, html } = OK;
  const elName='el-test';
  
  define( class extends Element {
    static is=elName;
    static css=`./elements/${elName}/style.css`;
    
    render(props) {
      return html`<div>我是一个${props.name}组件</div>`;
    }
  });
}