import * as signalR from '@microsoft/signalr';
import { apiUrl } from './config';
export   let connection = new signalR.HubConnectionBuilder()
.withUrl(`${apiUrl}/hub/`)
.build();