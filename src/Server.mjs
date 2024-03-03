import { bedrock, Connection, Player as BPlayer } from './utils/ProtocolFix.mjs'
import { EventEmitter, Event } from '@kotinash/better-events'
import { EventType } from './events/EventType.mjs'
import { Address } from './network/Address.mjs'
import { Logger } from './logger/Logger.mjs'
import { Language } from './config/Language.mjs'

class Server {
    /** @type {Address} */
    address

    /** @type {string} */
    motd

    /** @type {string} */
    name

    /** @type {Logger} */
    logger = new Logger()

    /** @type {import("frog-protocol").Server | undefined} */
    _server

    /**
     * @param {Address} address 
     * @param {string} [motd]
     * @param {string} [name]
     */
    constructor(
        address,
        motd = "A GreenFrog Server",
        name = "Default"
    ) {
        this.address = address
        this.motd = motd
        this.name = name
    }

    listen() {
        Logger.info(Language.get_key("server.starting", [ this.name ]))

        this._server = bedrock.createServer({
            host: this.address.host,
            port: Number(this.address.port),
            motd: {
                motd: this.motd,
                levelName: "GreenFrog"
            }
        })

        this._server.on("connect", (connection) => {
            EventEmitter.emit(
                new Event(
                    EventType.PlayerConnectionInitialized,
                    {
                        connection
                    },
                    (() => {
                        this.#handle_connection(connection)
                    })
                )
            )
        })
    }

    /**
     * @param {Connection} connection 
     */
    #handle_connection(connection) {
        /** @param {BPlayer} player */
        connection.on("join", (player) => {
        })

        connection.on("close", () => {
            // TODO
        })
    }

    shutdown() {
        this._server?.close()
    }
}

export { Server }