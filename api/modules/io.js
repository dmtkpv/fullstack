import { Server } from 'socket.io'
import { use, jwt, createQueue, sleep } from '#api/index.js'



// -----------------
// Data
// -----------------

const { APP_URL } = process.env;

const io = new Server({
    connectionStateRecovery: {},
    cors: {
        origin: APP_URL,
    }
});



// -----------------
// Toggle room
// -----------------

const toggleRoom = (socket, { id, action }) => use(socket.locals, async ({ type, db, rooms }) => {

    if (action === 'leave') {
        socket.leave(`rooms.${id}`);
        socket.leave(`rooms.${id}.${type}`);
        return;
    }
    if (action === 'blur') {
        socket.leave(`rooms.${id}.${type}`);
        return
    }

    if (action === 'join' && socket.rooms.has(`rooms.${id}`)) {
        return;
    }

    if (action === 'focus' && socket.rooms.has(`rooms.${id}.${type}`)) {
        return;
    }

    const room = await db('rooms').query('rooms', 'filter').pk(id).select('rooms.id', 'rooms.candidate');
    if (!room) return;

    socket.join(`rooms.${id}`);
    socket.join(`rooms.${id}.${type}`);

    await rooms.read(room, type);

})



// -----------------
// Connection
// -----------------

io.on('connection', (socket) => {

    const { token } = socket.handshake.query;

    try {

        function roomAction (room, action) {
            socket.queue ??= {};
            socket.queue[room] ??= createQueue(toggleRoom.bind(null, socket));
            socket.queue[room]({ id: room, action });
        }

        socket.locals = jwt.verify(token);
        socket.join(socket.locals.user);

        socket.on('join', room => {
            roomAction(room, 'join');
        });

        socket.on('leave', room => {
            roomAction(room, 'leave');
        });

        socket.on('focus', room => {
            roomAction(room, 'focus');
        });

        socket.on('blur', room => {
            roomAction(room, 'blur');
        });

    }
    catch (e) {
        socket.disconnect()
    }

});



// -----------------
// Helpers
// -----------------

function isActive (room) {
    const details = io.sockets.adapter.rooms.get(room);
    return details && details.size > 0;
}

function inApp (users) {
    return users.filter(isActive)
}



// -----------------
// Exports
// -----------------

export default Object.assign(io, {
    isActive,
    inApp
})