const socket = io('https://stream1999.herokuapp.com/');


socket.on('LIST_ONLINE_USER', onlineUser => {
    onlineUser.forEach(user => {
        console.log(user);
        const { username, id } = user;
        $('#ulUser').append(`<h4 id="${id}">${username} <button>Call tml ${username}</button></h4>`);
    });

    socket.on('NEW_USER_JOIN', user => {
        console.log(user);
        const { username, id } = user;
        $('#ulUser').append(`<h4 id="${id}">${username} <button>Call tml ${username}</button></h4>`)
    })

    socket.on('DISCONNECT', id => {
        $(`#${id}`).remove();
    });

    socket.on('USER_NAME_EXITS', user_id => {
        $(`#${user_id}`).remove();
    });
})

function openCallVideo() {
    return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
}

function playVideo(idTagName, stream) {
    const video = document.getElementById(idTagName);
    video.srcObject = stream;
    video.play();
}
//Cho phép trình duyệt thực hiện cuộc gọi
openCallVideo().then(stream => playVideo('localVideo', stream));

const peer = new Peer({ key: 'jc6q9vr2m27w4s4i' });

peer.on('open', function (id) {
    $('#my_id').append(id);
    // $('#btnUserName').on('click', function(){
    //     const userName = $('#userName').val();
    socket.emit('USER_NAME', { username: id, id: id });
    // })
});

//Người gọi
$('#btnCall').on('click', function () {
    const id = $('#videoID').val();
    openCallVideo().then(stream => {
        playVideo('localVideo', stream);
        const call = peer.call(id, stream);
        call.on('stream', remote => playVideo('remoteVideo', stream));
    });


});

//Người nhận cuộc goi
peer.on('call', function (call) {
    openCallVideo().then(stream => {
        call.answer(stream);
        playVideo('localVideo', stream);
        call.on('stream', remote => playVideo('remoteVideo', stream));
    })

});

$('#ulUser').on('click', 'h4', function () {
    const id = $(this).attr('id');

    openCallVideo().then(stream => {
        playVideo('localVideo', stream);
        const call = peer.call(id, stream);
        call.on('stream', remote => playVideo('remoteVideo', stream));
    });
});