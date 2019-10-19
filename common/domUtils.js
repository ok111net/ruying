/**
 * 浏览器环境工具函数库,
 * 只能运行在浏览器环境
 */
const dom=document;
const body=document.body;

/**
 * 返回绝对网址，即完整网址
 * @see https://davidwalsh.name/get-absolute-url
 * @param url
 * @returns {string|*}
 */
/*export function getAbsoluteUrl(url = ''){
  const a = dom.createElement('a');
  a.href = url;
  return a.href;
}*/


/**
 * 测量滚动条宽度
 * Measure scrollbar width for padding body during modal show/hide
 * https://github.com/react-component/table/blob/master/src/utils.js
 * @returns {*}
 */
let scrollbarWidth;
const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll',
};
export function getScrollBarSize() {
  if (typeof dom === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  
  if (scrollbarWidth) {
    return scrollbarWidth;
  }
  
  const scrollDiv = dom.createElement('div');
  
  for (const scrollProp in scrollbarMeasure) {
    if (Reflect.has(scrollbarMeasure, scrollProp)) {
      scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
    }
  }
  body.appendChild(scrollDiv);
  scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  body.removeChild(scrollDiv);
  
  return scrollbarWidth;
}

/**
 * dom节点是否包函在别一个dom里面
 * @param root
 * @param n
 * @returns {boolean}
 */
export function contains(root, n) {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  
  return false;
}



/*css相关操作*/
//https://github.com/react-component/util/blob/master/src/Dom/css.js
const PIXEL_PATTERN = /margin|padding|width|height|max|min|offset/;

const removePixel = {
  left: true,
  top: true,
};
const floatMap = {
  cssFloat: 1,
  styleFloat: 1,
  float: 1,
};

function getComputedStyle(node) {
  return node.nodeType === 1 ?
      node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
}

function getStyleValue(node, type, value) {
  type = type.toLowerCase();
  if (value === 'auto') {
    if (type === 'height') {
      return node.offsetHeight;
    }
    if (type === 'width') {
      return node.offsetWidth;
    }
  }
  if (!(type in removePixel)) {
    removePixel[type] = PIXEL_PATTERN.test(type);
  }
  return removePixel[type] ? (parseFloat(value) || 0) : value;
}

/**
 * 读取css
 * @param node
 * @param name
 * @returns {*}
 */
export function getCss(node, name) {
  const length = arguments.length;
  const style = getComputedStyle(node);
  
  name = floatMap[name] ? 'cssFloat' in node.style ? 'cssFloat' : 'styleFloat' : name;
  
  return (length === 1) ? style : getStyleValue(node, name, style[name] || node.style[name]);
}

/**
 * 设置css
 * @param node
 * @param name
 * @param value
 * @returns {*}
 */
export function setCss(node, name, value) {
  const length = arguments.length;
  name = floatMap[name] ? 'cssFloat' in node.style ? 'cssFloat' : 'styleFloat' : name;
  if (length === 3) {
    if (typeof value === 'number' && PIXEL_PATTERN.test(name)) {
      value = `${value}px`;
    }
    node.style[name] = value; // Number
    return value;
  }
  for (const x in name) {
    if (name.hasOwnProperty(x)) {
      setCss(node, x, name[x]);
    }
  }
  return getComputedStyle(node);
}

/**
 * 获取元素宽度
 * @param el
 * @returns {number}
 */
export function getWidth(el) {
  if (el === document.body) {
    return document.documentElement.clientWidth;
  }
  return el.offsetWidth;
}

/**
 * 获取元素高度
 * @param el
 * @returns {number}
 */
export function getHeight(el) {
  if (el === document.body) {
    return window.innerHeight || document.documentElement.clientHeight;
  }
  return el.offsetHeight;
}

/**
 * 获取元素文档座标
 * @param node
 * @returns {{left: number, top: number}}
 */
export function getOffset(node) {
  const box = node.getBoundingClientRect();
  const docElem = document.documentElement;
  
  // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
  return {
    left: box.left + (window.pageXOffset || docElem.scrollLeft) -
    (docElem.clientLeft || document.body.clientLeft || 0),
    top: box.top + (window.pageYOffset || docElem.scrollTop) -
    (docElem.clientTop || document.body.clientTop || 0),
  };
}

/**
 * 获取页面文档高度与宽度
 * @returns {{width: number, height: number}}
 */
export function getPageSize() {
  const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  
  return {
    width,
    height,
  };
}

/**
 * 获取页面可见区域高度与宽度
 * @returns {{width: number, height: number}}
 */
export function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}

/**
 * 获取页面滚动条偏移量
 * @returns {{scrollLeft: number, scrollTop: number}}
 */
export function getPageScroll() {
  return {
    scrollLeft: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
    scrollTop: Math.max(document.documentElement.scrollTop, document.body.scrollTop),
  };
}

