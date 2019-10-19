/**
 * 工具函数库
 */
//import 'whatwg-fetch';

//服务器渲染才用到
/*import nodeFetch from 'node-fetch';

//node环境下使用node-fetch替换原生window.fetch
let fetchApi=nodeFetch;
try {
  if (typeof window!=='undefined')　fetchApi = window.fetch;
}catch (e){}*/

let fetchApi = window.fetch;

/**
 * fetch异部获取数据
 * 使用时注意：
 * 1.是否需要设置请求头headers　'Content-Type':'application/x-www-form-urlencoded',
 * 2.发送数据body是否需要序列化，可以使用param方法
 * 3.其它注意项：https://www.cnblogs.com/winyh/p/7053054.html
 * @param url
 * @param opts
 */
export const fetch = (url, opts = {}) => fetchApi(url, Object.assign({ method: 'get' }, opts))
    .then(response => {
      if (response.ok) {
        try {
          if (200 <= response.status && response.status < 300) {
            if (opts.type === 'text') {
              return response.text();
            }
            if (opts.type === 'file') {
              return response;
            }
            
            return response.json();
          }
          
          return response.json();
        } catch (err) {
          const codeMessage = {
            200: '服务器成功返回请求的数据。',
            201: '新建或修改数据成功。',
            202: '一个请求已经进入后台排队（异步任务）。',
            204: '删除数据成功。',
            400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
            401: '用户没有权限（令牌、用户名、密码错误）。',
            403: '用户得到授权，但是访问是被禁止的。',
            404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
            406: '请求的格式不可得。',
            410: '请求的资源被永久删除，且不会再得到的。',
            422: '当创建一个对象时，发生一个验证错误。',
            500: '服务器发生错误，请检查服务器。',
            502: '网关错误。',
            503: '服务不可用，服务器暂时过载或维护。',
            504: '网关超时。',
          };
          throw { code: response.status, error: codeMessage[response.status] || response.statusText };
        }
      }
      
      //fetch请求失败
      throw { code: 400, error: 'fetch请求发送失败！' };
    });

/**
 * 生成随机字符串
 * @param len　[number=32]
 * @returns {string}
 */
export const randomStr = (len = 42) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  
  for (; len > 0; len--) {
    str += chars.charAt(Math.trunc(Math.random() * chars.length));
  }
  
  return str;
};

/**
 * 检测数据类型
 * @param obj
 * @returns {string}
 */
export const type = obj => {
  //null,undefinded
  if (obj == null) {
    return obj + "";
  }
  
  let type = typeof obj;
  
  if (type === 'object') {
    type = Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase();
  }
  
  return type;
};

/**
 * 纯对象判断
 * @param obj
 * @returns {*|boolean}
 */
export const isPlainObject = obj => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  return obj.constructor && obj.constructor.name === 'Object' && obj.constructor.prototype.hasOwnProperty('hasOwnProperty');
};

/**
 * 对象参数序列化
 * @param obj {Object}
 * @returns {string}
 */
export const param = obj => {
  const returnData = [];
  
  // If an array was passed in, assume that it is an array of form elements.
  if (Array.isArray(obj) || !isPlainObject(obj)) {
    // Serialize the form elements
    for (let item of obj) {
      add(item.name, item.value, returnData);
    }
  } else {
    // If traditional, encode the 'old' way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (let key of Object.keys(obj)) {
      buildParams(key, obj[key], add, returnData);
    }
  }
  
  // Return the resulting serialization
  return returnData.join('&');
  
  /*param辅助函数*/
  function add(key, valueOrFunction, data) {
    // If value is obj function, invoke it and use its return value
    const value = typeof valueOrFunction === 'function'
        ? valueOrFunction(): valueOrFunction;
    
    data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value === null ? '': value));
  }
  
  function buildParams(key, value, add, data) {
    const isBracket = /[]$/.test(key);
    
    if (Array.isArray(value)) {
      // Serialize array navs.
      // 序列化数组项
      for (let [i, v] of value.entries()) {
        if (isBracket) {
          // Treat each array navs as a scalar.
          add(key, v, data);
        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams(key + '[' + (typeof v === 'object' && v !== null ? i: '') + ']', v, add, data);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      // Serialize object navs.
      for (let name of Object.keys(value)) {
        buildParams(key + '[' + name + ']', value[name], add, data);
      }
    } else {
      // Serialize scalar navs.
      add(key, value, data);
    }
  }
};

export const searchParse=search=>{
  const resultObj = {};
  
  if(search && search.length > 1){
    const searchStr = search.substring(1);
    const items = searchStr.split('&');
    for(let index = 0 ; index < items.length ; index++ ){
      if(! items[index]){
        continue;
      }
      const kv = items[index].split('=');
      resultObj[kv[0]] = typeof kv[1] === "undefined" ? "":decodeURIComponent(kv[1]);
    }
  }
  return resultObj;
};

/**
 * 函数节流生成器
 * 一定时间内只执行一次
 * 应用场景：鼠标移动，mousemove事件；DOM元素动态定位，window对象的resizet和scroll事件
 * @param func
 * @param wait
 * @param immediate immediate为true时表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
 * @returns {function(): *}
 */
export const throttle = (func, wait, immediate = true) => {
  let result;
  let previous = 0;
  
  return (...args) => {
    const now = new Date();
    
    if (!(previous || immediate)) previous = now;
    
    // 计算剩余时间
    const remaining = wait - (now - previous);
    
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      previous = now;
      result = func.apply(this, args);
    }
    
    return result;
  };
};
/*export const throttle = (fn, delay, immediate) => {
  let timer;
  let firstTime;
  //let isRuning;
  
  return (...arg)=>{
    //console.log(timer,firstTime,isRuning);
    //标记正在执行某种操作
    //isRuning=true;
    
    if (!firstTime) {
      firstTime=+new Date();
    }
    
    //计算是否需要运行fn
    const hasRun=new Date()-firstTime>=delay;
  
    //停止操作时定时清零
    timer&&clearTimeout(timer);
    timer=setTimeout(()=>{
      console.log(999);
      if (new Date() - firstTime === 0) {
        fn.apply(this,arg);
      }
      timer=null;
      firstTime=null;
      //console.log('skjdf:',isRuning);
    },delay);
    
    //每隔delay时间段执行fn
    if (hasRun) {
      fn.apply(this,arg);
      return firstTime=null;
    }
  
    //标记某种操作周期完毕
    //isRuning=false;
  }
};*/

/**
 * 高频执行函数防抖生成器，
 * @param fn {function} - 绑定需要防抖函数
 * @param wait {Number} -空闲时间间隔，空闲时间必须大于或等于此值时才会执行调用函数
 * @param immediate [Boolean] - 无此参数或此参数为false时，执行函数在空闲时间间隔之后执行；相反刚在之前执行。
 * @returns {Function}
 */
export const debounce = (fn, wait, immediate = true) => {
  let timeout;
  
  return (...args) => {
    clearTimeout(timeout);
    
    if (immediate && !timeout) {
      fn.apply(this, args);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, wait);
  };
};

/**
 * 解析字符串形式的对象为js对象，如：{name:'ruying'}
 * @param optsStr {String}
 * @returns {*}
 */
export const parseOptions = optsStr => {
  if (optsStr) {
    try {
      return (new Function('return JSON.parse(JSON.stringify(' + optsStr + '));'))();
    } catch (e) {
      throw e;
    }
  }
};

/**
 * 生成唯一id值
 * @param prfix [String='r']
 * @returns {string}
 */
let id = 0;
export const guid = (prfix = '') => `${prfix}_${+(new Date()) + '_' + id++}`;

/**
 * 中划线形式单词转换为驼峰式单词
 * @param str {String}
 * @returns {String}
 */
export const camelCase = str => {
  str = str.toLowerCase();
  
  const keyArr = str.split('-');
  
  if (keyArr.length === 1) {
    return str;
  }
  
  return keyArr.reduce((prevItem, nextItem) => prevItem + nextItem.charAt(0).toLocaleUpperCase() + nextItem.slice(1));
};

/**
 * A simple javascript utility for conditionally joining classNames together.
 * http://jedwatson.github.io/classnames
 * @returns {string}
 */
export const classnames = (...args) => {
  const classes = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    
    const argType = typeof arg;
    
    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(classnames.apply(null, arg));
    } else if (argType === 'object') {
      for (let key in arg) {
        if (Reflect.has(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  return classes.join(' ');
};

export const delay = (time = 3000) => new Promise(resolve => setTimeout(resolve, time));