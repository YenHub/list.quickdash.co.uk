import { Server, Socket } from 'socket.io';
import { Log, Err, MessageSources } from '../utils/logger';
import {
    getList,
    createList,
    updateList,
    deleteList,
} from '../ws-controllers/listController';

export class SocketInit {
    private static _instance: SocketInit;

    public io: Server;

    constructor(io: Server) {
        this.io = io;
        this.registerListeners();
        SocketInit._instance = this;
    }

    private registerListeners = (): void => {
        // Connection Listener
        this.io.on('connection', (socket: Socket) => {
            this.ioLog('User connected');
            // Message Listeners
            socket
                .on('get-list', listId => {
                    getList(listId)
                        .then(list => {
                            if(!list) {
                                throw new Error(`List ID: ${listId} not found`);
                            }
                            this.ioLog(`GET-LIST ID: ${list.getDataValue('id')}`);
                            socket.emit('update-list', list);
                        })
                        .catch(err => this.ioLogErr(err));
                })
                .on('create-list', list => {
                    createList(list)
                        .then(list => {
                            socket.emit('set-list-id', list.getDataValue('id'));
                            this.ioLog(`CREATE-LIST ID: ${list.getDataValue('id')}`);
                        })
                        .catch(err => this.ioLogErr(err));
                })
                .on('update-list', ({id, list}) => {
                    this.ioLog(`UPDATE-LIST ID: ${id}`);
                    updateList(id, list)
                        .catch( err => this.ioLogErr(err));
                })
                .on('delete-list', (id: string) => {
                    this.ioLog(`DELETE-LIST ID: ${id}`);
                    deleteList(id).catch( err => this.ioLogErr(err));
                })
                .on('disconnect', () => this.ioLog('User disconnected'));
        });
    }

    public static getInstance = (): SocketInit => SocketInit._instance;

    public publishEvent = (event: any, data: any) => this.io.emit(event, data);

    public ioLog = Log(MessageSources.WSClient);
    public ioLogErr = Err(MessageSources.WSClient);
}
