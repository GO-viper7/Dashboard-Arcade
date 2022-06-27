window.onload = () => {
  console.log('fkng hell twice')
  document.getElementById('open').addEventListener('click', () => {
    window.location.href = '/admin/add-product'
  })
  var as = document.getElementById(`add`)
  as.addEventListener('click', () => {
    setTimeout(() => {
      window.location.href='/admin/add-product'
    }, 1000)
       
  })

  for(var j =0; j<glob; j++) {  
    (function() {
    var p = j+1
    
    
    var w = document.getElementById(`${p}yt`)
    w.addEventListener('click', () => {
      console.log('fkng hell')
      var final
    
      if ( document.getElementById(`${p}categ1`).checked == true ) {
        final = document.getElementById(`${p}categ1`).value
      }
      if ( document.getElementById(`${p}categ2`).checked == true ) {
        final = document.getElementById(`${p}categ2`).value
      }
      if ( document.getElementById(`${p}categ3`).checked == true ) {
        final = document.getElementById(`${p}categ3`).value
      }
    
      const res =  fetch(`/admin/add-product`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
          },
      
          body: JSON.stringify({
            "id" : p,
            "name"  : document.getElementById(`${p}nt`).value,
            "cost"  : document.getElementById(`${p}ca`).value,
            "stock" : document.getElementById(`${p}sa`).value,
            "category" : final,
            "edit" : true
          }),
        }).then(res => {  
            if (res.status !== 200) {
                console.log("error")
            } else {
              console.log("FU")
              res.json().then(data => {
                console.log(data)
              })
            }
          })
          setTimeout(() => {
            window.location.href='/admin/add-product'
          }, 1000)
        
      })

      var qw = document.getElementById(`${p}delt`)
      qw.addEventListener('click', () => {
      const res =  fetch(`/admin/add-product`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
          },
      
          body: JSON.stringify({
            "id" : p,
            "del" : true
          }),
        }).then(res => {  
            if (res.status !== 200) {
                console.log("error")
            } else {
              console.log("FU")
              res.json().then(data => {
                console.log(data)
              })
            }
          })
          setTimeout(() => {
            window.location.href='/admin/add-product'
          }, 1000)
      })
    }
   ())
  }
}