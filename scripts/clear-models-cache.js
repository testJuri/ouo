// 清除模型缓存脚本
console.log('Clearing models-storage-v2 from localStorage...')

// 这个脚本需要在浏览器控制台执行
console.log(`
请在浏览器控制台执行以下代码：

localStorage.removeItem('models-storage-v2')
location.reload()

或者点击 Application -> Local Storage -> http://localhost:5176 
找到 models-storage-v2 删除后刷新
`)
