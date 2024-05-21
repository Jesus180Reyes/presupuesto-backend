import {config} from 'dotenv';
import { Server } from './src/models/server';

config();

const server  = new Server();

server.listen();