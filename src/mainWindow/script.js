document.addEventListener('DOMContentLoaded', ()=>{

    // Selectors
    const container = document.getElementById('container');
    const display = document.querySelector('#display')
    const record = document.querySelector('#record')
    const micInput = document.querySelector('#mic')

    // Declarations
    let isRecording = false
    let selectedDeviceId = null

    // Get available devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device =>{
            if(device.kind === "audioinput"){
                if(!selectedDeviceId){
                    selectedDeviceId = device.deviceId
                }
                const option = document.createElement('option')
                option.value = device.deviceId 
                option.text = device.label

                micInput.appendChild(option)
            }
        })
    })

    micInput.addEventListener('change', (event)=>{
        selectedDeviceId = event.target.value;
        console.log(selectedDeviceId)
    })

    // Functions
    
    function updateButtonTo(recording){
        if(recording){
            container.querySelector('#record').classList.add('recording');
            container.querySelector('#mic-icon').classList.add('hide');
        } else {
            container.querySelector('#record').classList.remove('recording');
            container.querySelector('#mic-icon').classList.remove('hide');
        }
    }

})

window.onload = () =>{
    document.body.classList.remove('preload')
}