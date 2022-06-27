window.onload = () => {
 
  document.getElementById('open').addEventListener('click', () => {
      window.location.href = '/'
  })
  document.getElementById('open1').addEventListener('click', () => {
      window.location.href = '/'
  })
  document.getElementById('open2').addEventListener('click', () => {
      window.location.href = '/'
  })

  document.getElementById(`cat`).addEventListener('click', () => {
      document.cookie = "cat=cat"
      window.location.href = '/'
  })


  document.getElementById(`cat1`).addEventListener('click', () => {
        document.cookie = "cat=cat1"
        window.location.href = '/'
    })
  document.getElementById(`cat2`).addEventListener('click', () => {
        document.cookie = "cat=cat2"
        window.location.href = '/'
  })
  document.getElementById(`cat3`).addEventListener('click', () => {
        document.cookie = "cat=cat3"
        window.location.href = '/'
  })


  document.getElementById(`mcat`).addEventListener('click', () => {
      document.cookie = "cat=cat"
      window.location.href = '/'
  })

  
  document.getElementById(`mcat1`).addEventListener('click', () => {
        document.cookie = "cat=cat1"
        window.location.href = '/'
    })
  document.getElementById(`mcat2`).addEventListener('click', () => {
        document.cookie = "cat=cat2"
        window.location.href = '/'
  })
  document.getElementById(`mcat3`).addEventListener('click', () => {
        document.cookie = "cat=cat3"
        window.location.href = '/'
  })
}