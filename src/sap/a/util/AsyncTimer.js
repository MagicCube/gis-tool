import ManagedObject from "sap/ui/base/ManagedObject";

export default class AsyncTimer extends ManagedObject
{
    metadata = {
        properties: {
            interval: { type: "int", defaultValue: 1000 },
            delay: { type: "int", defaultValue: 0 },
            task: { type: "any", defaultValue: null },
            autoStart: { type: "boolean", defaultValue: false }
        },
        events: {
            stateChange: { }
        }
    };

    constructor(...args)
    {
        super(...args);
        this.afterInit();
    }

    init()
    {
        this._state = 0;
    }

    afterInit()
    {
        if (this.getAutoStart())
        {
            setTimeout(() => {
                this.start();
            }, this.getDelay());
        }
    }

    getState()
    {
        return this._state;
    }

    isRunning()
    {
        return this.getState() === 1;
    }

    setRunning(value)
    {
        if (value)
        {
            this.start();
        }
        else
        {
            this.stop();
        }
    }

    setTask(value)
    {
        if (value && typeof(value) !== "function")
        {
            throw new Error("'task' property must be an async function or a function which retuns a Promise object.");
        }
        this.setProperty("task", value);
    }

    start()
    {
        if (!this.isRunning())
        {
            if (this._timeout)
            {
                clearTimeout(this._timeout);
            }
            this._setState(1);
            this._pollingLoop();
        }
        else
        {
            console.warn("Timer has already been started.");
        }
    }

    stop()
    {
        this._setState(0);
        if (this._timeout)
        {
            clearTimeout(this._timeout);
        }
    }

    toggle(running)
    {
        this.setRunning(running);
    }



    _setState(state)
    {
        if (this.getState() !== state)
        {
            this._state = state;
            this.fireStateChange();
        }
    }


    async _pollingLoop()
    {
        await this._polling();
        if (this.isRunning())
        {
            this._timeout = setTimeout(this._pollingLoop.bind(this), this.getInterval());
        }
    }

    async _polling()
    {
        const task = this.getTask();
        if (task)
        {
            if (this.isRunning())
            {
                await task();
            }
        }
        else
        {
            throw new Error("Async task has not been defined yet.");
        }
    }
}
