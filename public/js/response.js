const token = document.getElementById("disp");
const generate = document.getElementById("gen");
generate.addEventListener('click', ()=> {
    token.style.display="block";
})
document.getElementById('home').addEventListener('click', () => {
  window.location.href = '/'
})