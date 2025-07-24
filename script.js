    function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
  localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
  }
});

const selectedDate = document.getElementById('booking-date').value;
const resetBtn = document.getElementById('reset-date-btn');
const but=document.querySelectorAll(".slot");


but.forEach((button) => {
  button.addEventListener("click",()=>{
  button.style.backgroundColor="grey"    
  button.disabled=true;
  })
});

resetBtn.addEventListener('click', ()=> {
  but.forEach((button) => {
      button.disabled=false
      button.style.backgroundColor= "#00bfa5";
    });
  });