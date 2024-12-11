import io from 'socket.io-client'
import { getCurrentInstance, onUnmounted } from 'vue'

export default function ({ ssr, state }) {



    // -------------------
    // Common
    // -------------------

    const socket = io(API_URL, {
        autoConnect: false
    });



    // -------------------
    // Methods
    // -------------------

    function connect (token) {
        if (ssr) return;
        socket.io.opts.query = { token };
        socket.connect();
    }

    function disconnect () {
        if (ssr) return;
        socket.disconnect();
    }

    function emit (event, data) {
        if (ssr) return;
        socket.emit(event, data);
    }

    function on (event, callback) {
        if (ssr) return;
        socket.on(event, callback);
        getCurrentInstance() && onUnmounted(() => {
            socket.off(event, callback);
        })
    }



    // -------------------
    // Exports
    // -------------------

    return {
        connect,
        disconnect,
        emit,
        on
    }



}