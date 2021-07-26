import { Socket, io } from 'socket.io-client';
import { Actions } from '../State/Store';
import { NoteItem } from '../Database/NoteClient';
import { Dispatch } from 'react';

export class SocketIo {
    private static _instance: SocketIo;

    public socket: Socket;
    public dispatch: Dispatch<Actions>;

    constructor(dispatch: Dispatch<Actions>) {
        this.socket = io('localhost:9000');
        this.dispatch = dispatch;
        this.socket
            .on('connect', () => {
                console.log('WS Connected');
            })
            .on('set-list-id', (id: string) => {
                const lists: string[] = JSON.parse(localStorage.getItem('currentListID') || '[]');
                localStorage.setItem('currentListID', JSON.stringify(new Set([...lists, id])));
                console.log('Set List ID');
            })
            .on('update-list', (list: NoteItem[]) => {
                console.log('List Received');
                console.log({list});
                dispatch({type: 'SetNotes', payload: list});
            });
        SocketIo._instance = this;
    }

    public static getInstance = (): SocketIo => SocketIo._instance;

}
