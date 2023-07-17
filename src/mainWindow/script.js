document.addEventListener('DOMContentLoaded', ()=>{

    const container = document.getElementById('container');

    setTimeout(()=>{
        container.querySelector('#record').classList.add('recording');
        container.querySelector('#mic-icon').classList.add('hide');
    }, 1500)

})

window.onload = () =>{
    document.body.classList.remove('preload')
}