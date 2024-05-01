import express, { Application } from 'express';
import cors from 'cors';

import chalk from 'chalk';
import moment from 'moment';
import multer from 'multer';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import presupuesto from '../routes/presupuesto.route';
import { ConnectionDB } from '../db/dbConecction';
config();
export class Server {
  public paths = {
    presupuesto: '/api/presupuesto',
  };
  public app: Application;
  public port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8080';

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    try {
      await ConnectionDB.db.authenticate();
      console.log(
        chalk.greenBright(
          'Conectado a la BD!!',
          ConnectionDB.db.getDatabaseName(),
        ),
      );
    } catch (error) {
      console.log(chalk.red('Hable con el administrador:: ', error));
    }
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());
    this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    // const storage = multer.diskStorage({ destination: '/uploads/' });
    // const upload = multer({
    //   storage: storage,
    //   dest: '/uploads/',
    //   limits: { fileSize: 5 * 1024 * 1024 }, // Establece el límite de tamaño del archivo a 1 MB
    // });
    // this.app.use(upload.any());
    //  this.app.use(fileUpload({
    //         useTempFiles: true,
    //         tempFileDir: '/tmp/',
    //         createParentPath: true,
    //     }));
    // Directorio Público
    this.app.use(express.static('./src/public'));
    this.app.use(express.static('./src/templates'));
  }

  routes() {
    this.app.use(this.paths.presupuesto, presupuesto);
  }

  listen() {
    const log = console.log;
    this.app.listen(this.port, () => {
      log(
        `${chalk.greenBright(moment().format('D/MM/YYYY h:mm a'))} : ${chalk.green('Servidor corriendo en puerto')}`,
        chalk.green(this.port),
      );
    });
  }
}
