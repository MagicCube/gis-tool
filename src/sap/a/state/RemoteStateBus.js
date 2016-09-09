import StateBus from "./StateBus";

export default class RemoteStateBus extends StateBus
{
    metadata = {
        properties: {
            masterMode: { type: "boolean", defaultValue: false },
            namespace: { type: "string", defaultValue: "/state-bus" },
            roomId: { type: "string" },
            roomName: { type: "string" },
        },
        events: {
            busyStateChange: { },
            masterLeave: { }
        }
    };

    init()
    {
        super.init();
        this._setStateTimer = null;
        this._version = null;
        this._busyState = false;
    }

    afterInit()
    {
        this._initSocket();
        let initialState = null;
        // initialState could be a JSON object or a Promise object
        if (this.getMasterMode())
        {
            initialState = this.getInitialState();
        }
        else
        {
            initialState = this._getSlaveInitialState();
        }
        Promise.resolve(initialState).then(result => {
            this._setInitialState(result);
        });
    }

    _getRooms()
    {
        return new Promise((resolve, reject) => {
            this._socket.emit("get all rooms", null, res => {
                if (res.status === "success")
                {
                    resolve(res.data);
                }
                else
                {
                    reject(res.info);
                }
            });
        });
    }

    _initSocket()
    {
        this._socket = io(this.getNamespace());
        this._socket.on("set client state", res => {
            this._model.setData(res.state);
            this._setVersion(res.version);
        });
        this._socket.on("master leave", res => {
            this.fireMasterLeave();
        });
    }

    _getSlaveInitialState()
    {
        return new Promise((resolve, reject) => {
            this._socket.on("connect", () => {
                this._socket.emit("join room", {
                    id: this.getRoomId()
                }, res => {
                    if (res.status === "success")
                    {
                        this._setVersion(res.data.version);
                        resolve(res.data.state);
                    }
                });
            });
        });
    }

    _setInitialState(state)
    {
        if (this.getMasterMode())
        {
            this._socket.emit("new room", {
                id: this.getRoomId(),
                name: this.getRoomName(),
                state
            }, res => {
                if (res.status === "success")
                {
                    this._setVersion(res.data.version);
                    this.setRoomId(res.data.id);
                }
                else
                {
                    throw new Error(`#_setInitialState: ${res.info}`);
                }
            });
        }
        super._setInitialState(state);
    }

    setState(path, value)
    {
        super.setState(path, value);
        if (this._setStateTimer)
        {
            clearTimeout(this._setStateTimer);
            this._setStateTimer = null;
        }
        this._setStateTimer = setTimeout(() => {
            this._setBusyState(true);
            this._socket.emit("set server state", {
                state: this._model.getData(),
                version: this._getVersion()
            }, res => {
                this._setVersion(res.data.version);
                this._setBusyState(false);
            });
        }, 300);
    }

    getBusyState() {
        return this._busyState;
    }

    _setBusyState(value) {
        this._busyState = value;
        this.fireBusyStateChange();
    }

    _setVersion(value) {
        this._version = value;
    }

    _getVersion() {
        return this._version;
    }
}
