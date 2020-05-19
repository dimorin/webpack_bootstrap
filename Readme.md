## 목업 API 1: devServer.before
- express의 객체가 app 인자로 들어온다.
- localhost:8080/api/users
``javascript
// webpack.config.js
module.exports = {
  devServer: {
    overlay: true,
    stats: "errors-only",
    before:app => {
      app.get("/api/users", (req,res) => {
        res.json([
          {
            id:1,
            name:"Alice"
          }
        ])
      })
    },  
    hot: true,
  },  
};
``
``javascript
// src/app.js
import axios from "axios";
document.addEventListener("DOMContentLoaded", async () => {  
  const res = await axios.get("/api/users");
  console.log(res);
})
``

## 목업 API 2: connect-api-mocker
``bash
npm i -D connect-api-mocker
``
- 루트에 mocks/api/users 폴더 만들고 그 안에 GET.json 만들고 그 안에
``json
[{"id": 1,"name": "Bob"},{"id": 2,"name": "Mary"},{"id": 3,"name": "Chris"}]
``
``javascript
// webpack.config.js
const apiMocker = require("connect-api-mocker");
module.exports = {  
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: (app) => {
      app.use(apiMocker("/api", "mocks/api"));
    },
    hot: true,
  },
``