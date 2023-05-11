import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client: any, ...args: any[]) {
        // Handle new client connection
    }

    handleDisconnect(client: any) {
        // Handle client disconnection
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any) {
        // Handle incoming message event
    }
}