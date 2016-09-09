import io from "../io";

const rooms = {};

const stateBus = io.of("/state-bus");
stateBus.on("connection", socket => {
    socket.on("new room", (data, cb) => {
        socket.isMaster = true;
        const roomId = data.id;
        rooms[roomId] = {
            id: roomId,
            name: data.name,
            state: data.state,
            version: 0,
            masterId: socket.id
        };
        socket.join(roomId);
        socket.roomId = roomId;
        console.log(`StateBus> New room[${roomId}] has been created.`);
        cb({
            status: "success",
            info: "",
            data: rooms[roomId]
        });
    });

    socket.on("join room", (data, cb) => {
        const cbData = {};
        const roomId = data.id;
        const room = rooms[roomId];
        if (room)
        {
            socket.join(roomId);
            socket.roomId = roomId;
            cbData.status = "success";
            cbData.info = "";
            cbData.data = {
                name: room.name,
                state: room.state,
                version: room.version
            };
            console.log(`StateBus> A new salve socket has joined room[${roomId}].`);
        }
        else
        {
            cbData.status = "fail";
            cbData.info = "The room you join does not exist.";
            cbData.data = null;
            console.error(`StateBus> Error when a new salve socket try to join room[${roomId}].`);
        }
        cb(cbData);
    });

    socket.on("set server state", (data, cb) => {
        const room = rooms[socket.roomId];
        if (!room)
        {
            return;
        }

        if (data.version === room.version)
        {
            room.state = data.state;
            room.version++;
            socket.broadcast.emit("set client state", {
                state: room.state,
                version: room.version
            });

            cb({
                status: "success",
                info: "Get lastest version",
                data: {
                    version: room.version
                }
            });
        }
        else
        {
            cb({
                status: "fail",
                info: "Current version is lower than server.",
                data: {
                    version: room.version
                }
            });
        }
    });

    socket.on("disconnect", (res) => {
        console.log(`StateBus> A socket has been disconnected.`);
        if (socket.isMaster)
        {
            const roomId = socket.roomId;
            socket.leave(roomId);
            rooms[roomId] = null;
            delete rooms[roomId];
            socket.broadcast.emit("master leave", {});
            console.log(`StateBus> Master of room[${roomId}] has left. This room has been removed accordingly.`);
        }
    });
});

export default stateBus;
