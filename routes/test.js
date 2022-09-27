async function f() {
  const promise = new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log('Hello')
    }, 1000)
  })
  console.log(await promise)
}

f()