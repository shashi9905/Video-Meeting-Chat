document.addEventListener('DOMContentLoaded', async function () {
    const APP_ID = 'efb107e5a1414fff9d3cc87cc9cfc452';
    const CHANNEL = sessionStorage.getItem('room');
    const TOKEN = sessionStorage.getItem('token');
    let UID = Number(sessionStorage.getItem('UID'));
    const NAME = sessionStorage.getItem('name');

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    let localTracks = [];
    let remoteUsers = {};

    let joinAndDisplayLocalStream = async () => {
        document.getElementById('room-name').innerText = CHANNEL;

        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        try {
            await client.join(APP_ID, CHANNEL, TOKEN, UID);
        } catch (error) {
            console.error(error);
            alert('Failed to join the channel. Please try again.');
            window.open('/', '_self');
            return;
        }

        localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        let member = await createMember();

        let player = `<div class="video-container" id="user-container-${UID}">
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>`;

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        localTracks[1].play(`user-${UID}`);
        await client.publish(localTracks);
    };

    let handleUserJoined = async (user, mediaType) => {
        remoteUsers[user.uid] = user;
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            let player = document.getElementById(`user-container-${user.uid}`);

            if (player != null) {
                player.remove();
            }
            
            // Corrected variable name from 'memeber' to 'member'
            let member = await getMember(user);

            player = `<div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                <div class="video-player" id="user-${user.uid}"></div>
            </div>`;

            document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
            user.videoTrack.play(`user-${user.uid}`);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    };

    let handleUserLeft = async (user) => {
        delete remoteUsers[user.uid];
        document.getElementById(`user-container-${user.uid}`).remove();
    };

    let leaveAndRemoveStream = async () => {
        localTracks.forEach((track) => {
            track.stop();
            track.close();
        });

        await client.leave();
        window.open('/', '_self');
    };

    let toggleCamera = async () => {
        if (localTracks[1].muted) {
            await localTracks[1].setMuted(false);
            document.getElementById('camera-btn').style.backgroundColor = '#fff';
        } else {
            await localTracks[1].setMuted(true);
            document.getElementById('camera-btn').style.backgroundColor = 'rgba(255, 80, 80, 1)';
        }

        // Call createMember function
        let member = await createMember();
        console.log('Member created:', member);
    };

    // Corrected the placement of getMember function
    let getMember = async (user) => {
        let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`);
        let member = await response.json();
        return member;
    };

    // Ensure 'leave-btn' is available in the DOM before attaching the event listener
    document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveStream);
    document.getElementById('camera-btn').addEventListener('click', toggleCamera);

    joinAndDisplayLocalStream();
});



