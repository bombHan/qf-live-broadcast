
import that from '../main'
//下载链接地址图片
function downloadByBlob(url, name) {
  let image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob)
      let eleLink = document.createElement('a')
      eleLink.download = name
      eleLink.href = url
      eleLink.click()
      eleLink.remove()
      // 用完释放URL对象
      URL.revokeObjectURL(url)
    })
  }
}

//复制字符串
function copyString(str) {
  const input = document.createElement("input");
  input.value = str;
  input.readOnly = true;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);
  document.execCommand("Copy");
  document.body.removeChild(input);
  that.$message.success("复制成功");
}

// 将对象转换成url后可带的参数字符串
function objecToQueryString(obj) {
  const keyArr = Object.keys(obj);
  let str = '?';
  keyArr.forEach((item) => {
    if (obj[item] != null) {
      str += `${item}=${obj[item]}&`
    }
  })
  return str
}

/* 深拷贝 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}



function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
  *
  * @param fn {Function}   实际要执行的函数
  * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
  *
  * @return {Function}     返回一个“去弹跳”了的函数
  */
// 防抖动debounce
function _debounce(fn, delay) {
  delay = delay || 600
  let timer
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {
    // 保存函数调用时的上下文和参数，传递给 fn
    let ctx = this
    let args = arguments
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    if (timer) {
      clearTimeout(timer)
    }
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      timer = null
      fn.apply(ctx, args)
    }, delay)
  }
}


import axios from 'axios';
function exportExcel(url, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
    axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
    axios({
      method: 'post',
      url: '/v9.0' + url, // 请求地址
      data: options, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(
      response => {
        resolve(response.data)
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        console.log(blob, response)
        let fileName = response.headers['content-disposition'] ? response.headers['content-disposition'] : Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          // console.log(2)
          navigator.msSaveBlob(blob, fileName)
        } else {
          // console.log(3)
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          //释放内存
          window.URL.revokeObjectURL(link.href)
        }
      },
      err => {
        reject(err)
      }
    )
  })
}

// 将图片转成base64
function drawBase64Image(img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/png')
  return dataURL
}

//判断权限
function hasPermission(targetPermission) {
  let permissionList = []
  if (process.env.NODE_ENV === 'development') {
    permissionList = window.parent.hyx ? window.parent.hyx.permission : ['btn-liveBroadcast-zbdt-create'];
  } else {
    permissionList = window.parent.hyx ? window.parent.hyx.permission : [];
  }
  // console.log('iframe外部的权限数组', permissionList)
  return permissionList.includes(targetPermission)
}

function IsURL(str_url) {
  var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
  + '?(([0-9a-z_!~*\'().&amp;=+$%-]+: )?[0-9a-z_!~*\'().&amp;=+$%-]+@)?' //ftp的user@
  + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
  + '|' // 允许IP和DOMAIN（域名）
  + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
  + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
  + '[a-z]{2,6})' // first level domain- .com or .museum
  + '(:[0-9]{1,4})?' // 端口- :80
  + '((/?)|' // a slash isn't required if there is no file name
  + '(/[0-9a-z_!~*\'().;?:@&amp;=+$,%#-]+)+/?)$';
  var reg = new RegExp(strRegex);
  const flag = reg.test(str_url)
  return flag;
}

let utils = {
  objecToQueryString,
  deepClone,
  getQueryObject,
  _debounce,
  exportExcel,
  downloadByBlob,
  copyString,
  drawBase64Image,
  hasPermission,
  IsURL
}

export default utils;