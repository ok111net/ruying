/**
 * node web服务
 */
const express = require('express');
const app = express();

const path = require('path');
// 静态资源文件夹
app.use(express.static(path.join(__dirname, '/')));

app.listen('80');


